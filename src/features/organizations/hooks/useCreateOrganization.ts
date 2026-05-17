'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { createOrganizationSchema, CreateOrganizationValues } from '../schemas/organization.schema';
import { organizationApi } from '../api/organizations.api';

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
  
  const [animationStep, setAnimationStep] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.slug]);

  const handleChange = (field: keyof CreateOrganizationValues, value: string) => {
    if (field === 'slug') setIsSlugManuallyEdited(true);
    
    let finalValue = value;
    if (field === 'slug') {
      finalValue = value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const playSuccessAnimation = () => {
    setAnimationStep(1);
    setTimeout(() => setAnimationStep(2), 2000);
    setTimeout(() => setAnimationStep(3), 4000);
    setTimeout(() => {
      setAnimationStep(4);
      setTimeout(() => router.push('/dashboard'), 1500);
    }, 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    try {
      await organizationApi.create(validation.data);
      playSuccessAnimation();
    } catch (error) {
      setErrors({ name: t('organization.errors.serverError') });
    }
  };

  return {
    formData,
    errors,
    isCheckingSlug,
    slugAvailable,
    animationStep,
    handleChange,
    handleSubmit
  };
};