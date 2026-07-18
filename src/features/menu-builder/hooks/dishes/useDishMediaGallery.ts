import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { UseDishMediaGalleryReturn, GalleryItem } from '@/features/menu-builder/types/dishes.types';

export const useDishMediaGallery = (initialUrls: string[] = []): UseDishMediaGalleryReturn => {
  const [items, setItems] = useState<GalleryItem[]>(() => initialUrls.map((url) => ({ url })));
  const [activeDishImageIndex, setActiveDishImageIndex] = useState(0);
  const createdBlobsRef = useRef<string[]>([]);
  const urlsKey = initialUrls.join(',');
  const [prevUrlsKey, setPrevUrlsKey] = useState(urlsKey);

  if (urlsKey !== prevUrlsKey) {
    setPrevUrlsKey(urlsKey);
    setItems(initialUrls.map((url) => ({ url })));
    setActiveDishImageIndex(0);
  }

  useEffect(() => {
    return () => {
      createdBlobsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLocalImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: GalleryItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobUrl = URL.createObjectURL(file);
      createdBlobsRef.current.push(blobUrl);
      newItems.push({ url: blobUrl, file });
    }
    setItems((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const target = items[index];
    if (target && target.file) {
      URL.revokeObjectURL(target.url);
      createdBlobsRef.current = createdBlobsRef.current.filter((u) => u !== target.url);
    }
    setItems((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      return filtered;
    });
    if (activeDishImageIndex >= items.length - 1) {
      setActiveDishImageIndex(Math.max(0, items.length - 2));
    }
  };

  const setAsMainImage = (index: number) => {
    if (index === 0 || index >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [target] = next.splice(index, 1);
      next.unshift(target);
      return next;
    });
    setActiveDishImageIndex(0);
  };

  const handlePrevDishImage = () => {
    if (items.length <= 1) return;
    setActiveDishImageIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNextDishImage = () => {
    if (items.length <= 1) return;
    setActiveDishImageIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleSelectDishImage = (index: number) => {
    setActiveDishImageIndex(index);
  };

  const clearGallery = () => {
    createdBlobsRef.current.forEach((url) => URL.revokeObjectURL(url));
    createdBlobsRef.current = [];
    setItems([]);
    setActiveDishImageIndex(0);
  };

  const dishImageUrls = items.map((item) => item.url);
  const dishPhotoFiles = items.filter((item) => item.file !== undefined).map((item) => item.file) as File[];

  const setDishPhotoFiles: Dispatch<SetStateAction<File[]>> = (action) => {
    const currentFiles = items.filter((item) => item.file !== undefined).map((item) => item.file) as File[];
    const nextFiles = typeof action === 'function' ? action(currentFiles) : action;
    const newItems: GalleryItem[] = [];
    let fileIdx = 0;
    items.forEach((item) => {
      if (item.file !== undefined) {
        if (fileIdx < nextFiles.length) {
          newItems.push({ url: item.url, file: nextFiles[fileIdx] });
          fileIdx++;
        }
      } else {
        newItems.push(item);
      }
    });
    while (fileIdx < nextFiles.length) {
      const file = nextFiles[fileIdx];
      const blobUrl = URL.createObjectURL(file);
      createdBlobsRef.current.push(blobUrl);
      newItems.push({ url: blobUrl, file });
      fileIdx++;
    }
    setItems(newItems);
  };

  return {
    dishImageUrls,
    dishPhotoFiles,
    activeDishImageIndex,
    setDishPhotoFiles,
    handleLocalImageUpload,
    handlePrevDishImage,
    handleNextDishImage,
    handleSelectDishImage,
    handleRemoveImage,
    setAsMainImage,
    clearGallery,
  };
};