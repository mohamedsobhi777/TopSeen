"use client";

import React, { useState, useEffect } from "react";
import { useRxCollection, useRxData } from "rxdb-hooks";
import { useRouter, useSearchParams } from "next/navigation";
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
  List,
  Users,
  FolderPlus,
  Folder,
  Calendar,
  Hash,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useInstagramLists } from "@/lib/hooks/use-instagram-lists";

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

const listColors = [
  { name: "Purple", value: "purple", class: "bg-purple-100 text-purple-700" },
  { name: "Blue", value: "blue", class: "bg-blue-100 text-blue-700" },
  { name: "Green", value: "green", class: "bg-green-100 text-green-700" },
  { name: "Pink", value: "pink", class: "bg-pink-100 text-pink-700" },
  { name: "Orange", value: "orange", class: "bg-orange-100 text-orange-700" },
  { name: "Gray", value: "gray", class: "bg-gray-100 text-gray-700" },
];

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("accounts");

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'lists') {
      setActiveTab('lists');
    }
  }, [searchParams]);
  
  // Account management states
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<InstagramAccount | null>(null);
  const [accountFormData, setAccountFormData] = useState({
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

  // List management states
  const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);
  const [listFormData, setListFormData] = useState({
    name: "",
    description: "",
    color: "purple",
  });

  // RxDB hooks
  const collection = useRxCollection("instagram_accounts_v0");
  const { result: accounts, isFetching } = useRxData("instagram_accounts_v0", (collection) => 
    collection.find().sort({ createdAt: "desc" })
  );

  // Instagram lists hook
  const {
    lists,
    isLoading: isListsLoading,
    createList,
    updateList,
    deleteList,
    getListAccounts,
    addAccountToList,
    removeAccountFromList,
  } = useInstagramLists();

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter((account: any) =>
    account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter lists based on search query
  const filteredLists = lists.filter((list: any) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (list.query && list.query.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Account form handlers
  const resetAccountForm = () => {
    setAccountFormData({
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

  const handleAddAccount = async () => {
    if (!accountFormData.username || !accountFormData.name || !accountFormData.category) {
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
        ...accountFormData,
        createdAt: now,
        updatedAt: now,
      });

      toast({
        title: "Success",
        description: "Instagram account added successfully",
      });

      resetAccountForm();
      setIsAddAccountDialogOpen(false);
    } catch (error) {
      console.error("Error adding account:", error);
      toast({
        title: "Error",
        description: "Failed to add Instagram account",
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = async () => {
    if (!editingAccount || !accountFormData.username || !accountFormData.name || !accountFormData.category) {
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
            ...accountFormData,
            updatedAt: new Date().toISOString(),
          }
        });

        toast({
          title: "Success",
          description: "Instagram account updated successfully",
        });

        resetAccountForm();
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

  const handleDeleteAccount = async (account: InstagramAccount) => {
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

  const openEditAccountDialog = (account: InstagramAccount) => {
    setEditingAccount(account);
    setAccountFormData({
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

  const closeEditAccountDialog = () => {
    setEditingAccount(null);
    resetAccountForm();
  };

  // List form handlers
  const resetListForm = () => {
    setListFormData({
      name: "",
      description: "",
      color: "purple",
    });
  };

  const handleCreateList = async () => {
    if (!listFormData.name) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    await createList({
      ...listFormData,
      isManual: true,
    });

    resetListForm();
    setIsCreateListDialogOpen(false);
  };

  const handleEditList = async () => {
    if (!editingList || !listFormData.name) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    await updateList(editingList.id, listFormData);
    resetListForm();
    setEditingList(null);
  };

  const openEditListDialog = (list: any) => {
    setEditingList(list);
    setListFormData({
      name: list.name,
      description: list.description || "",
      color: list.color || "purple",
    });
  };

  const closeEditListDialog = () => {
    setEditingList(null);
    resetListForm();
  };

  const getColorClass = (color: string) => {
    const colorObj = listColors.find(c => c.value === color);
    return colorObj ? colorObj.class : "bg-gray-100 text-gray-700";
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
                  <h1 className="text-2xl font-bold">Instagram Library</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your Instagram accounts and organize them into lists
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="accounts">
                  <User className="h-4 w-4 mr-2" />
                  Accounts ({accounts.length})
                </TabsTrigger>
                <TabsTrigger value="lists">
                  <List className="h-4 w-4 mr-2" />
                  Lists ({lists.length})
                </TabsTrigger>
              </TabsList>

              {/* Accounts Tab */}
              <TabsContent value="accounts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
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
                      {filteredAccounts.length} accounts
                    </Badge>
                  </div>
                  
                  <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetAccountForm(); setIsAddAccountDialogOpen(true); }}>
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
                            value={accountFormData.username}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Display Name *</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Emily Johnson"
                            value={accountFormData.name}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="followers">Follower Count</Label>
                          <Input
                            id="followers"
                            placeholder="e.g., 125K"
                            value={accountFormData.followers}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, followers: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={accountFormData.category} onValueChange={(value) => setAccountFormData(prev => ({ ...prev, category: value }))}>
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
                            value={accountFormData.bio}
                            onChange={(e) => setAccountFormData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="verified"
                            checked={accountFormData.verified}
                            onCheckedChange={(checked) => setAccountFormData(prev => ({ ...prev, verified: checked }))}
                          />
                          <Label htmlFor="verified">Verified Account</Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAccount}>
                            Add Account
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        <Button onClick={() => setIsAddAccountDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Account
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAccounts.map((account: any) => (
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
                                <DropdownMenuItem onClick={() => openEditAccountDialog(account)}>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteAccount(account)}
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
              </TabsContent>

              {/* Lists Tab */}
              <TabsContent value="lists" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search lists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      {filteredLists.length} lists
                    </Badge>
                  </div>
                  
                  <Dialog open={isCreateListDialogOpen} onOpenChange={setIsCreateListDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetListForm(); setIsCreateListDialogOpen(true); }}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create List
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New List</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="list-name">List Name *</Label>
                          <Input
                            id="list-name"
                            placeholder="e.g., Fashion Influencers"
                            value={listFormData.name}
                            onChange={(e) => setListFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="list-description">Description</Label>
                          <Textarea
                            id="list-description"
                            placeholder="Optional description for this list..."
                            value={listFormData.description}
                            onChange={(e) => setListFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="list-color">Color Theme</Label>
                          <Select value={listFormData.color} onValueChange={(value) => setListFormData(prev => ({ ...prev, color: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {listColors.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${color.class}`} />
                                    {color.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsCreateListDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateList}>
                            Create List
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Lists Grid */}
                {isListsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredLists.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No lists found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchQuery ? "No lists match your search criteria." : "Create your first list to organize your Instagram accounts."}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => setIsCreateListDialogOpen(true)}>
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Create Your First List
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLists.map((list: any) => (
                      <Card 
                        key={list.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/library/${list.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getColorClass(list.color)}`} />
                              <h3 className="font-semibold text-sm">{list.name}</h3>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditListDialog(list)}>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteList(list.id)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {list.description && (
                            <p className="text-xs text-gray-500 mb-3">{list.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {list.accountCount} accounts
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(list.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {list.query && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                Search: {list.query}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Edit Account Dialog */}
            <Dialog open={!!editingAccount} onOpenChange={(open) => !open && closeEditAccountDialog()}>
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
                      value={accountFormData.username}
                      onChange={(e) => setAccountFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Display Name *</Label>
                    <Input
                      id="edit-name"
                      placeholder="e.g., Emily Johnson"
                      value={accountFormData.name}
                      onChange={(e) => setAccountFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-followers">Follower Count</Label>
                    <Input
                      id="edit-followers"
                      placeholder="e.g., 125K"
                      value={accountFormData.followers}
                      onChange={(e) => setAccountFormData(prev => ({ ...prev, followers: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select value={accountFormData.category} onValueChange={(value) => setAccountFormData(prev => ({ ...prev, category: value }))}>
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
                      value={accountFormData.bio}
                      onChange={(e) => setAccountFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-verified"
                      checked={accountFormData.verified}
                      onCheckedChange={(checked) => setAccountFormData(prev => ({ ...prev, verified: checked }))}
                    />
                    <Label htmlFor="edit-verified">Verified Account</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={closeEditAccountDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditAccount}>
                      Update Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit List Dialog */}
            <Dialog open={!!editingList} onOpenChange={(open) => !open && closeEditListDialog()}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-list-name">List Name *</Label>
                    <Input
                      id="edit-list-name"
                      placeholder="e.g., Fashion Influencers"
                      value={listFormData.name}
                      onChange={(e) => setListFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-list-description">Description</Label>
                    <Textarea
                      id="edit-list-description"
                      placeholder="Optional description for this list..."
                      value={listFormData.description}
                      onChange={(e) => setListFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-list-color">Color Theme</Label>
                    <Select value={listFormData.color} onValueChange={(value) => setListFormData(prev => ({ ...prev, color: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {listColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${color.class}`} />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={closeEditListDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditList}>
                      Update List
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