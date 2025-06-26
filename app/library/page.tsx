"use client";

import React, { useState } from "react";
import { useRxCollection, useRxData } from "rxdb-hooks";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  User,
  Instagram,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  followers: string;
  category: string;
  verified: boolean;
  bio?: string;
  profilePictureUrl?: string;
  isPrivate?: boolean;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Fashion",
  "Technology", 
  "Lifestyle",
  "Food",
  "Travel",
  "Fitness",
  "Art",
  "Music",
  "Gaming",
  "Beauty",
  "Business",
  "Entertainment"
];

export default function LibraryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<InstagramAccount | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    followers: "",
    category: "",
    verified: false,
    bio: "",
    profilePictureUrl: "",
    isPrivate: false,
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
  });

  // RxDB hooks
  const collection = useRxCollection("instagram_accounts_v0");
  const { result: accounts, isFetching } = useRxData("instagram_accounts_v0", (collection) => 
    collection.find().sort({ createdAt: "desc" })
  );

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter((account: InstagramAccount) =>
    account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      followers: "",
      category: "",
      verified: false,
      bio: "",
      profilePictureUrl: "",
      isPrivate: false,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
    });
  };

  const handleAdd = async () => {
    if (!formData.username || !formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      await collection?.insert({
        id: crypto.randomUUID(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      });

      toast({
        title: "Success",
        description: "Instagram account added successfully",
      });

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding account:", error);
      toast({
        title: "Error",
        description: "Failed to add Instagram account",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingAccount || !formData.username || !formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const accountDoc = await collection?.findOne(editingAccount.id).exec();
      if (accountDoc) {
        await accountDoc.update({
          $set: {
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        });

        toast({
          title: "Success",
          description: "Instagram account updated successfully",
        });

        resetForm();
        setEditingAccount(null);
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: "Failed to update Instagram account",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (account: InstagramAccount) => {
    try {
      const accountDoc = await collection?.findOne(account.id).exec();
      if (accountDoc) {
        await accountDoc.remove();
        toast({
          title: "Success",
          description: "Instagram account deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete Instagram account",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (account: InstagramAccount) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      name: account.name,
      followers: account.followers,
      category: account.category,
      verified: account.verified,
      bio: account.bio || "",
      profilePictureUrl: account.profilePictureUrl || "",
      isPrivate: account.isPrivate || false,
      followerCount: account.followerCount || 0,
      followingCount: account.followingCount || 0,
      postCount: account.postCount || 0,
    });
  };

  const closeEditDialog = () => {
    setEditingAccount(null);
    resetForm();
  };

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
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Instagram Accounts Library</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your Instagram accounts for autocomplete suggestions
                  </p>
                </div>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Instagram Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        placeholder="e.g., fashionista_emily"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Display Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Emily Johnson"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="followers">Follower Count</Label>
                      <Input
                        id="followers"
                        placeholder="e.g., 125K"
                        value={formData.followers}
                        onChange={(e) => setFormData(prev => ({ ...prev, followers: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Account bio..."
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified"
                        checked={formData.verified}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked }))}
                      />
                      <Label htmlFor="verified">Verified Account</Label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdd}>
                        Add Account
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Stats */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                {accounts.length} accounts
              </Badge>
            </div>

            {/* Accounts Grid */}
            {isFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAccounts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery ? "No accounts match your search criteria." : "Start by adding your first Instagram account."}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Account
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map((account: InstagramAccount) => (
                  <Card key={account.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-12 w-12">
                            {account.profilePictureUrl ? (
                              <AvatarImage src={account.profilePictureUrl} alt={account.name} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                <Instagram className="h-5 w-5" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">@{account.username}</h3>
                              {account.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                              {account.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {account.category}
                              </Badge>
                              <span>•</span>
                              <span>{account.followers}</span>
                            </div>
                            {account.bio && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                {account.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(account)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(account)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingAccount} onOpenChange={(open) => !open && closeEditDialog()}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Instagram Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-username">Username *</Label>
                    <Input
                      id="edit-username"
                      placeholder="e.g., fashionista_emily"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Display Name *</Label>
                    <Input
                      id="edit-name"
                      placeholder="e.g., Emily Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-followers">Follower Count</Label>
                    <Input
                      id="edit-followers"
                      placeholder="e.g., 125K"
                      value={formData.followers}
                      onChange={(e) => setFormData(prev => ({ ...prev, followers: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      placeholder="Account bio..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked }))}
                    />
                    <Label htmlFor="edit-verified">Verified Account</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={closeEditDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleEdit}>
                      Update Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
} 