'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { createOrganizationSchema, CreateOrganizationValues, RESERVED_SLUGS } from '../schemas/organization.schema';
import { organizationApi } from '../api/organizations.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';
import { useAccessStore } from '@/shared/store/useAccessStore';
import { UseCreateOrganizationReturn } from '../types/organization.types';
import { apiClient } from '@/shared/api/client';

const transliterate = (text: string): string => {
  const ukrToLat: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
    'ю': 'yu', 'я': 'ya', '\'': '-', '’': '-', ' ': '-'
  };
  return text
    .toLowerCase()
    .split('')
    .map(char => ukrToLat[char] !== undefined ? ukrToLat[char] : char)
    .join('');
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
        const updatedUser = useUserStore.getState().user;
        const newRes = updatedUser?.restaurants?.find(r => r.name === formData.name);
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
    async (prevState: { errors: Partial<Record<keyof CreateOrganizationValues, string>> }) => {
      if (isCheckingSlug || slugAvailable === false) return prevState;

      const restaurants = useUserStore.getState().user?.restaurants || [];
      const userActiveModules = useAccessStore.getState().activeModules;
      const hasMultiModule = userActiveModules.includes('multi-restaurant');
      const maxAllowed = hasMultiModule ? 3 : 1;

      if (restaurants.length >= maxAllowed) {
        return { errors: { name: t('sidebar.limitReached') } };
      }

      const validation = createOrganizationSchema.safeParse(formData);
      if (!validation.success) {
        const newErrors: Partial<Record<keyof CreateOrganizationValues, string>> = {};
        validation.error.issues.forEach(issue => {
          newErrors[issue.path[0] as keyof CreateOrganizationValues] = t(issue.message);
        });
        return { errors: newErrors };
      }

      try {
        await organizationApi.create(validation.data);
        playSuccessAnimation();
        return { errors: {} };
      } catch {
        return { errors: { name: t('organization.errors.serverError') } };
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
    errors: combinedErrors,
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