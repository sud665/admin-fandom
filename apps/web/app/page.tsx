import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import ArchiveSection from '@/components/landing/ArchiveSection'
import MediaSection from '@/components/landing/MediaSection'
import NoticeSection from '@/components/landing/NoticeSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-[#05050a] min-h-screen font-sans text-white selection:bg-orange-500/30 selection:text-white overflow-x-hidden relative">
      {/* Fixed space background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000"
          alt="Space Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050a]/80 to-[#05050a]" />
      </div>

      <Header />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ArchiveSection />
        <MediaSection />
        <NoticeSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
