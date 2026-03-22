import HeroSection from '@/components/landing/HeroSection'
import FeatureGalaxy from '@/components/landing/FeatureGalaxy'
import FeatureQuest from '@/components/landing/FeatureQuest'
import FeatureArchive from '@/components/landing/FeatureArchive'
import FeatureCommunity from '@/components/landing/FeatureCommunity'
import SocialProof from '@/components/landing/SocialProof'
import CTASection from '@/components/landing/CTASection'
import PageIndicator from '@/components/landing/PageIndicator'

export default function LandingPage() {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-auto">
      <PageIndicator />
      <HeroSection />
      <FeatureGalaxy />
      <FeatureQuest />
      <FeatureArchive />
      <FeatureCommunity />
      <SocialProof />
      <CTASection />
    </main>
  )
}
