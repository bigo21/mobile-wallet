import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import MarketSection from '@/components/MarketSection';
import SolutionsSection from '@/components/SolutionsSection';
import SoftwareUXSection from '@/components/SoftwareUXSection';
import ComparisonSection from '@/components/ComparisonSection';
import AboutPartnershipSection from '@/components/AboutPartnershipSection';
import ROISection from '@/components/ROISection';
import TeamSection from '@/components/TeamSection';
import RoadmapTestimonialsSection from '@/components/RoadmapTestimonialsSection';
import PartnerOpportunityFAQSection from '@/components/PartnerOpportunityFAQSection';
import ContactSecurityFooterSection from '@/components/ContactSecurityFooterSection';
import PresentationFormModal from '@/components/PresentationFormModal';
import DocumentationFormModal from '@/components/DocumentationFormModal';

export default function Home() {
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden pt-[72px] md:pt-20">
      <PresentationFormModal />
      <DocumentationFormModal />
      <Header />
      <Hero />
      <Partners />
      <MarketSection />
      <SolutionsSection />
      <SoftwareUXSection />
      <ComparisonSection />
      <AboutPartnershipSection />
      <ROISection />
      <TeamSection />
      <RoadmapTestimonialsSection />
      <PartnerOpportunityFAQSection />
      <ContactSecurityFooterSection />
    </main>
  );
}
