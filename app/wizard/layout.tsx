import { Header } from '@/components/layout/header'
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/auth/sign-in?redirectTo=/wizard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      {children}
    </div>
  )
}
