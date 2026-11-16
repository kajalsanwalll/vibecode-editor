
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function updateProfile(name: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your profile.",
      };
    }

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length > 50) {
      return {
        success: false,
        message: "Name must be between 1 and 50 characters.",
      };
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: trimmedName,
      },
    });

    return {
      success: true,
      message: "Your profile has been updated successfully!",
    };
  } catch (error) {
    console.error("Profile update error:", error);

    return {
      success: false,
      message: "Unable to update your profile. Please try again.",
    };
  }
}
