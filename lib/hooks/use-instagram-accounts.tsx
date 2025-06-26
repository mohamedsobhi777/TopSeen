"use client";

import { useRxCollection, useRxData } from "rxdb-hooks";
import { useEffect } from "react";

export interface InstagramAccount {
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

// Sample accounts for seeding
const sampleAccounts = [
  { username: 'fashionista_emily', name: 'Emily Johnson', followers: '125K', category: 'Fashion', verified: true },
  { username: 'tech_guru_mike', name: 'Mike Chen', followers: '89K', category: 'Technology', verified: false },
  { username: 'lifestyle_sarah', name: 'Sarah Wilson', followers: '67K', category: 'Lifestyle', verified: true },
  { username: 'foodie_alex', name: 'Alex Rodriguez', followers: '234K', category: 'Food', verified: true },
  { username: 'travel_nomad', name: 'Jordan Kim', followers: '156K', category: 'Travel', verified: false },
  { username: 'fitness_motivation', name: 'Maya Patel', followers: '98K', category: 'Fitness', verified: true },
  { username: 'art_creative', name: 'Sam Thompson', followers: '45K', category: 'Art', verified: false },
  { username: 'music_beats', name: 'Chris Williams', followers: '78K', category: 'Music', verified: true },
  { username: 'gaming_pro', name: 'Taylor Davis', followers: '189K', category: 'Gaming', verified: false },
  { username: 'beauty_tips', name: 'Zoe Martinez', followers: '112K', category: 'Beauty', verified: true },
];

export const useInstagramAccounts = () => {
  const collection = useRxCollection("instagram_accounts_v0");
  const { result: accounts, isFetching } = useRxData("instagram_accounts_v0", (collection) => 
    collection.find().sort({ createdAt: "desc" })
  );

  // Seed database with sample accounts if empty
  useEffect(() => {
    const seedDatabase = async () => {
      if (collection && accounts.length === 0 && !isFetching) {
        try {
          const now = new Date().toISOString();
          for (const sampleAccount of sampleAccounts) {
            await collection.insert({
              id: crypto.randomUUID(),
              ...sampleAccount,
              createdAt: now,
              updatedAt: now,
            });
          }
        } catch (error) {
          console.error('Error seeding database:', error);
        }
      }
    };

    seedDatabase();
  }, [collection, accounts.length, isFetching]);

  const addAccount = async (accountData: Omit<InstagramAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!collection) return null;

    const now = new Date().toISOString();
    const newAccount = {
      id: crypto.randomUUID(),
      ...accountData,
      createdAt: now,
      updatedAt: now,
    };

    await collection.insert(newAccount);
    return newAccount;
  };

  const updateAccount = async (id: string, updateData: Partial<InstagramAccount>) => {
    if (!collection) return null;

    const accountDoc = await collection.findOne(id).exec();
    if (accountDoc) {
      await accountDoc.update({
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        }
      });
      return accountDoc;
    }
    return null;
  };

  const deleteAccount = async (id: string) => {
    if (!collection) return false;

    const accountDoc = await collection.findOne(id).exec();
    if (accountDoc) {
      await accountDoc.remove();
      return true;
    }
    return false;
  };

  const searchAccounts = (query: string) => {
    if (!query.trim()) return accounts.slice(0, 5);

    return accounts.filter((accountDoc: any) => {
      const account = accountDoc.toJSON ? accountDoc.toJSON() : accountDoc;
      return account.username.toLowerCase().includes(query.toLowerCase()) ||
             account.name.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 5);
  };

  return {
    accounts,
    isFetching,
    addAccount,
    updateAccount,
    deleteAccount,
    searchAccounts,
  };
}; 