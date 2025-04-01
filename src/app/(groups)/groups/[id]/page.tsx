import GroupDetailClient from '@/app/(groups)/groups/[id]/GroupDetailClient'

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function GroupDetailPage({
  params,
  searchParams: _searchParams,
}: PageProps) {
  return <GroupDetailClient params={params} />
}
