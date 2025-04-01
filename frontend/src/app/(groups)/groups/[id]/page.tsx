import GroupDetailClient from './GroupDetailClient'

type PageProps = {
  params: { id: string }
}

export default function GroupDetailPage({ params }: PageProps) {
  return <GroupDetailClient params={params} />
}
