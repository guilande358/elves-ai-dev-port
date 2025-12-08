import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const sendEmail = async (to: string[], subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission:", { name, email, subject });

    // Send notification email to Elves
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">Nova Mensagem de Contato</h2>
        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${subject ? `<p><strong>Assunto:</strong> ${subject}</p>` : ''}
        </div>
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h3 style="color: #18181b; margin-top: 0;">Mensagem:</h3>
          <p style="color: #3f3f46; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #71717a; font-size: 12px; margin-top: 20px;">
          Esta mensagem foi enviada através do formulário de contato do seu portfolio.
        </p>
      </div>
    `;

    const notificationResponse = await sendEmail(
      ["elves.guilande@email.com"],
      subject || `Nova mensagem de ${name}`,
      notificationHtml
    );

    console.log("Notification email sent:", notificationResponse);

    // Send confirmation email to the sender
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">Olá ${name}!</h2>
        <p style="color: #3f3f46;">
          Obrigado por entrar em contato comigo. Recebi sua mensagem e responderei o mais breve possível.
        </p>
        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #18181b; margin-top: 0;">Sua mensagem:</h3>
          <p style="color: #3f3f46; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #3f3f46;">
          Atenciosamente,<br>
          <strong>Elves Guilande</strong><br>
          Desenvolvedor Web
        </p>
      </div>
    `;

    const confirmationResponse = await sendEmail(
      [email],
      "Recebi sua mensagem!",
      confirmationHtml
    );

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
