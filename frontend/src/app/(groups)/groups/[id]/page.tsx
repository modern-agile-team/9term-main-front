import GroupDetailClient from './GroupDetailClient'

type PageProps = {
  params: { id: string }
}

export default async function GroupDetailPage({ params }: PageProps) {
  return <GroupDetailClient params={params} />
}
