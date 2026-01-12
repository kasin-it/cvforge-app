import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/database.types'

export type AuthUser = {
  id: string
  email: string
  fullName: string | null
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user || !user.email) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    fullName: (profile as Pick<Profile, 'full_name'> | null)?.full_name ?? null,
  }
}
