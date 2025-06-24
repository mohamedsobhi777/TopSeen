import { ProfilePage } from "@/components/profile-page";

export default async function CampaignByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const campaignId = params.id;
  return <ProfilePage campaignId={campaignId} />;
}
