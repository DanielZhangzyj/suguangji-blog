export interface Article {
  id: string;
  title: string;
  imageSrc: string;
  excerpt: string;
  content: string;
  category: 'work' | 'learning' | 'growth';
  categoryLabel: string;
  date: string;
  readTime: string;
  metric: string;
  signal: string;
  takeaway: string;
  tags: string[];
  featured?: boolean;
}
