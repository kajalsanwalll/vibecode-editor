
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
    >
      <LogOut size={16} className="mr-2" />
      Logout
    </Button>
  );
}
