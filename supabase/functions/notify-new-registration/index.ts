import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationNotification {
  type: 'conselheiro' | 'viajante';
  nome_completo: string;
  email: string;
  whatsapp?: string;
  linkedin_url?: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: RegistrationNotification = await req.json();
    
    console.log("Processing new registration:", data.type, data.email);

    const emailResponse = await resend.emails.send({
      from: "Carpe Diem <onboarding@resend.dev>",
      to: ["pathi.carpediem@gmail.com"],
      subject: `Novo cadastro pendente: ${data.type === 'conselheiro' ? 'Conselheiro' : 'Viajante'}`,
      html: `
        <h2>Novo Cadastro Pendente</h2>
        <p><strong>Tipo:</strong> ${data.type === 'conselheiro' ? 'Conselheiro' : 'Viajante'}</p>
        <p><strong>Nome:</strong> ${data.nome_completo}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.whatsapp ? `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>` : ''}
        ${data.linkedin_url ? `<p><strong>LinkedIn:</strong> ${data.linkedin_url}</p>` : ''}
        <p><strong>Data do cadastro:</strong> ${new Date(data.created_at).toLocaleString('pt-BR')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Notificação automática do sistema Carpe Diem</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
