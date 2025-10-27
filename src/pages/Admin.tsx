import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Briefcase, TrendingUp, Edit, Ban, CheckCircle, LogOut, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { calcularCompatibilidade } from "@/lib/matching";

interface DashboardStats {
  total_visitors: number;
  total_viajantes: number;
  total_conselheiros: number;
}

interface Viajante {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp: string | null;
  linkedin_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface Conselheiro {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp: string | null;
  linkedin_url: string | null;
  areas_atuacao: string[];
  anos_experiencia: number;
  arquetipo: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface Match {
  id?: string;
  viajante: Viajante;
  conselheiro: Conselheiro;
  score: number;
  status?: string;
  criado_por?: string;
  notas_admin?: string;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viajantes, setViajantes] = useState<Viajante[]>([]);
  const [conselheiros, setConselheiros] = useState<Conselheiro[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<"viajante" | "conselheiro" | null>(null);
  const [showManualMatchDialog, setShowManualMatchDialog] = useState(false);
  const [selectedViajante, setSelectedViajante] = useState<string>("");
  const [selectedConselheiro, setSelectedConselheiro] = useState<string>("");

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !roleData) {
        toast.error("Acesso negado. Você não tem permissão de administrador.");
        navigate("/");
        return;
      }

      loadDashboardData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const { data: statsData, error: statsError } = await supabase.rpc("get_dashboard_stats");
      if (statsError) throw statsError;
      setStats(statsData?.[0] || null);

      // Load viajantes
      const { data: viajantesData, error: viajantesError } = await supabase
        .from("viajantes")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (viajantesError) throw viajantesError;
      setViajantes(viajantesData || []);

      // Load conselheiros
      const { data: conselheirosData, error: conselheirosError } = await supabase
        .from("conselheiros")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (conselheirosError) throw conselheirosError;
      setConselheiros(conselheirosData || []);

      // Load existing matches from database
      await loadMatches(viajantesData || [], conselheirosData || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Erro ao carregar dados do painel");
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (viajantesList: Viajante[], conselheirosList: Conselheiro[]) => {
    try {
      // Load saved matches from database
      const { data: savedMatches, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .order("created_at", { ascending: false });

      if (matchError) throw matchError;

      // Create match objects with full viajante and conselheiro data
      const matchesWithData: Match[] = (savedMatches || [])
        .map((match) => {
          const viajante = viajantesList.find((v) => v.id === match.viajante_id);
          const conselheiro = conselheirosList.find((c) => c.id === match.conselheiro_id);
          
          if (viajante && conselheiro) {
            return {
              id: match.id,
              viajante,
              conselheiro,
              score: match.score,
              status: match.status,
              criado_por: match.criado_por,
              notas_admin: match.notas_admin,
            };
          }
          return null;
        })
        .filter((m) => m !== null) as Match[];

      // Also calculate suggested matches for viajantes without matches
      const viajantesComMatch = new Set(matchesWithData.map(m => m.viajante.id));
      
      for (const viajante of viajantesList.filter((v) => v.status === "active" && !viajantesComMatch.has(v.id))) {
        const { data: respostasData } = await supabase
          .from("diagnostico_respostas")
          .select("respostas")
          .eq("viajante_id", viajante.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (respostasData?.respostas) {
          const respostas = respostasData.respostas as any;
          
          let bestMatch: Match | null = null;
          let bestScore = 0;

          for (const conselheiro of conselheirosList.filter((c) => c.status === "active")) {
            const conselheiroFormatted = {
              id: conselheiro.id,
              nome: conselheiro.nome_completo,
              foto_url: "",
              mini_bio: "",
              areas: conselheiro.areas_atuacao || [],
              nivel_experiencia: conselheiro.anos_experiencia >= 10 ? "avancado" : conselheiro.anos_experiencia >= 5 ? "intermediario" : "iniciante",
              publicos_apoio: [],
              temas_preferidos: conselheiro.areas_atuacao || [],
              estilo: conselheiro.arquetipo || "",
              formato: "",
            };

            const score = calcularCompatibilidade(respostas, conselheiroFormatted);
            
            if (score > bestScore) {
              bestScore = score;
              bestMatch = {
                viajante,
                conselheiro,
                score,
                criado_por: "sugestao",
              };
            }
          }

          if (bestMatch && bestScore >= 60) {
            matchesWithData.push(bestMatch);
          }
        }
      }

      setMatches(matchesWithData);
    } catch (error) {
      console.error("Error loading matches:", error);
    }
  };

  const createManualMatch = async () => {
    if (!selectedViajante || !selectedConselheiro) {
      toast.error("Selecione um viajante e um conselheiro");
      return;
    }

    try {
      const { error } = await supabase
        .from("matches")
        .insert({
          viajante_id: selectedViajante,
          conselheiro_id: selectedConselheiro,
          score: 100,
          status: "pendente",
          criado_por: "manual",
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("Este match já existe");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Match manual criado com sucesso!");
      setShowManualMatchDialog(false);
      setSelectedViajante("");
      setSelectedConselheiro("");
      loadDashboardData();
    } catch (error) {
      console.error("Error creating manual match:", error);
      toast.error("Erro ao criar match manual");
    }
  };

  const deleteMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", matchId);

      if (error) throw error;

      toast.success("Match removido");
      loadDashboardData();
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Erro ao remover match");
    }
  };

  const updateMatchStatus = async (matchId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("matches")
        .update({ status: newStatus })
        .eq("id", matchId);

      if (error) throw error;

      toast.success("Status do match atualizado");
      loadDashboardData();
    } catch (error) {
      console.error("Error updating match status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const updateStatus = async (id: string, type: "viajante" | "conselheiro", newStatus: string) => {
    try {
      const table = type === "viajante" ? "viajantes" : "conselheiros";
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Status atualizado para ${newStatus}`);
      loadDashboardData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const updateAdminNotes = async (id: string, type: "viajante" | "conselheiro", notes: string) => {
    try {
      const table = type === "viajante" ? "viajantes" : "conselheiros";
      const { error } = await supabase
        .from(table)
        .update({ admin_notes: notes })
        .eq("id", id);

      if (error) throw error;

      toast.success("Anotações salvas");
      loadDashboardData();
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Erro ao salvar anotações");
    }
  };

  const handleEdit = (item: any, type: "viajante" | "conselheiro") => {
    setEditingItem(item);
    setEditType(type);
  };

  const saveEdit = async () => {
    if (!editingItem || !editType) return;

    try {
      const table = editType === "viajante" ? "viajantes" : "conselheiros";
      const { error } = await supabase
        .from(table)
        .update(editingItem)
        .eq("id", editingItem.id);

      if (error) throw error;

      toast.success("Cadastro atualizado");
      setEditingItem(null);
      setEditType(null);
      loadDashboardData();
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Erro ao salvar alterações");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel do Administrador</h1>
            <p className="text-muted-foreground">Gerencie viajantes, conselheiros e matches</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_visitors || 0}</div>
              <p className="text-xs text-muted-foreground">Leads capturados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viajantes Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_viajantes || 0}</div>
              <p className="text-xs text-muted-foreground">Cadastros completos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conselheiros Ativos</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_conselheiros || 0}</div>
              <p className="text-xs text-muted-foreground">Disponíveis para mentorias</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="viajantes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="viajantes">Viajantes</TabsTrigger>
            <TabsTrigger value="conselheiros">Conselheiros</TabsTrigger>
            <TabsTrigger value="matches">Matches Sugeridos</TabsTrigger>
          </TabsList>

          {/* Viajantes Tab */}
          <TabsContent value="viajantes">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Viajantes</CardTitle>
                <CardDescription>Gerencie os cadastros de viajantes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Anotações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viajantes.map((viajante) => (
                      <TableRow key={viajante.id}>
                        <TableCell className="font-medium">{viajante.nome_completo}</TableCell>
                        <TableCell>{viajante.email}</TableCell>
                        <TableCell>{viajante.whatsapp || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={viajante.status === "active" ? "default" : "secondary"}>
                            {viajante.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <Textarea
                            placeholder="Adicionar anotações..."
                            value={viajante.admin_notes || ""}
                            onChange={(e) => {
                              const updated = viajantes.map((v) =>
                                v.id === viajante.id ? { ...v, admin_notes: e.target.value } : v
                              );
                              setViajantes(updated);
                            }}
                            onBlur={() => updateAdminNotes(viajante.id, "viajante", viajante.admin_notes || "")}
                            className="min-h-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(viajante, "viajante")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={viajante.status === "active" ? "destructive" : "default"}
                              onClick={() =>
                                updateStatus(viajante.id, "viajante", viajante.status === "active" ? "inactive" : "active")
                              }
                            >
                              {viajante.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conselheiros Tab */}
          <TabsContent value="conselheiros">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Conselheiros</CardTitle>
                <CardDescription>Gerencie os cadastros de conselheiros</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Áreas</TableHead>
                      <TableHead>Experiência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Anotações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conselheiros.map((conselheiro) => (
                      <TableRow key={conselheiro.id}>
                        <TableCell className="font-medium">{conselheiro.nome_completo}</TableCell>
                        <TableCell>{conselheiro.email}</TableCell>
                        <TableCell>{conselheiro.areas_atuacao?.join(", ") || "-"}</TableCell>
                        <TableCell>{conselheiro.anos_experiencia} anos</TableCell>
                        <TableCell>
                          <Badge variant={conselheiro.status === "active" ? "default" : "secondary"}>
                            {conselheiro.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <Textarea
                            placeholder="Adicionar anotações..."
                            value={conselheiro.admin_notes || ""}
                            onChange={(e) => {
                              const updated = conselheiros.map((c) =>
                                c.id === conselheiro.id ? { ...c, admin_notes: e.target.value } : c
                              );
                              setConselheiros(updated);
                            }}
                            onBlur={() => updateAdminNotes(conselheiro.id, "conselheiro", conselheiro.admin_notes || "")}
                            className="min-h-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(conselheiro, "conselheiro")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={conselheiro.status === "active" ? "destructive" : "default"}
                              onClick={() =>
                                updateStatus(conselheiro.id, "conselheiro", conselheiro.status === "active" ? "inactive" : "active")
                              }
                            >
                              {conselheiro.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Matches</CardTitle>
                  <CardDescription>Matches manuais e sugestões automáticas</CardDescription>
                </div>
                <Button onClick={() => setShowManualMatchDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Match Manual
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Viajante</TableHead>
                      <TableHead>Conselheiro</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Áreas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match, index) => (
                      <TableRow key={match.id || index}>
                        <TableCell className="font-medium">{match.viajante.nome_completo}</TableCell>
                        <TableCell>{match.conselheiro.nome_completo}</TableCell>
                        <TableCell>
                          <Badge variant={match.score >= 80 ? "default" : "secondary"}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {match.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={match.criado_por === "manual" ? "default" : "outline"}>
                            {match.criado_por === "manual" ? "Manual" : "Sugestão"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {match.id && match.criado_por !== "sugestao" ? (
                            <Select
                              value={match.status}
                              onValueChange={(value) => match.id && updateMatchStatus(match.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em_contato">Em Contato</SelectItem>
                                <SelectItem value="conversa_realizada">Realizada</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>{match.conselheiro.areas_atuacao?.join(", ")}</TableCell>
                        <TableCell>
                          {match.id && match.criado_por !== "sugestao" ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => match.id && deleteMatch(match.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            match.criado_por === "sugestao" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedViajante(match.viajante.id);
                                  setSelectedConselheiro(match.conselheiro.id);
                                  setShowManualMatchDialog(true);
                                }}
                              >
                                Criar
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {matches.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Nenhum match encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cadastro</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={editingItem.nome_completo || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, nome_completo: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingItem.email || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={editingItem.whatsapp || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, whatsapp: e.target.value })}
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={editingItem.linkedin_url || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, linkedin_url: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancelar
                </Button>
                <Button onClick={saveEdit}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual Match Dialog */}
      <Dialog open={showManualMatchDialog} onOpenChange={setShowManualMatchDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Match Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Viajante</Label>
              <Select value={selectedViajante} onValueChange={setSelectedViajante}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um viajante" />
                </SelectTrigger>
                <SelectContent>
                  {viajantes
                    .filter((v) => v.status === "active")
                    .map((viajante) => (
                      <SelectItem key={viajante.id} value={viajante.id}>
                        {viajante.nome_completo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Conselheiro</Label>
              <Select value={selectedConselheiro} onValueChange={setSelectedConselheiro}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um conselheiro" />
                </SelectTrigger>
                <SelectContent>
                  {conselheiros
                    .filter((c) => c.status === "active")
                    .map((conselheiro) => (
                      <SelectItem key={conselheiro.id} value={conselheiro.id}>
                        {conselheiro.nome_completo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowManualMatchDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createManualMatch}>Criar Match</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
