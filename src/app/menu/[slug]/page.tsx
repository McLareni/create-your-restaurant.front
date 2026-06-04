import { notFound } from 'next/navigation';
import { PublicMenuClient } from '@/features/public-menu/components/PublicMenuClient';

type PublicMenuPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tableId?: string | string[] }>;
};

export default async function PublicMenuPage({
  params,
  searchParams,
}: PublicMenuPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.slug?.trim();
  const tableIdValue = resolvedSearchParams.tableId;
  const tableId = Array.isArray(tableIdValue)
    ? tableIdValue[0]?.trim()
    : tableIdValue?.trim();

  if (!slug) {
    notFound();
  }

  return <PublicMenuClient restaurantSlug={slug} tableId={tableId} />;
}
