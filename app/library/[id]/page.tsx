"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRxCollection, useRxData } from "rxdb-hooks";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  Instagram,
  CheckCircle,
  Users,
  Calendar,
  Hash,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useInstagramLists } from "@/lib/hooks/use-instagram-lists";

const listColors = [
  { name: "Purple", value: "purple", class: "bg-purple-100 text-purple-700" },
  { name: "Blue", value: "blue", class: "bg-blue-100 text-blue-700" },
  { name: "Green", value: "green", class: "bg-green-100 text-green-700" },
  { name: "Pink", value: "pink", class: "bg-pink-100 text-pink-700" },
  { name: "Orange", value: "orange", class: "bg-orange-100 text-orange-700" },
  { name: "Gray", value: "gray", class: "bg-gray-100 text-gray-700" },
];

export default function ListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const listId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditListDialogOpen, setIsEditListDialogOpen] = useState(false);
  const [isAddAccountsDialogOpen, setIsAddAccountsDialogOpen] = useState(false);
  const [selectedAccountsToAdd, setSelectedAccountsToAdd] = useState<string[]>([]);

  // List form data for editing
  const [listFormData, setListFormData] = useState({
    name: "",
    description: "",
    color: "purple",
  });

  // RxDB hooks
  const { result: accounts, isFetching: isAccountsLoading } = useRxData("instagram_accounts_v0", (collection) =>
    collection.find().sort({ createdAt: "desc" })
  );

  // Instagram lists hook
  const {
    lists,
    isLoading: isListsLoading,
    updateList,
    deleteList,
    getListAccounts,
    addAccountToList,
    removeAccountFromList,
  } = useInstagramLists();

  // Find current list and convert to plain object
  const currentListDoc = lists.find((list: any) => {
    return list.get('id') === listId;
  });
  const currentList = currentListDoc ? {
    id: currentListDoc.get('id'),
    name: currentListDoc.get('name'),
    description: currentListDoc.get('description'),
    color: currentListDoc.get('color'),
    createdAt: currentListDoc.get('createdAt'),
    query: currentListDoc.get('query'),
    accountCount: currentListDoc.get('accountCount'),
  } : null;

  const listAccounts = getListAccounts(listId);

  // Get accounts not in this list (for adding)
  const availableAccounts = accounts.filter((account: any) =>
    !listAccounts.some((listAccount: any) => listAccount.account?.id === account.id)
  );

  // Filter list accounts based on search
  const filteredListAccounts = listAccounts.filter((item: any) => {
    if (!item.account) return false;
    const account = item.account;
    return (
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter available accounts for adding
  const filteredAvailableAccounts = availableAccounts.filter((account: any) =>
    account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (currentList) {
      setListFormData({
        name: currentList.name || "",
        description: currentList.description || "",
        color: currentList.color || "purple",
      });
    }
  }, [currentList]);

  const getColorClass = (color: string) => {
    const colorObj = listColors.find(c => c.value === color);
    return colorObj ? colorObj.class : "bg-gray-100 text-gray-700";
  };

  const handleEditList = async () => {
    if (!listFormData.name) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    const success = await updateList(listId, listFormData);
    if (success) {
      setIsEditListDialogOpen(false);
    }
  };

  const handleDeleteList = async () => {
    if (window.confirm("Are you sure you want to delete this list? This action cannot be undone.")) {
      const success = await deleteList(listId);
      if (success) {
        router.push('/library?tab=lists');
      }
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    await removeAccountFromList(listId, accountId);
  };

  const handleAddSelectedAccounts = async () => {
    for (const accountId of selectedAccountsToAdd) {
      await addAccountToList(listId, accountId);
    }
    setSelectedAccountsToAdd([]);
    setIsAddAccountsDialogOpen(false);
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccountsToAdd(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  if (isListsLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">List Not Found</h1>
          <p className="text-gray-600 mb-4">The list you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <Button onClick={() => router.push('/library')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/library?tab=lists')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-4 h-4 rounded-full ${getColorClass(currentList.color)}`} />
              <h1 className="text-2xl font-bold">{currentList.name}</h1>
            </div>
            {currentList.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {currentList.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {listAccounts.length} accounts
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {new Date(currentList.createdAt).toLocaleDateString()}
              </span>
              {currentList.query && (
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  Search: {currentList.query}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isAddAccountsDialogOpen} onOpenChange={setIsAddAccountsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Accounts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Add Accounts to {currentList.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredAvailableAccounts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {availableAccounts.length === 0
                        ? "All accounts are already in this list"
                        : "No accounts match your search"
                      }
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredAvailableAccounts.map((account: any) => (
                        <div
                          key={account.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleAccountSelection(account.id)}
                        >
                          <Checkbox
                            checked={selectedAccountsToAdd.includes(account.id)}
                            onChange={() => toggleAccountSelection(account.id)}
                          />
                          <Avatar className="h-10 w-10">
                            {account.profilePictureUrl ? (
                              <AvatarImage src={account.profilePictureUrl} alt={account.name} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                <Instagram className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">@{account.username}</p>
                              {account.verified && (
                                <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{account.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {account.category}
                              </Badge>
                              <span className="text-xs text-gray-400">{account.followers}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    {selectedAccountsToAdd.length} account{selectedAccountsToAdd.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddAccountsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSelectedAccounts}
                      disabled={selectedAccountsToAdd.length === 0}
                    >
                      Add {selectedAccountsToAdd.length > 0 && `(${selectedAccountsToAdd.length})`}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditListDialogOpen(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteList}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search accounts in this list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Instagram className="h-4 w-4" />
          {filteredListAccounts.length} of {listAccounts.length} accounts
        </Badge>
      </div>

      {/* Accounts Grid */}
      {isAccountsLoading ? (
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
      ) : filteredListAccounts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {listAccounts.length === 0 ? "No accounts in this list" : "No accounts found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {listAccounts.length === 0
                ? "Add some accounts to get started."
                : "No accounts match your search criteria."
              }
            </p>
            {listAccounts.length === 0 && (
              <Button onClick={() => setIsAddAccountsDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Account
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListAccounts.map((item: any) => {
            const account = item.account;
            if (!account) return null;

            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
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
                        <div className="text-xs text-gray-400 mt-2">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemoveAccount(account.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove from List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit List Dialog */}
      <Dialog open={isEditListDialogOpen} onOpenChange={setIsEditListDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsEditListDialogOpen(false)}>
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
  );
} 