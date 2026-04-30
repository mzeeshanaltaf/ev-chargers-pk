import Link from "next/link";

const TOP_CITIES = [
  { name: "Karachi", slug: "karachi" },
  { name: "Lahore", slug: "lahore" },
  { name: "Islamabad", slug: "islamabad" },
  { name: "Rawalpindi", slug: "rawalpindi" },
  { name: "Faisalabad", slug: "faisalabad" },
  { name: "Peshawar", slug: "peshawar" },
  { name: "Multan", slug: "multan" },
  { name: "Quetta", slug: "quetta" },
];

export function PageFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16 py-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 text-sm text-text-secondary">

        {/* Browse by City */}
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Browse EV Chargers by City</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {TOP_CITIES.map(({ name, slug }) => (
              <Link
                key={slug}
                href={`/chargers/${slug}`}
                className="text-xs text-text-secondary/70 hover:text-brand transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col items-center gap-3">
          <p className="text-xs text-text-secondary/50">Developed with 💖 by Zeeshan Altaf for PAK EVs Community</p>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
            <p>&copy; {year} ChargeMap PK. All rights reserved.</p>
            <nav className="flex items-center gap-4">
              <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
              <Link href="/stats" className="hover:text-text-primary transition-colors">Stats</Link>
              <Link href="/credits" className="hover:text-text-primary transition-colors">Credits</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
