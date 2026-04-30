import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const BASE = "https://chargemap-pk.zeeshanai.cloud";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-text-secondary flex items-center gap-1 flex-wrap mb-4">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-text-secondary/40">/</span>}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? "text-text-primary font-medium" : ""}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
