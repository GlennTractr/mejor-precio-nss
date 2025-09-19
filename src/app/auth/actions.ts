'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import createClient from '@/lib/supabase/server';

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

  const headersList = await headers();
  const referer = new URL(headersList.get('referer') || '/');

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  }

  revalidatePath('/', 'layout');

  const next = referer.searchParams.get('next');
  if (next) {
    redirect(next);
  }

  redirect('/');
}

export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient();

  const headersList = await headers();
  const referer = new URL(headersList.get('referer') || '/');

  const { error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) {
    throw signUpError;
  }

  // Since email confirmation is disabled, we can immediately sign in
  const { error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
    throw signInError;
  }

  revalidatePath('/', 'layout');

  const next = referer.searchParams.get('next');
  if (next) {
    redirect(next);
  }

  redirect('/');
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: data.currentPassword,
  });

  if (verifyError) {
    throw new Error('Current password is incorrect');
  }

  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (updateError) {
    throw updateError;
  }

  revalidatePath('/', 'layout');
}
