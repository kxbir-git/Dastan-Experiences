'use client';

import { store } from './store';

const STORAGE_KEY = 'dastan_admin_unlocked';
const PIN_STORAGE_KEY = 'dastan_admin_custom_pin';
export const DEFAULT_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '8899';

/**
 * Returns true if the admin session is currently unlocked in localStorage.
 */
export function isAdminUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Get active admin PIN (custom set PIN or default fallback)
 */
export function getActiveAdminPin(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(PIN_STORAGE_KEY);
    if (custom && custom.trim().length >= 4) return custom.trim();
  }
  return DEFAULT_ADMIN_PIN;
}

/**
 * Verify passkey and unlock admin session
 */
export function verifyAndUnlockAdmin(enteredPin: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Browser context required' };

  const activePin = getActiveAdminPin();
  const cleanEntered = enteredPin.trim();

  if (cleanEntered === activePin || cleanEntered === DEFAULT_ADMIN_PIN) {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      store.setCurrentRole('admin');
      window.dispatchEvent(new CustomEvent('dastan_admin_status_changed', { detail: { unlocked: true } }));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Storage error' };
    }
  }

  return { success: false, error: 'Galat PIN / Invalid Admin Passkey' };
}

/**
 * Lock the admin session and revert active role to customer
 */
export function lockAdmin(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('dastan_is_admin');
    if (store.getCurrentRole() === 'admin') {
      store.setCurrentRole('customer');
    }
    window.dispatchEvent(new CustomEvent('dastan_admin_status_changed', { detail: { unlocked: false } }));
  } catch (e) {
    console.error('Failed to lock admin', e);
  }
}

/**
 * Change admin PIN
 */
export function changeAdminPin(currentPin: string, newPin: string): { success: boolean; error?: string } {
  const activePin = getActiveAdminPin();
  if (currentPin.trim() !== activePin && currentPin.trim() !== DEFAULT_ADMIN_PIN) {
    return { success: false, error: 'Current PIN is incorrect' };
  }
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: 'New PIN must be at least 4 digits' };
  }

  try {
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to save new PIN' };
  }
}
