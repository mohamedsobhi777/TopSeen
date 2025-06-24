"use client";

import { useState } from "react";
import { User, Settings, CreditCard, BarChart3, MessageCircle, Users, Calendar, Crown } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from "@/components/ui/gauge";
import { UserAccount } from "@/db/model";

// Mock user data
const mockUser: UserAccount = {
  id: "user_123",
  email: "user@example.com",
  name: "John Doe",
  profilePictureUrl: "",
  subscription: "pro",
  monthlyMessageLimit: 1000,
  currentMonthUsage: 450,
  accountsLimit: 500,
  currentAccountsCount: 127,
  createdAt: "2024-01-15T00:00:00Z",
  lastLoginAt: "2024-01-20T10:30:00Z",
  isActive: true,
};

function StatsCard({ title, value, subtitle, icon: Icon, color = "blue", percentage }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  color?: "blue" | "green" | "purple" | "orange";
  percentage?: number;
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    green: "text-green-500 bg-green-50 dark:bg-green-950",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-950",
    orange: "text-orange-500 bg-orange-50 dark:bg-orange-950",
  };

  const gaugeColors = {
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#8b5cf6",
    orange: "#f59e0b",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            {percentage !== undefined && (
              <div className="w-16 h-16">
                <Gauge
                  value={percentage}
                  size={64}
                  strokeWidth={6}
                  primary={gaugeColors[color]}
                  secondary="#e5e7eb"
                  showValue={false}
                  className={{
                    svgClassName: "drop-shadow-sm",
                    textClassName: "text-xs font-medium"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionCard({ user }: { user: UserAccount }) {
  const usagePercentage = (user.currentMonthUsage / user.monthlyMessageLimit) * 100;
  const accountsPercentage = (user.currentAccountsCount / user.accountsLimit) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {user.subscription === "pro" && <Crown className="w-5 h-5 text-yellow-500" />}
              {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)} Plan
            </CardTitle>
            <CardDescription>
              Your current subscription and usage
            </CardDescription>
          </div>
          <Badge variant={user.subscription === "free" ? "secondary" : "default"}>
            {user.subscription === "free" ? "Free" : user.subscription === "pro" ? "Pro" : "Enterprise"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Monthly Messages</span>
            <span>{user.currentMonthUsage} / {user.monthlyMessageLimit}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {user.monthlyMessageLimit - user.currentMonthUsage} messages remaining
          </p>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Instagram Accounts</span>
            <span>{user.currentAccountsCount} / {user.accountsLimit}</span>
          </div>
          <Progress value={accountsPercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {user.accountsLimit - user.currentAccountsCount} accounts available
          </p>
        </div>

        {user.subscription === "free" && (
          <div className="pt-4 border-t">
            <Button className="w-full">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<UserAccount>(mockUser);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileNav 
          filterByCountryId={null}
          searchQuery=""
          handleSearchChange={() => {}}
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your TopSeen account and subscription
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SubscriptionCard user={user} />
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions on TopSeen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Campaign &quot;Fashion Influencers&quot; created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">45 messages sent successfully</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">12 new accounts added</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SubscriptionCard user={user} />
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Billing History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pro Plan - January 2024</span>
                      <span>$29.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pro Plan - December 2023</span>
                      <span>$29.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Configure your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-gray-500">Receive updates about your campaigns</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS notifications</p>
                      <p className="text-xs text-gray-500">Get alerts for important updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-4">Security</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Change password</p>
                      <p className="text-xs text-gray-500">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-factor authentication</p>
                      <p className="text-xs text-gray-500">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-4 text-red-600">Danger Zone</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Delete account</p>
                      <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
} 