import React from 'react';
import { AdminGuard } from '@/components/admin/admin-guard';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
