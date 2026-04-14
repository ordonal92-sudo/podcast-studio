import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Distribution from "@/components/Distribution";
import Monetization from "@/components/Monetization";
import AISection from "@/components/AISection";
import Testimonials from "@/components/Testimonials";
import PricingPreview from "@/components/PricingPreview";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Distribution />
      <Monetization />
      <AISection />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
