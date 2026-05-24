import { notFound } from 'next/navigation';
import { PublicMenuClient } from '@/features/public-menu/components/PublicMenuClient';

type PublicMenuTablePageProps = {
  params: Promise<{ slug: string; tableId: string }>;
};

export default async function PublicMenuTablePage({
  params,
}: PublicMenuTablePageProps) {
  const resolvedParams = await params;

  const slug = resolvedParams.slug?.trim();
  const tableId = resolvedParams.tableId?.trim();

  if (!slug || !tableId) {
    notFound();
  }

  return (
    <PublicMenuClient
      restaurantSlug={slug}
      tableId={tableId}
    />
  );
}
