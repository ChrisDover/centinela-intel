import type { Metadata } from 'next';
import { HeroSection } from './sections/HeroSection';
import { ThreatBanner } from './sections/ThreatBanner';
import { ProductLadder } from './sections/ProductLadder';
import { SampleBrief } from './sections/SampleBrief';
import { DashboardPreview } from './sections/DashboardPreview';
import { CompetitivePositioning } from './sections/CompetitivePositioning';
import { MoatsSection } from './sections/MoatsSection';
import { SecureAIPreview } from './sections/SecureAIPreview';
import { AboutSection } from './sections/AboutSection';
import { CTASection } from './sections/CTASection';

export const metadata: Metadata = {
  title: "Centinela AI — The $200K Intelligence Platform, Starting Free",
  description: "Dataminr charges $240K/yr. Crisis24 quotes six figures. Centinela delivers the same LatAm security intelligence from $29/mo — or start with a free daily brief. 1,600 owned GPUs. 22 countries. Operator-built.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ThreatBanner />
      <ProductLadder />
      <SampleBrief />
      <DashboardPreview />
      <CompetitivePositioning />
      <MoatsSection />
      <SecureAIPreview />
      <AboutSection />
      <CTASection />
    </>
  );
}
