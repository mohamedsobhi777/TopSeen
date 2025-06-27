"use client";

import { useState, useEffect } from "react";
import { User, Settings, CreditCard, BarChart3, MessageCircle, Users, Calendar, Plus, Trash2, Edit3, MoreVertical, BookOpen } from "lucide-react";
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
import { UserAccount, TopSeenRule } from "@/db/model";
import { Instagram, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTopSeenRules } from "@/lib/hooks/use-topseen-rules";
import { toast } from "sonner";

// Mock user data
const mockUser: UserAccount = {
  id: "user_123",
  email: "user@example.com",
  name: "John Doe",
  profilePictureUrl: "",
  subscription: "free", // Keep for compatibility but won't be displayed
  monthlyMessageLimit: 0, // Keep for compatibility but won't be displayed  
  currentMonthUsage: 0, // Keep for compatibility but won't be displayed
  accountsLimit: 0, // Keep for compatibility but won't be displayed
  currentAccountsCount: 0, // Keep for compatibility but won't be displayed
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

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Updating..." : isSuccess ? "Updated!" : "Update Credentials"}
        </Button>
        {(formData.instagramUsername || formData.instagramPassword) && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({ instagramUsername: "", instagramPassword: "" });
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400">
            ✓ Instagram credentials updated successfully
          </p>
        </div>
      )}
    </form>
  );
}

function TopSeenRulesManager() {
  const { rules, isLoading, createRule, updateRule, deleteRule, toggleRule } = useTopSeenRules();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TopSeenRule | null>(null);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDescription, setNewRuleDescription] = useState("");

  const handleCreateRule = async () => {
    if (!newRuleName.trim() || !newRuleDescription.trim()) {
      toast.error("Please fill in both name and description");
      return;
    }

    const result = await createRule(newRuleName.trim(), newRuleDescription.trim());
    
    if (result.success) {
      toast.success("Rule created successfully!");
      setNewRuleName("");
      setNewRuleDescription("");
      setIsCreateDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to create rule");
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule || !newRuleName.trim() || !newRuleDescription.trim()) {
      toast.error("Please fill in both name and description");
      return;
    }

    const result = await updateRule(editingRule.id, {
      name: newRuleName.trim(),
      description: newRuleDescription.trim(),
    });
    
    if (result.success) {
      toast.success("Rule updated successfully!");
      setEditingRule(null);
      setNewRuleName("");
      setNewRuleDescription("");
    } else {
      toast.error(result.error || "Failed to update rule");
    }
  };

  const handleDeleteRule = async (id: string) => {
    const result = await deleteRule(id);
    
    if (result.success) {
      toast.success("Rule deleted successfully!");
    } else {
      toast.error(result.error || "Failed to delete rule");
    }
  };

  const handleToggleRule = async (id: string) => {
    const result = await toggleRule(id);
    
    if (result.success) {
      toast.success("Rule status updated!");
    } else {
      toast.error(result.error || "Failed to update rule status");
    }
  };

  const openEditDialog = (rule: TopSeenRule) => {
    setEditingRule(rule);
    setNewRuleName(rule.name);
    setNewRuleDescription(rule.description);
  };

  const closeEditDialog = () => {
    setEditingRule(null);
    setNewRuleName("");
    setNewRuleDescription("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading rules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Custom AI Rules</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Define custom instructions that will be included in AI prompts to control behavior and responses.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
              <DialogDescription>
                Add a custom instruction that will be included in AI prompts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  placeholder="e.g., Professional Tone"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="rule-description">Description/Instruction</Label>
                <Textarea
                  id="rule-description"
                  placeholder="e.g., Always maintain a professional and formal tone in all responses..."
                  value={newRuleDescription}
                  onChange={(e) => setNewRuleDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule}>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {rules.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No rules yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              Create your first custom AI rule to start controlling how the AI responds to your prompts.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Rule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {rule.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {new Date(rule.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(rule.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(rule)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Modify the custom instruction for AI prompts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-rule-name">Rule Name</Label>
              <Input
                id="edit-rule-name"
                placeholder="e.g., Professional Tone"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-rule-description">Description/Instruction</Label>
              <Textarea
                id="edit-rule-description"
                placeholder="e.g., Always maintain a professional and formal tone in all responses..."
                value={newRuleDescription}
                onChange={(e) => setNewRuleDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRule}>Update Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
          Manage your TopSeen account settings
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">AI Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your TopSeen account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profilePictureUrl} />
                    <AvatarFallback>
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Account Status</span>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Member Since</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex justify-between text-sm">
                      <span>Last Login</span>
                      <span>{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                TopSeen AI Rules
              </CardTitle>
              <CardDescription>
                Create custom instructions that control how the AI behaves and responds to your prompts. These rules will be automatically included in all chat interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopSeenRulesManager />
            </CardContent>
          </Card>
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