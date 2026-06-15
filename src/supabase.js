import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ysdxycbqkzfnxazjqpit.supabase.co'
const supabaseKey = 'sb_publishable_H2FnQ3ahvEE826X945wVEw_YQk-hx-P'
export const supabase = createClient(supabaseUrl, supabaseKey)
