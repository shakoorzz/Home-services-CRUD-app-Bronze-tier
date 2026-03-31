'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// We use the Service Role Key here to bypass any front-end RLS issues and securely insert
// the lead data entirely on the backend. This key is never exposed to the browser.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

export async function submitLead(formData: FormData) {
  try {
    const data = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      service_type: formData.get('service_type') as string,
      message: formData.get('message') as string,
    }

    const { error } = await supabaseServer
      .from('leads')
      .insert([data])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' }
  }
}
