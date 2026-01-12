import Link from 'next/link'
import { Hammer } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Decorative left panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.55_0.15_55/0.15)_0%,transparent_60%)]" />

        {/* Ember particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="ember"
            style={{ left: '20%', bottom: '10%', animationDelay: '0s' }}
          />
          <div
            className="ember"
            style={{ left: '40%', bottom: '5%', animationDelay: '2s' }}
          />
          <div
            className="ember"
            style={{ left: '60%', bottom: '15%', animationDelay: '4s' }}
          />
          <div
            className="ember"
            style={{ left: '80%', bottom: '8%', animationDelay: '6s' }}
          />
          <div
            className="ember"
            style={{ left: '30%', bottom: '12%', animationDelay: '1s' }}
          />
          <div
            className="ember"
            style={{ left: '70%', bottom: '3%', animationDelay: '3s' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo with glow */}
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl animate-glow-pulse">
              <Hammer className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl -z-10" />
          </div>

          {/* Brand */}
          <Link href="/" className="text-center group">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
              CVForge
            </h1>
            <p className="text-lg text-muted-foreground">Where careers are forged</p>
          </Link>

          {/* Decorative line */}
          <div className="mt-12 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Tagline */}
          <p className="mt-8 text-sm text-muted-foreground/80 max-w-xs text-center leading-relaxed">
            Craft the perfect CV tailored to any job posting with the power of AI
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Hammer className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  CVForge
                </h1>
                <p className="text-xs text-muted-foreground">Craft your perfect CV</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Form container */}
        <main className="flex-1 flex items-center justify-center p-6">{children}</main>
      </div>
    </div>
  )
}
