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
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const loginFormSchema = z.object({
  email: z.email('Please enter a valid email address').trim(),
  password: z.string().min(1, 'Please enter your password'),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: `${window.location.origin}/dashboard`,
    });
    if (error) {
      form.setError('root', {
        message: error.message ?? 'Invalid email or password.',
      });
      setIsLoading(false);
      return;
    }
    router.push('/dashboard');
  };

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
              Welcome Back
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password below
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
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex items-center justify-between">
                        <FieldLabel className="text-foreground/80">
                          Password
                        </FieldLabel>
                      </div>
                      <div className="relative mt-2">
                        <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                        <PasswordInput
                          className="bg-background/50 border-input focus:ring-primary/20 focus:border-primary h-12 pl-10 transition-all"
                          placeholder="Enter your password"
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
                <Link
                  href="/forgot-password"
                  className="self-end text-xs font-medium underline-offset-4 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
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
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don&apos;t have an account?{' '}
                </span>
                <Link
                  href="/register"
                  className="font-semibold underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
