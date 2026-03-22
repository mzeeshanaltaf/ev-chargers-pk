import Link from "next/link";

export function PageFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16 py-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
        <p>&copy; {year} ChargeMap PK. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
