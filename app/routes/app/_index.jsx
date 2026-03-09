import { useState } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { LayoutShell } from "~/components/dashboard/LayoutShell";
import useMe from "~/queries/useMe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Avatar, AvatarFallback, AvatarInitials } from "~/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Bell,
  Moon,
  Sun,
  LogOut,
  Shield
} from "lucide-react";
import { useAuth, useSignOut } from "@clerk/clerk-react";

function UserDashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>

        {/* Settings Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-5 w-10 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserDashboardError({ error, onRetry }) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
            <CardDescription>
              There was an error loading your profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive mb-4">{error.message}</p>
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const isMobile = useIsMobile();
  const { data: user, isLoading, error, isError, refetch } = useMe();
  const { signOut } = useSignOut();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return <UserDashboardSkeleton />;
  }

  if (isError) {
    return <UserDashboardError error={error} onRetry={() => refetch()} />;
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col bg-muted/30 p-6">
        <div className="mx-auto w-full max-w-4xl text-center">
          <Card>
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>
                Please sign in to view your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Format member since date
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <LayoutShell>
      <div className="flex flex-1 flex-col bg-muted/30 p-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          {/* User Profile Header */}
          <Card className="overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 h-2" />
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-2xl font-semibold">
                      {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-2 -right-2 bg-green-500" variant="default">
                    Active
                  </Badge>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
                    <Badge variant="outline" className="ml-2">
                      Premium Member
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isMobile && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-xs text-muted-foreground">Active & Verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile Type</p>
                    <p className="text-xs text-muted-foreground">Individual</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">Fully Configured</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Settings */}
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="flex-1"
                  />
                  <Button variant="outline" disabled>
                    Edit
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email address is managed through your Clerk account
                </p>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Label>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about course updates and progress
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Updates</p>
                    <p className="text-xs text-muted-foreground">
                      Receive weekly progress reports and tips
                    </p>
                  </div>
                  <Switch
                    checked={emailUpdates}
                    onCheckedChange={setEmailUpdates}
                  />
                </div>
              </div>

              <Separator />

              {/* Appearance Settings */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  Appearance
                </Label>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Use dark theme across the application
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              <Separator />

              {/* Account Actions */}
              <div className="space-y-3">
                <Label>Account Actions</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}