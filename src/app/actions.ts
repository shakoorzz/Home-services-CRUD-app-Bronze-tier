'use server'

import { createClient } from '@supabase/supabase-js'

export async function submitLead(formData: FormData) {
  try {
    // Initialize inside the function to avoid build-time crashes if env vars are missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

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
