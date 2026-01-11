import { Hammer, Github, Heart } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-12 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Hammer className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-semibold text-foreground">
                CVForge
              </span>
              <p className="text-xs text-muted-foreground">
                Craft your perfect CV
              </p>
            </div>
          </div>

          {/* Center - Made with love */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            <span>to help you land your dream job</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/kasin-it/cvforge-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/70">
            {new Date().getFullYear()} CVForge. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
