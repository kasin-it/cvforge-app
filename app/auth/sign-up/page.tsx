import { SignUpForm } from '@/components/auth/sign-up-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - CVForge',
  description: 'Create your CVForge account',
}

export default function SignUpPage() {
  return <SignUpForm />
}
