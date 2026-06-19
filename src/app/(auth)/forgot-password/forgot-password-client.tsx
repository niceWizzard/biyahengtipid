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
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const forgotPasswordFormSchema = z.object({
  email: z.email('Please enter a valid email address').trim(),
});

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    setIsLoading(true);
    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setIsSubmitted(true);
    } catch (error) {
      form.setError('root', {
        message:
          'An error occurred. Please try again or contact support if the problem persists.',
      });
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Content Container */}
        <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
          {/* Logo / Brand Header */}
          <div className="mb-4 flex flex-col items-center justify-center space-y-4 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Biyaheng<span className="text-primary">Tipid</span>
            </Link>
            <div>
              <h2 className="text-foreground mt-2 text-3xl font-black tracking-tight">
                Check Your Email
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                We've sent password reset instructions
              </p>
            </div>
          </div>

          <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
            <CardHeader className="space-y-4 pb-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Email Sent</CardTitle>
                <CardDescription className="mt-2">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-foreground">
                    {form.getValues('email')}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to reset your password. The link
                will expire in 1 hour.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  try again
                </button>
                .
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link href="/login">
                  <Button className="group relative h-12 w-full overflow-hidden text-base font-medium" variant="outline">
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
              Reset Your Password
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              We&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-foreground/80">
                        Email Address
                      </FieldLabel>
                      <div className="relative mt-2">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          className="bg-background/50 border-input focus:ring-primary/20 focus:border-primary h-12 pl-10 transition-all"
                          type="email"
                          placeholder="name@example.com"
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
                <p className="text-destructive -mt-2 text-center text-sm font-medium">
                  {form.formState.errors.root.message}
                </p>
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
                      Send Reset Link
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
