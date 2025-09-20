'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import LoginForm from '@/components/admin/LoginForm';
import LeadsDashboard from '@/components/admin/LeadsDashboard';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <AdminLayout>
      <LeadsDashboard />
    </AdminLayout>
  ) : (
    <LoginForm />
  );
}