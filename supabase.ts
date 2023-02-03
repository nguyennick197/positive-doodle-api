import { createClient } from '@supabase/supabase-js';
import * as dotenv from "dotenv";

dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_URL 

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE!)
