'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Map,
  Route,
  TrendingUp,
  Clock,
  Fuel,
  ChevronDown,
  Settings,
  User,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const stats = [
  {
    title: 'Routes Optimized',
    value: '24',
    change: '+12%',
    positive: true,
    icon: Route,
    description: 'Total routes planned this month',
  },
  {
    title: 'Distance Saved',
    value: '138 km',
    change: '+8%',
    positive: true,
    icon: Map,
    description: 'Total distance saved vs. unoptimized',
  },
  {
    title: 'Fuel Saved',
    value: '₱2,340',
    change: '+15%',
    positive: true,
    icon: Fuel,
    description: 'Estimated fuel cost savings this month',
  },
  {
    title: 'Time Saved',
    value: '6.5 hrs',
    change: '+5%',
    positive: true,
    icon: Clock,
    description: 'Total travel time saved this month',
  },
];

const recentRoutes = [
  {
    id: 1,
    from: 'Quezon City',
    to: 'Makati CBD',
    date: 'Today, 8:15 AM',
    savings: '₱320',
    status: 'Completed',
  },
  {
    id: 2,
    from: 'Taguig (BGC)',
    to: 'Pasig City Hall',
    date: 'Yesterday, 2:30 PM',
    savings: '₱180',
    status: 'Completed',
  },
  {
    id: 3,
    from: 'Caloocan',
    to: 'Mandaluyong City',
    date: 'Apr 13, 9:00 AM',
    savings: '₱260',
    status: 'Completed',
  },
  {
    id: 4,
    from: 'Parañaque',
    to: 'Muntinlupa City',
    date: 'Apr 12, 11:45 AM',
    savings: '₱140',
    status: 'Completed',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardClient({ user }: { user: SessionUser }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation Bar */}
      <header className="border-border/60 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              Biyaheng<span className="text-primary">Tipid</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="sm" className="gap-2" disabled>
              <LayoutDashboard data-icon="inline-start" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" disabled>
              <Route data-icon="inline-start" />
              My Routes
            </Button>
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  id="user-menu-trigger"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 pr-2 pl-1"
                />
              }
            >
              <Avatar size="sm">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate text-sm font-medium md:block">
                {user.name}
              </span>
              <ChevronDown className="text-muted-foreground size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem id="profile-menu-item" disabled>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem id="settings-menu-item" disabled>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  id="sign-out-menu-item"
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  <LogOut />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s an overview of your routing activity this month.
          </p>
        </div>

        {/* Auth Status Banner */}
        <div className="from-primary/10 to-primary/5 border-primary/20 mb-8 flex items-start gap-3 rounded-xl border bg-linear-to-r p-4">
          <div className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full">
            <Sparkles className="text-primary size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              ✅ Better Auth is working correctly
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              You&apos;re authenticated as{' '}
              <span className="text-foreground font-medium">{user.email}</span>.
              Session is active and verified server-side via{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-[11px]">
                auth.api.getSession()
              </code>
              .
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge
                      variant={stat.positive ? 'default' : 'destructive'}
                      className="rounded-full px-1.5 py-0 text-[10px]"
                    >
                      <TrendingUp data-icon="inline-start" />
                      {stat.change}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      vs last month
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Session Info + Recent Routes */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Session Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Session Details</CardTitle>
              <CardDescription>
                Your current auth session information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="text-base">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
              <Separator />
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd
                    className="max-w-[120px] truncate font-mono text-xs"
                    title={user.id}
                  >
                    {user.id.slice(0, 12)}…
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email Verified</dt>
                  <dd>
                    <Badge
                      variant={user.emailVerified ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.emailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Member Since</dt>
                  <dd className="text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Auth Provider</dt>
                  <dd>
                    <Badge variant="secondary" className="text-xs">
                      Email / Password
                    </Badge>
                  </dd>
                </div>
              </dl>
              <Separator />
              <Button
                id="sign-out-button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut data-icon="inline-start" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Recent Routes Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Routes</CardTitle>
              <CardDescription>
                Your latest optimized commute routes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {recentRoutes.map((route, idx) => (
                <div key={route.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
                        <Route className="text-primary size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {route.from} → {route.to}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {route.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          -{route.savings}
                        </span>
                        <p className="text-muted-foreground text-xs">saved</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {route.status}
                      </Badge>
                    </div>
                  </div>
                  {idx < recentRoutes.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
