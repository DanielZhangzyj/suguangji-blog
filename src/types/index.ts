import type { Article, GalleryImage } from '@/types';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'philosophy' | 'tech' | 'life';
  categoryLabel: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'wide';
}
