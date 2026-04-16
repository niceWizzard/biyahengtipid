'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import {
  MailCheckIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  LogOutIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';

interface VerifyEmailClientProps {
  email: string;
}

function VerifyEmailContent({ email }: VerifyEmailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const hasTokenError = searchParams.get('error') === 'invalid_token';

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (isSending || cooldown > 0) return;
    setIsSending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/verify-email',
    });
    setIsSending(false);
    if (error) {
      toast.error('Failed to resend verification email. Please try again.');
    } else {
      toast.success('Verification email sent! Check your inbox.');
      setCooldown(60);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <section className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8 duration-700 ease-out">
        {/* Logo / Brand Header */}
        <div className="mb-4 flex flex-col items-center justify-center gap-4 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Biyaheng<span className="text-primary">Tipid</span>
          </Link>
          <div>
            <h2 className="text-foreground mt-2 text-3xl font-black tracking-tight">
              Check Your Inbox
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              One more step before you can start saving on trips
            </p>
          </div>
        </div>

        <Card className="bg-background/60 w-full border-white/10 shadow-2xl backdrop-blur-xl dark:border-white/5">
          <CardHeader className="pb-4 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <MailCheckIcon className="text-primary size-8" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We sent a verification link to{' '}
              <span className="text-foreground font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {/* Error state for invalid/expired token */}
            {hasTokenError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Verification link expired</AlertTitle>
                <AlertDescription>
                  This verification link is invalid or has expired. Please
                  request a new one below.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-muted-foreground rounded-lg border px-4 py-3 text-sm">
              <ol className="flex list-inside list-decimal flex-col gap-1.5">
                <li>Open the email from BiyahengTipid</li>
                <li>Click the &quot;Verify email&quot; link</li>
                <li>You&apos;ll be signed in automatically</li>
              </ol>
            </div>

            <Button
              id="resend-verification-btn"
              onClick={handleResend}
              variant="outline"
              className="w-full"
              disabled={isSending || cooldown > 0}
            >
              {isSending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCwIcon data-icon="inline-start" />
              )}
              {isSending
                ? 'Sending…'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend verification email'}
            </Button>

            <Separator />

            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground text-center text-xs">
                Wrong email address?{' '}
                <Link
                  href="/register"
                  className="text-foreground font-medium underline-offset-4 hover:underline"
                >
                  Create a new account
                </Link>
              </p>
              <Button
                id="sign-out-btn"
                variant="ghost"
                size="sm"
                className="text-muted-foreground w-full"
                onClick={handleSignOut}
              >
                <LogOutIcon data-icon="inline-start" />
                Sign out
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground w-full"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function VerifyEmailClient({ email }: VerifyEmailClientProps) {
  return (
    <Suspense>
      <VerifyEmailContent email={email} />
    </Suspense>
  );
}
