import HeroSection from '@/components/landing/HeroSection'
import BentoGrid from '@/components/landing/BentoGrid'
import SocialProof from '@/components/landing/SocialProof'
import CTASection from '@/components/landing/CTASection'
import FloatingNav from '@/components/landing/PageIndicator'

export default function LandingPage() {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-auto">
      <FloatingNav />
      <HeroSection />
      <BentoGrid />
      <SocialProof />
      <CTASection />
    </main>
  )
}
