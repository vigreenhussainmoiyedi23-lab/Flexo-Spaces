import CategoriesSlider from "../components/CategoriesSlider";
import FooterCTA from "../components/CtaButtonsAboveFooter";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import SystemFeatures from "../components/SystemFeatures";
import TrendingSwapsPreview from "../components/TrendingSwapsPreview";
import SocialProofStats from "../components/SocialProofStats";
import StickyCTA from "../components/StickyCTA";

const LandingPage = () => {
  return (
    <div className="w-full bg-brand-100 text-brand-900 font-sans">
      <Hero />
      <CategoriesSlider />
      <TrendingSwapsPreview />
      <HowItWorks />
      <SystemFeatures />
      <SocialProofStats />
      <FooterCTA />
      <StickyCTA />
    </div>
  );
};

export default LandingPage;
