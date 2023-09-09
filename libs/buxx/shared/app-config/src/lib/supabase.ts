import { createClient } from '@supabase/supabase-js';
import { Database } from '@buxx/shared/model';
import { environment } from './environments/environment';

export const supabase = createClient<Database>(
  environment.supabase.url,
  environment.supabase.key
);
