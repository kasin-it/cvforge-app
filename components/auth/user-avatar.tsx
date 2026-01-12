import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-inner shadow-black/10 ring-2 ring-primary/20 select-none transition-transform hover:scale-105',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

type UserAvatarProps = VariantProps<typeof avatarVariants> & {
  name: string | null
  email: string
  className?: string
}

export function UserAvatar({ name, email, size, className }: UserAvatarProps) {
  const initial = (name?.[0] ?? email[0] ?? '?').toUpperCase()

  return (
    <div className={cn(avatarVariants({ size }), className)} aria-label={name ?? email}>
      {initial}
    </div>
  )
}
