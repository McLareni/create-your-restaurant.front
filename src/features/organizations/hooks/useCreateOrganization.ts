'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { createOrganizationSchema, RESERVED_SLUGS } from '@/features/organizations/schemas/organization.schema';
import { organizationApi } from '@/features/organizations/api/organizations.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { apiClient } from '@/shared/api/client';
import { formatZodErrors } from '@/shared/utils/validation';
import { transliterate } from '@/shared/utils/transliterate';
import type { CreateOrganizationValues } from '@/features/organizations/schemas/organization.schema';
import type { UseCreateOrganizationReturn } from '@/features/organizations/types/organization.types';
import type { SidebarRestaurant } from '@/app/(dashboard)/_components/types/sidebar.types';
import type { User } from '@/shared/store/useUserStore';

type ExtendedUser = User & {
  restaurants?: SidebarRestaurant[];
};

export const useCreateOrganization = (): UseCreateOrganizationReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<CreateOrganizationValues>>({
    name: '',
    slug: '',
    type: undefined,
    currency: undefined,
    language: 'UA',
    city: '',
    phone: '',
    street: '',
    building: '',
    workDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    workHoursStart: '10:00',
    workHoursEnd: '22:00',
    instagram: '',
    facebook: '',
    telegram: '',
    tiktok: '',
    imageUrl: '',
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const createdRestaurantIdRef = useRef<number | null>(null);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isCheckingSlug || !formData.slug || formData.slug.length < 2 || RESERVED_SLUGS.includes(formData.slug.toLowerCase().trim())) {
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await organizationApi.checkSlug(formData.slug!);
        setSlugAvailable(res.isAvailable);
      } catch {
        setSlugAvailable(true);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [formData.slug, isCheckingSlug]);

  useEffect(() => {
    const activeTimers = timersRef.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  const playSuccessAnimation = () => {
    setAnimationStep(1);
    const t1 = setTimeout(() => setAnimationStep(2), 1800);
    const t2 = setTimeout(() => setAnimationStep(3), 3600);
    const t3 = setTimeout(() => setAnimationStep(4), 5200);
    const t4 = setTimeout(async () => {
      try {
        await useUserStore.getState().fetchUser(true); 
        const updatedUser = useUserStore.getState().user as ExtendedUser | null;
        
        const newRes = updatedUser?.restaurants?.find((r) => 
          createdRestaurantIdRef.current ? Number(r.id) === createdRestaurantIdRef.current : r.name === formData.name
        );

        if (newRes) {
          useRestaurantStore.getState().setActiveRestaurant({
            id: Number(newRes.id),
            name: newRes.name,
            slug: newRes.slug
          });
        }
        router.push('/dashboard/menu-builder');
      } catch {}
    }, 6500);
    timersRef.current.push(t1, t2, t3, t4);
  };

  const [actionState, formAction, isPending] = useActionState(
    async (prevState: { errors: Partial<Record<keyof CreateOrganizationValues | 'global', string>> }) => {
      if (isCheckingSlug || slugAvailable === false) return prevState;

      const userState = useUserStore.getState().user as ExtendedUser | null;
      const restaurants = userState?.restaurants || [];
      const userActiveModules = useAccessStore.getState().activeModules;
      const hasMultiModule = userActiveModules.includes('multi-restaurant');
      const maxAllowed = hasMultiModule ? 3 : 1;

      if (restaurants.length >= maxAllowed) {
        toast.error(t('sidebar.limitReached'));
        return { errors: { global: t('sidebar.limitReached') } };
      }

      const validation = createOrganizationSchema.safeParse(formData);
      if (!validation.success) {
        const newErrors = formatZodErrors(validation.error, t);
        return { errors: newErrors };
      }

      try {
        const response = await organizationApi.create(validation.data);
        if (response.restaurant?.id) {
          createdRestaurantIdRef.current = response.restaurant.id;
        }
        playSuccessAnimation();
        return { errors: {} };
      } catch {
        toast.error(t('organization.errors.serverError'));
        return { errors: { global: t('organization.errors.serverError') } };
      }
    },
    { errors: {} }
  );

  const handleChange = (field: keyof CreateOrganizationValues, value: string) => {
    let isManual = isSlugManuallyEdited;
    if (field === 'slug') {
      isManual = true;
      setIsSlugManuallyEdited(true);
    }
    
    let finalValue = value;
    if (field === 'slug') {
      finalValue = value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    let targetSlug = field === 'slug' ? finalValue : (formData.slug || '');

    if (field === 'name' && !isManual) {
      targetSlug = transliterate(finalValue)
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    }

    if (!targetSlug || targetSlug.length < 2) {
      setSlugAvailable(null);
      setIsCheckingSlug(false);
    } else if (RESERVED_SLUGS.includes(targetSlug.toLowerCase().trim())) {
      setSlugAvailable(false);
      setIsCheckingSlug(false);
    } else {
      setSlugAvailable(null);
      setIsCheckingSlug(true);
    }

    setFormData((prev) => {
      const nextData = { ...prev, [field]: finalValue };
      if (field === 'name' && !isManual) {
        nextData.slug = targetSlug;
      }
      return nextData;
    });
  };

  const handleDaysChange = (updatedDays: string[]) => {
    setFormData((prev) => ({ ...prev, workDays: updatedDays }));
  };

  const handleImageChange = async (file: File) => {
    setImageError(undefined);
    try {
      const uploadData = new FormData();
      uploadData.append('photo', file);
      const data = await apiClient.post<{ imageUrl: string }>('/restaurants/upload-cover', uploadData);
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch {
      setImageError(t('organization.errors.serverError'));
    }
  };

  const combinedErrors = {
    ...actionState.errors,
    ...(imageError ? { imageUrl: imageError } : {}),
    ...(slugAvailable === false ? { slug: t('organization.errors.slugTaken') } : {}),
    ...(RESERVED_SLUGS.includes(formData.slug?.toLowerCase().trim() || '') ? { slug: t('organization.errors.slugReserved') } : {})
  };

  return {
    formData,
    errors: combinedErrors as Partial<Record<keyof CreateOrganizationValues, string>>,
    isCheckingSlug,
    slugAvailable,
    animationStep,
    isPending,
    handleChange,
    handleDaysChange,
    handleImageChange,
    formAction
  };
};