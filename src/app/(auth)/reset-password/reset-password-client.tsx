'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Loader2,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(256, 'Password must be less than 256 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setTokenError(
        'Invalid or missing reset token. Please request a new password reset link.'
      );
    }
    setIsResetting(false);
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormSchema) => {
    if (!token) {
      setTokenError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.resetPassword({
        token,
        newPassword: data.password,
      });

      if (result.error) {
        form.setError('root', {
          message:
            result.error.message ||
            'Failed to reset password. The link may have expired.',
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      form.setError('root', {
        message: 'An error occurred. Please try again.',
      });
      setIsLoading(false);
    }
  };

  if (isResetting) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
          <div className="mb-4 flex flex-col items-center justify-center space-y-4 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Biyaheng<span className="text-primary">Tipid</span>
            </Link>
            <div>
              <h2 className="text-foreground mt-2 text-3xl font-black tracking-tight">
                Invalid Link
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                The password reset link is invalid or expired
              </p>
            </div>
          </div>

          <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
            <CardContent className="space-y-4 pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3">
                <Link href="/forgot-password">
                  <Button className="group relative h-12 w-full overflow-hidden text-base font-medium">
                    <span className="relative z-10 flex items-center justify-center">
                      Request New Reset Link
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    className="group relative h-12 w-full overflow-hidden text-base font-medium"
                    variant="outline"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Back to Login
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
          <div className="mb-4 flex flex-col items-center justify-center space-y-4 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Biyaheng<span className="text-primary">Tipid</span>
            </Link>
            <div>
              <h2 className="text-foreground mt-2 text-3xl font-black tracking-tight">
                Password Reset
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Your password has been successfully reset
              </p>
            </div>
          </div>

          <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
            <CardHeader className="space-y-4 pb-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Success!</CardTitle>
                <CardDescription className="mt-2">
                  Your password has been reset. You&apos;ll be redirected to the
                  login page shortly.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

      {/* Content Container */}
      <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
        {/* Logo / Brand Header */}
        <div className="mb-4 flex flex-col items-center justify-center space-y-4 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Biyaheng<span className="text-primary">Tipid</span>
          </Link>
          <div>
            <h2 className="text-foreground mt-2 text-3xl font-black tracking-tight">
              Create New Password
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your new password below
            </p>
          </div>
        </div>

        <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-foreground/80">
                        New Password
                      </FieldLabel>
                      <div className="relative mt-2">
                        <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                        <PasswordInput
                          className="bg-background/50 border-input focus:ring-primary/20 focus:border-primary h-12 pl-10 transition-all"
                          placeholder="Enter new password"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldDescription className="text-destructive mt-1 text-xs font-medium">
                          {fieldState.error?.message}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <FieldLabel className="text-foreground/80">
                        Confirm Password
                      </FieldLabel>
                      <div className="relative mt-2">
                        <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                        <PasswordInput
                          className="bg-background/50 border-input focus:ring-primary/20 focus:border-primary h-12 pl-10 transition-all"
                          placeholder="Confirm password"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldDescription className="text-destructive mt-1 text-xs font-medium">
                          {fieldState.error?.message}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {form.formState.errors.root && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="group relative mt-2 h-12 w-full overflow-hidden text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center">
                      Reset Password
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">Remember your password?</span>
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
