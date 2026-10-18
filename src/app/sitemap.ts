import { MetadataRoute } from 'next';
import { store } from '@/lib/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dastanexperiences.com';
  const events = store.getAllEvents();
  const restaurants = store.getAllRestaurants();
  const buildDate = new Date('2026-10-18T00:00:00.000Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/events`, lastModified: buildDate, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/dining`, lastModified: buildDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: buildDate, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: buildDate, priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: buildDate, priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: buildDate, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: buildDate, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: buildDate, priority: 0.4 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: buildDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${baseUrl}/dining/${r.slug}`,
    lastModified: buildDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes, ...restaurantRoutes];
}
