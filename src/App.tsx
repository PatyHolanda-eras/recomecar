import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inscricao from "./pages/Inscricao";
import ViajanteCadastro from "./pages/ViajanteCadastro";
import Diagnostico from "./pages/Diagnostico";
import DiagnosticoResultados from "./pages/DiagnosticoResultados";
import ConselheiroPerfil from "./pages/ConselheiroPerfil";
import ConselheiroResultados from "./pages/ConselheiroResultados";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/inscricao" element={<Inscricao />} />
            <Route path="/viajante-cadastro" element={<ViajanteCadastro />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/diagnostico/resultados" element={<DiagnosticoResultados />} />
            <Route path="/conselheiro/perfil" element={<ConselheiroPerfil />} />
            <Route path="/conselheiro-resultados" element={<ConselheiroResultados />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
