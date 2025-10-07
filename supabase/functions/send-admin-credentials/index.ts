import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminCredentialsRequest {
  email: string;
  username: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username, password }: AdminCredentialsRequest = await req.json();

    console.log("Sending admin credentials email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Admin Panel <onboarding@resend.dev>",
      to: [email],
      subject: "Your Admin Panel Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; margin-bottom: 20px;">Admin Credentials Updated</h1>
          <p style="color: #666; line-height: 1.6;">
            Your admin panel credentials have been successfully updated. Please save these credentials in a secure location.
          </p>
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">
            <strong>Important:</strong> Make sure to copy these credentials now. For security reasons, passwords are encrypted in the database and cannot be retrieved later.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request this change, please contact support immediately.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-credentials function:", error);
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
