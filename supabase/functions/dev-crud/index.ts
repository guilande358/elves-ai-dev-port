import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-token',
};

interface CrudRequest {
  action: 'create' | 'update' | 'delete';
  table: 'projects' | 'skills' | 'profile_settings';
  data?: Record<string, unknown>;
  id?: string;
}

function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.type !== 'dev_access') return false;
    if (Date.now() > decoded.exp) return false;
    return true;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate dev token
    const devToken = req.headers.get('x-dev-token');
    
    if (!validateToken(devToken)) {
      console.log('Invalid or expired token');
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, table, data, id }: CrudRequest = await req.json();

    // Validate table name
    const allowedTables = ['projects', 'skills', 'profile_settings'];
    if (!allowedTables.includes(table)) {
      return new Response(
        JSON.stringify({ error: 'Tabela não permitida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;

    switch (action) {
      case 'create':
        if (!data) {
          return new Response(
            JSON.stringify({ error: 'Dados não fornecidos' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await supabase.from(table).insert(data).select().single();
        break;

      case 'update':
        if (!id || !data) {
          return new Response(
            JSON.stringify({ error: 'ID ou dados não fornecidos' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await supabase.from(table).update(data).eq('id', id).select().single();
        break;

      case 'delete':
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID não fornecido' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await supabase.from(table).delete().eq('id', id);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Ação não permitida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`${action} on ${table} successful`);
    
    return new Response(
      JSON.stringify({ success: true, data: result.data }),
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
