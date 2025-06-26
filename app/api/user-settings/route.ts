import { NextResponse } from "next/server";

// Temporary in-memory storage for demo purposes
// In production, this would be stored in a database
let storedUserSettings = {
  userId: "user_123",
  email: "user@example.com",
  name: "John Doe",
  profilePictureUrl: "",
  subscription: "pro",
  monthlyMessageLimit: 1000,
  currentMonthUsage: 450,
  accountsLimit: 500,
  currentAccountsCount: 127,
  instagramUsername: "",
  instagramPassword: "",
  isActive: true,
  createdAt: "2024-01-15T00:00:00Z",
  lastLoginAt: "2024-01-20T10:30:00Z",
  updatedAt: "2024-01-20T10:30:00Z",
};

export async function GET(request: Request) {
  try {
    // For now, return stored user data
    // In a real implementation, you'd get the user ID from authentication
    return NextResponse.json(storedUserSettings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instagramUsername, instagramPassword, ...otherSettings } = body;

    // Update stored settings
    // In a real implementation, you'd:
    // 1. Get user ID from authentication
    // 2. Validate the input
    // 3. Encrypt the password before storing
    // 4. Save to database

    storedUserSettings = {
      ...storedUserSettings,
      ...otherSettings,
      instagramUsername: instagramUsername || storedUserSettings.instagramUsername,
      instagramPassword: instagramPassword || storedUserSettings.instagramPassword,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated user settings:", {
      ...otherSettings,
      instagramUsername,
      instagramPasswordSet: !!instagramPassword,
    });

    // Response without password
    const responseSettings = {
      ...storedUserSettings,
      instagramPassword: undefined, // Don't return the password
      instagramPasswordSet: !!storedUserSettings.instagramPassword,
    };

    return NextResponse.json({
      success: true,
      settings: responseSettings,
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Handle partial updates
  return POST(request);
} 