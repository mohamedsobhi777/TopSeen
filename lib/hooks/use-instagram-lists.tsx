"use client";

import { useRxCollection, useRxData } from "rxdb-hooks";
import { useToast } from "@/components/ui/use-toast";
import { InstagramList, InstagramListItem, InstagramListWithAccounts } from "@/db/model";

export const useInstagramLists = () => {
  const { toast } = useToast();
  
  // Collections
  const listsCollection = useRxCollection("instagram_lists_v0");
  const listItemsCollection = useRxCollection("instagram_list_items_v0");
  const accountsCollection = useRxCollection("instagram_accounts_v0");

  // Data queries
  const { result: lists, isFetching: isListsLoading } = useRxData("instagram_lists_v0", (collection) => 
    collection.find().sort({ createdAt: "desc" })
  );

  const { result: listItems, isFetching: isListItemsLoading } = useRxData("instagram_list_items_v0", (collection) => 
    collection.find()
  );

  const { result: accounts, isFetching: isAccountsLoading } = useRxData("instagram_accounts_v0", (collection) => 
    collection.find()
  );

  // Create a new list
  const createList = async (listData: {
    name: string;
    description?: string;
    query?: string;
    isManual: boolean;
    color?: string;
  }) => {
    if (!listsCollection) return null;

    try {
      const now = new Date().toISOString();
      const newList = {
        id: crypto.randomUUID(),
        ...listData,
        accountCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      await listsCollection.insert(newList);
      
      toast({
        title: "Success",
        description: `List "${listData.name}" created successfully`,
      });

      return newList;
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update a list
  const updateList = async (id: string, updateData: Partial<InstagramList>) => {
    if (!listsCollection) return null;

    try {
      const listDoc = await listsCollection.findOne(id).exec();
      if (listDoc) {
        await listDoc.update({
          $set: {
            ...updateData,
            updatedAt: new Date().toISOString(),
          }
        });

        toast({
          title: "Success",
          description: "List updated successfully",
        });
        return listDoc;
      }
    } catch (error) {
      console.error("Error updating list:", error);
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      });
    }
    return null;
  };

  // Delete a list and all its items
  const deleteList = async (id: string) => {
    if (!listsCollection || !listItemsCollection) return false;

    try {
      // First delete all list items
      const items = await listItemsCollection.find()
        .where('listId').eq(id)
        .exec();
      
      await Promise.all(items.map(item => item.remove()));

      // Then delete the list
      const listDoc = await listsCollection.findOne(id).exec();
      if (listDoc) {
        await listDoc.remove();
        
        toast({
          title: "Success",
          description: "List deleted successfully",
        });
        return true;
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
    }
    return false;
  };

  // Add an account to a list
  const addAccountToList = async (listId: string, accountId: string, notes?: string) => {
    if (!listItemsCollection || !listsCollection) return null;

    try {
      // Check if account is already in the list
      const existingItem = await listItemsCollection.findOne()
        .where('listId').eq(listId)
        .where('accountId').eq(accountId)
        .exec();

      if (existingItem) {
        toast({
          title: "Info",
          description: "Account is already in this list",
        });
        return null;
      }

      // Add the item
      const newItem = {
        id: crypto.randomUUID(),
        listId,
        accountId,
        addedAt: new Date().toISOString(),
        notes: notes || "",
      };

      await listItemsCollection.insert(newItem);

      // Update list account count
      const listDoc = await listsCollection.findOne(listId).exec();
      if (listDoc) {
        const currentCount = listDoc.get('accountCount') || 0;
        await listDoc.update({
          $set: {
            accountCount: currentCount + 1,
            updatedAt: new Date().toISOString(),
          }
        });
      }

      toast({
        title: "Success",
        description: "Account added to list",
      });

      return newItem;
    } catch (error) {
      console.error("Error adding account to list:", error);
      toast({
        title: "Error",
        description: "Failed to add account to list",
        variant: "destructive",
      });
      return null;
    }
  };

  // Remove an account from a list
  const removeAccountFromList = async (listId: string, accountId: string) => {
    if (!listItemsCollection || !listsCollection) return false;

    try {
      const item = await listItemsCollection.findOne()
        .where('listId').eq(listId)
        .where('accountId').eq(accountId)
        .exec();

      if (item) {
        await item.remove();

        // Update list account count
        const listDoc = await listsCollection.findOne(listId).exec();
        if (listDoc) {
          const currentCount = listDoc.get('accountCount') || 0;
          await listDoc.update({
            $set: {
              accountCount: Math.max(0, currentCount - 1),
              updatedAt: new Date().toISOString(),
            }
          });
        }

        toast({
          title: "Success",
          description: "Account removed from list",
        });
        return true;
      }
    } catch (error) {
      console.error("Error removing account from list:", error);
      toast({
        title: "Error",
        description: "Failed to remove account from list",
        variant: "destructive",
      });
    }
    return false;
  };

  // Add multiple accounts to a list (for search results)
  const addAccountsToList = async (listId: string, accountIds: string[]) => {
    if (!listItemsCollection || !listsCollection) return false;

    try {
      const now = new Date().toISOString();
      const newItems = accountIds.map(accountId => ({
        id: crypto.randomUUID(),
        listId,
        accountId,
        addedAt: now,
        notes: "",
      }));

      // Insert all items
      await Promise.all(newItems.map(item => listItemsCollection.insert(item)));

      // Update list account count
      const listDoc = await listsCollection.findOne(listId).exec();
      if (listDoc) {
        const currentCount = listDoc.get('accountCount') || 0;
        await listDoc.update({
          $set: {
            accountCount: currentCount + accountIds.length,
            updatedAt: new Date().toISOString(),
          }
        });
      }

      toast({
        title: "Success",
        description: `${accountIds.length} accounts added to list`,
      });

      return true;
    } catch (error) {
      console.error("Error adding accounts to list:", error);
      toast({
        title: "Error",
        description: "Failed to add accounts to list",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get accounts for a specific list
  const getListAccounts = (listId: string) => {
    const listItemsForList = listItems.filter((item: any) => item.listId === listId);
    const accountsInList = listItemsForList.map((item: any) => {
      const account = accounts.find((acc: any) => acc.id === item.accountId);
      return account ? { ...item, account } : null;
    }).filter(Boolean);
    
    return accountsInList;
  };

  // Get lists that contain a specific account
  const getAccountLists = (accountId: string) => {
    const listItemsForAccount = listItems.filter((item: any) => item.accountId === accountId);
    const listsContainingAccount = listItemsForAccount.map((item: any) => {
      const list = lists.find((list: any) => list.id === item.listId);
      return list;
    }).filter(Boolean);
    
    return listsContainingAccount;
  };

  return {
    // Data
    lists,
    listItems,
    isLoading: isListsLoading || isListItemsLoading || isAccountsLoading,
    
    // List operations
    createList,
    updateList,
    deleteList,
    
    // List item operations
    addAccountToList,
    removeAccountFromList,
    addAccountsToList,
    
    // Helper functions
    getListAccounts,
    getAccountLists,
  };
}; 