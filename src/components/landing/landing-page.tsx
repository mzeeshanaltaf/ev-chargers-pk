import { PageFooter } from "@/components/page-footer";
import { LandingHeader } from "./landing-header";
import { Hero } from "./hero";
import { LiveStats, type Stat } from "./live-stats";
import { Features } from "./features";
import { PopularCities, type CityEntry } from "./popular-cities";
import { HowItWorks } from "./how-it-works";
import { AboutTeaser } from "./about-teaser";
import { ContributeCta } from "./contribute-cta";
import { FaqTeaser } from "./faq-teaser";

interface LandingPageProps {
  chargerCount: number;
  cityCount: number;
  stats: Stat[];
  cities: CityEntry[];
  lastAddedLabel?: string;
}

export function LandingPage({ chargerCount, cityCount, stats, cities, lastAddedLabel }: LandingPageProps) {
  return (
    // `dark` resolves the shared theme tokens (used by PageFooter) to their dark
    // variants; `landing-root` layers the marketing-only palette + typography.
    <div className="landing-root dark min-h-screen">
      <LandingHeader />
      <main>
        <Hero chargerCount={chargerCount} cityCount={cityCount} lastAddedLabel={lastAddedLabel} />
        <LiveStats stats={stats} />
        <Features />
        <PopularCities cities={cities} />
        <HowItWorks />
        <AboutTeaser />
        <ContributeCta />
        <FaqTeaser />
      </main>
      <PageFooter />
    </div>
  );
}
