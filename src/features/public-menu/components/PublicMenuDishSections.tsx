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
  activeTabId,
  canUseCart,
  cart,
  isPlacingOrder,
  onAddDish,
  onRemoveDish,
  onOpenDetails,
}: PublicMenuDishSectionsProps) => {
  if (isAllDishesTabActive) {
    return (
      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category.id} className="space-y-3">
            <h2 className="text-lg font-bold md:text-xl">{category.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

  if (!activeCategory) {
    return null;
  }

  return (
    <section key={activeTabId} className="space-y-3">
      <h2 className="text-lg font-bold md:text-xl">{activeCategory.name}</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
