import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // For now, fetch from user settings API
    // In a real implementation, you'd:
    // 1. Get user ID from authentication/session
    // 2. Fetch from database
    // 3. Decrypt the stored password
    
    try {
      const userSettingsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user-settings`);
      if (userSettingsResponse.ok) {
        const userSettings = await userSettingsResponse.json();
        return NextResponse.json({
          instagramUsername: userSettings.instagramUsername || process.env.INSTAGRAM_USERNAME || "",
          instagramPassword: userSettings.instagramPassword || process.env.INSTAGRAM_PASSWORD || "",
        });
      }
    } catch (fetchError) {
      console.error("Failed to fetch user settings:", fetchError);
    }

    // Fallback to environment variables
    const fallbackCredentials = {
      instagramUsername: process.env.INSTAGRAM_USERNAME || "",
      instagramPassword: process.env.INSTAGRAM_PASSWORD || "",
    };

    return NextResponse.json(fallbackCredentials);
  } catch (error) {
    console.error("Error fetching user credentials:", error);
    return NextResponse.json(
      { error: "Failed to fetch user credentials" },
      { status: 500 }
    );
  }
} 