import { SignInForm } from '@/components/auth/sign-in-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - CVForge',
  description: 'Sign in to your CVForge account',
}

export default function SignInPage() {
  return <SignInForm />
}
