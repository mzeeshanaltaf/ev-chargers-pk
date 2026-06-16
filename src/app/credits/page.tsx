import { permanentRedirect } from "next/navigation";

// Credits now live as a section on the About page. Preserve old/external links.
export default function CreditsPage() {
  permanentRedirect("/about");
}
