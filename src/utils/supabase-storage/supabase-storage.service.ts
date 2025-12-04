import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
  }

  async uploadTicketOfPdf(
    bucket: string,
    filename: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro ao fazer upload do PDF: ${error.message}`);
    }

    // Gera URL pública corretamente
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filename);

    return data.publicUrl;
  }
}
