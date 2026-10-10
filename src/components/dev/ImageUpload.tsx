import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useDevAuth } from '@/contexts/DevAuthContext';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  multiple?: boolean;
}

export function ImageUpload({ onUploadComplete, currentUrl, multiple }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const { token } = useDevAuth();
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      
      // Upload to server
      setIsUploading(true);
      try {
        const { data, error } = await supabase.functions.invoke('upload-image', {
          body: {
            image: base64,
            filename: file.name,
            contentType: file.type,
          },
          headers: {
            'x-dev-token': token!,
          },
        });

        if (error) throw new Error(error.message);
        if (!data.success) throw new Error(data.error);

        onUploadComplete(data.url);
        if (multiple) setPreview(null);
        toast({
          title: 'Sucesso',
          description: 'Imagem enviada com sucesso!',
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao enviar imagem',
          variant: 'destructive',
        });
        setPreview(currentUrl || null);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [token, onUploadComplete, toast, currentUrl, multiple]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    (multiple ? files : files.slice(0, 1)).forEach(handleFile);
  }, [handleFile, multiple]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    (multiple ? files : files.slice(0, 1)).forEach(handleFile);
    e.target.value = '';
  }, [handleFile, multiple]);

  const clearImage = useCallback(() => {
    setPreview(null);
    onUploadComplete('');
  }, [onUploadComplete]);

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-10 w-10 mb-3 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                </p>
                <p className="text-xs text-muted-foreground">
                  {multiple ? 'Várias imagens de uma vez · ' : ''}PNG, JPG ou WEBP (max. 5MB)
                </p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            multiple={multiple}
            onChange={handleInputChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
