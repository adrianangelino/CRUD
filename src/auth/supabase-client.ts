import 'dotenv/config';
import { createClient, User } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

export async function validateSupabaseToken(token: string): Promise<User> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    console.error('Erro Supabase:', error, 'Token:', token);
    throw new Error('Token inválido ou usuário não encontrado');
  }

  return data.user;
}
