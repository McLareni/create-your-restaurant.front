'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { createOrganizationSchema, CreateOrganizationValues } from '../schemas/organization.schema';
import { organizationApi } from '../api/organizations.api';
import { useUserStore } from '@/shared/store/useUserStore';
import { useRestaurantStore } from '@/shared/store/useRestaurantStore';

export const useCreateOrganization = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<CreateOrganizationValues>>({
    name: '',
    slug: '',
    type: undefined,
    currency: undefined,
    language: undefined,
    city: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrganizationValues, string>>>({});
  
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [animationStep, setAnimationStep] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isSlugManuallyEdited && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isSlugManuallyEdited]);

  useEffect(() => {
    if (!formData.slug || formData.slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    setSlugAvailable(null);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await organizationApi.checkSlug(formData.slug!);
        setSlugAvailable(res.isAvailable);
        if (!res.isAvailable) {
          setErrors(prev => ({ ...prev, slug: t('organization.errors.slugTaken') }));
        } else {
          setErrors(prev => ({ ...prev, slug: undefined }));
        }
      } catch (error) {
        setSlugAvailable(true);
        setErrors(prev => ({ ...prev, slug: undefined }));
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [formData.slug, t]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const playSuccessAnimation = () => {
    setAnimationStep(1);

    const schedule = (step: number, delay: number) => {
      const timer = setTimeout(async () => {
        setAnimationStep(step);
        if (step === 4) {
          const redirectTimer = setTimeout(async () => {
            await useUserStore.getState().fetchUser(true); 
            
            const updatedUser = useUserStore.getState().user;
            const newRes = updatedUser?.restaurants?.find(r => r.name === formData.name);
            if (newRes) {
              useRestaurantStore.getState().setActiveRestaurant({
                id: Number(newRes.id),
                name: newRes.name,
                slug: (newRes as any).slug
              });
            }
            
            router.push('/dashboard/menu-builder');
          }, 1500);
          timersRef.current.push(redirectTimer);
        }
      }, delay);
      timersRef.current.push(timer);
    };

    schedule(2, 2000);
    schedule(3, 4000);
    schedule(4, 6000);
  };

  const handleChange = (field: keyof CreateOrganizationValues, value: string) => {
    if (field === 'slug') setIsSlugManuallyEdited(true);
    
    let finalValue = value;
    if (field === 'slug') {
      finalValue = value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrors({});

    const validation = createOrganizationSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: any = {};
      validation.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = t(issue.message);
      });
      setErrors(newErrors);
      return;
    }

    if (slugAvailable === false) return;

    setIsLoading(true);
    try {
      await organizationApi.create(validation.data);
      playSuccessAnimation();
    } catch (error) {
      setErrors({ name: t('organization.errors.serverError') });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isCheckingSlug,
    slugAvailable,
    animationStep,
    isLoading,
    handleChange,
    handleSubmit
  };
};