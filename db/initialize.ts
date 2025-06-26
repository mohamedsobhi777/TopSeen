"use client";

import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

const tripsSchema = {
  version: 0,
  primaryKey: "tripId",
  type: "object",
  properties: {
    tripId: { type: "string", maxLength: 100 },
    tripName: { type: "string", maxLength: 100 },
  },
  required: ["tripId", "tripName"],
};

const travelItinerarySchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    tripId: { type: "string", maxLength: 100, ref: "trips_v0" }, // Reference to the trips_v0 table

    tripName: { type: "string", maxLength: 100 },
    title: { type: "string", maxLength: 100 },
    description: { type: "string", maxLength: 500 },
    image: { type: "string", format: "uri" },
    location: {
      type: "object",
      properties: {
        name: { type: "string", maxLength: 100 },
        address: { type: "string", maxLength: 200 },
        latitude: { type: "number", minimum: -90, maximum: 90 },
        longitude: { type: "number", minimum: -180, maximum: 180 },
        placeId: { type: "string" },
      },
      required: ["name", "address"],
    },
    day: { type: "string" },
    timeOfDay: { type: "string", maxLength: 50 },
    mapLink: { type: "string", format: "uri" },
    status: { type: "string", enum: ["done", "not done", "later"] },
    priority: { type: "string", enum: ["low", "medium", "high"] },
    notes: { type: "string", maxLength: 1000 },
    dueDate: { type: "string", format: "date" },
    estimatedTime: { type: "string", maxLength: 50 },
    reminderEnabled: { type: "boolean" },
    reminderTime: { type: "string", format: "date-time" },
    createdBy: { type: "string" },
    lastUpdatedBy: { type: "string" },
    category: { type: "string", maxLength: 50 },
    startDateTime: { type: "string", format: "date-time" },
    sequence: { type: "integer", minimum: 0 },
  },
  required: ["id", "title", "status", "startDateTime", "sequence"],
};

// Instagram accounts schema for autocomplete and library management
const instagramAccountsSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    username: { type: "string", maxLength: 100 },
    name: { type: "string", maxLength: 200 },
    followers: { type: "string", maxLength: 20 },
    category: { type: "string", maxLength: 100 },
    verified: { type: "boolean" },
    bio: { type: "string", maxLength: 500 },
    profilePictureUrl: { type: "string", format: "uri" },
    isPrivate: { type: "boolean" },
    followerCount: { type: "integer", minimum: 0 },
    followingCount: { type: "integer", minimum: 0 },
    postCount: { type: "integer", minimum: 0 },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "username", "name", "category", "verified"],
};

export const initialize = async () => {
  // Add plugins required for RxDB
  await addRxPlugin(RxDBDevModePlugin);
  await addRxPlugin(RxDBQueryBuilderPlugin);
  await addRxPlugin(RxDBUpdatePlugin);

  // create RxDB
  const db = await createRxDatabase({
    name: "mydatabase", // Change this to whatever database name you want
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  await db.addCollections({
    trips_v0: {
      schema: tripsSchema,
    },
    trip_itinerary_v0: {
      schema: travelItinerarySchema,
    },
    instagram_accounts_v0: {
      schema: instagramAccountsSchema,
    },
  });

  return db;
};
