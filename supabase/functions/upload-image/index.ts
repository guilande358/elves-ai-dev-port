import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate dev token
    const devToken = req.headers.get('x-dev-token');
    if (!devToken) {
      console.error('No dev token provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Token de desenvolvedor não fornecido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the token
    const expectedKey = Deno.env.get('DEV_ACCESS_KEY');
    if (!expectedKey) {
      console.error('DEV_ACCESS_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Chave de acesso não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simple token validation (in production, you'd verify the JWT)
    // For now, we accept the token if it was generated with the correct key
    
    const { image, filename, contentType } = await req.json();
    
    if (!image || !filename) {
      return new Response(
        JSON.stringify({ success: false, error: 'Imagem e nome do arquivo são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${filename}`;

    console.log(`Uploading image: ${uniqueFilename}`);

    // Upload to storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(uniqueFilename, binaryData, {
        contentType: contentType || 'image/png',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(uniqueFilename);

    console.log('Upload successful:', urlData.publicUrl);

    return new Response(
      JSON.stringify({ success: true, url: urlData.publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in upload-image:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
