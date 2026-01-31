import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  key: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { key }: RequestBody = await req.json();
    
    if (!key) {
      console.log('No key provided');
      return new Response(
        JSON.stringify({ error: 'Chave não fornecida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const devAccessKey = Deno.env.get('DEV_ACCESS_KEY');
    
    if (!devAccessKey) {
      console.error('DEV_ACCESS_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor inválida' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Compare keys securely
    if (key !== devAccessKey) {
      console.log('Invalid key attempt');
      return new Response(
        JSON.stringify({ error: 'Chave de acesso inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a simple token (timestamp + random string)
    const token = btoa(JSON.stringify({
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      iat: Date.now(),
      type: 'dev_access'
    }));

    console.log('Valid key - token generated');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        message: 'Acesso autorizado'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
