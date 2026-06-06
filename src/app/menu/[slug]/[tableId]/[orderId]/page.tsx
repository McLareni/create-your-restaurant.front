import { notFound } from 'next/navigation';
import { PublicMenuClient } from '@/features/public-menu/components/PublicMenuClient';

type PublicMenuOrderPageProps = {
  params: Promise<{ slug: string; tableId: string; orderId: string }>;
};

export default async function PublicMenuOrderPage({
  params,
}: PublicMenuOrderPageProps) {
  const resolvedParams = await params;

  const slug = resolvedParams.slug?.trim();
  const tableId = resolvedParams.tableId?.trim();
  const orderId = resolvedParams.orderId?.trim();

  if (!slug || !tableId || !orderId) {
    notFound();
  }

  return (
    <PublicMenuClient
      restaurantSlug={slug}
      tableId={tableId}
      orderId={orderId}
    />
  );
}
