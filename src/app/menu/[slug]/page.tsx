import { notFound } from 'next/navigation';
import { PublicMenuClient } from '@/features/public-menu/components/PublicMenuClient';

type PublicMenuPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicMenuPage({ params }: PublicMenuPageProps) {
  const resolvedParams = await params;

  const slug = resolvedParams.slug?.trim();

  if (!slug) {
    notFound();
  }

  return <PublicMenuClient restaurantSlug={slug} />;
}
