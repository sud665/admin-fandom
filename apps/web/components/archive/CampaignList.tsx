import { mockCampaigns } from '@fandom/shared'
import { CampaignCard } from './CampaignCard'

export function CampaignList() {
  const activeCampaigns = mockCampaigns.filter((c) => c.status === 'active')
  const completedCampaigns = mockCampaigns.filter((c) => c.status !== 'active')

  return (
    <div className="space-y-6">
      {activeCampaigns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">진행중인 캠페인</h2>
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
      {completedCampaigns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-secondary)]">종료된 캠페인</h2>
          {completedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}
