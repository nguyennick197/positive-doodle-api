const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const SUPABASE_URL = process.env.SUPABASE_URL 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE)

module.exports = {
    supabase,
    SUPABASE_URL
};
