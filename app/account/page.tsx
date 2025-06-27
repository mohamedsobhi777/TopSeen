"use client";

import { useState, useEffect } from "react";
import { User, Settings, CreditCard, BarChart3, MessageCircle, Users, Calendar, Crown } from "lucide-react";
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
import { Instagram, Eye, EyeOff } from "lucide-react";

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
  instagramUsername: "",
  instagramPassword: "",
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

function InstagramCredentialsForm({ user, onUpdate }: {
  user: UserAccount;
  onUpdate: (user: UserAccount) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    instagramUsername: user.instagramUsername || "",
    instagramPassword: user.instagramPassword || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update form data when user prop changes
  useEffect(() => {
    setFormData({
      instagramUsername: user.instagramUsername || "",
      instagramPassword: user.instagramPassword || "",
    });
  }, [user.instagramUsername, user.instagramPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onUpdate({
          ...user,
          instagramUsername: formData.instagramUsername,
          instagramPassword: formData.instagramPassword,
        });
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        console.error('Failed to update credentials');
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram-username">Instagram Username</Label>
          <div className="relative">
            <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="instagram-username"
              type="text"
              placeholder="your_username"
              value={formData.instagramUsername}
              onChange={(e) => handleInputChange('instagramUsername', e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter your Instagram username (without @)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram-password">Instagram Password</Label>
          <div className="relative">
            <Input
              id="instagram-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.instagramPassword}
              onChange={(e) => handleInputChange('instagramPassword', e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Your password is encrypted and stored securely
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.instagramUsername || !formData.instagramPassword}
          className="flex-1"
        >
          {isLoading ? "Saving..." : "Save Credentials"}
        </Button>
        {isSuccess && (
          <div className="flex items-center text-green-600 text-sm">
            ✓ Saved successfully
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Instagram className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Why do we need your credentials?</p>
            <p className="text-blue-700 mt-1">
              We use your Instagram credentials to send automated messages and discover accounts.
              Your credentials are encrypted and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </form>
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
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user-settings');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user settings');
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  // Update Instagram connection status when user changes
  useEffect(() => {
    setInstagramConnected(!!(user.instagramUsername && user.instagramPassword));
  }, [user.instagramUsername, user.instagramPassword]);

  return (
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="w-5 h-5" />
                    Instagram Credentials
                  </CardTitle>
                  <CardDescription>
                    Connect your Instagram account for automated messaging and account discovery
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${instagramConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${instagramConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {instagramConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading credentials...</div>
                </div>
              ) : (
                <InstagramCredentialsForm user={user} onUpdate={setUser} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 