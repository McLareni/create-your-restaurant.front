'use client';

import { PublicMenuCategory, PublicMenuDish } from '../types/publicMenu.types';
import { PublicMenuDishCard } from './PublicMenuDishCard';

interface PublicMenuDishSectionsProps {
  categories: PublicMenuCategory[];
  activeCategory: PublicMenuCategory | null;
  isAllDishesTabActive: boolean;
  activeTabId: string;
  canUseCart: boolean;
  cart: Record<string, number>;
  isPlacingOrder: boolean;
  onAddDish: (dishId: string) => void;
  onRemoveDish: (dishId: string) => void;
  onOpenDetails: (dish: PublicMenuDish) => void;
}

export const PublicMenuDishSections = ({
  categories,
  activeCategory,
  isAllDishesTabActive,
  canUseCart,
  cart,
  isPlacingOrder,
  onAddDish,
  onRemoveDish,
  onOpenDetails,
}: PublicMenuDishSectionsProps) => {
  if (isAllDishesTabActive) {
    return (
      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-espresso border-b border-solid border-brand-copper/10 pb-2 font-serif">
              {category.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {category.dishes.map((dish) => (
                <PublicMenuDishCard
                  key={dish.id}
                  dish={dish}
                  quantity={cart[dish.id] ?? 0}
                  canUseCart={canUseCart}
                  isPlacingOrder={isPlacingOrder}
                  onAddDish={onAddDish}
                  onRemoveDish={onRemoveDish}
                  onOpenDetails={onOpenDetails}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (!activeCategory) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-espresso border-b border-solid border-brand-copper/10 pb-2 font-serif">
        {activeCategory.name}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {activeCategory.dishes.map((dish) => (
          <PublicMenuDishCard
            key={dish.id}
            dish={dish}
            quantity={cart[dish.id] ?? 0}
            canUseCart={canUseCart}
            isPlacingOrder={isPlacingOrder}
            onAddDish={onAddDish}
            onRemoveDish={onRemoveDish}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </section>
  );
};