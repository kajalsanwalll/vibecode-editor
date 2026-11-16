
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Settings,
  User,
  Palette,
  Monitor,
  Save,
} from "lucide-react";

import { updateProfile } from "@/modules/settings/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsFormProps {
  initialName: string;
  email: string;
}

export default function SettingsForm({
  initialName,
  email,
}: SettingsFormProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const result = await updateProfile(name);

    setSaving(false);
    setMessage(result.message);
    setIsError(!result.success);

    if (result.success) {
      setName(name.trim());
      router.refresh();
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10">

      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <p className="mt-2 text-muted-foreground">
          Manage your account and customize your VibeCode experience.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>

            <CardDescription>
              Manage your personal information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                value={email}
                disabled
              />

              <p className="text-xs text-muted-foreground">
                Your email is managed by your authentication provider.
              </p>
            </div>

            {message && (
              <p
                role="status"
                className={`text-sm ${
                  isError ? "text-destructive" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>

          </CardContent>
        </Card>

      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>

          <CardDescription>
            Customize how VibeCode looks.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">

            <Button
              type="button"
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              Light
            </Button>

            <Button
              type="button"
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>

            <Button
              type="button"
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}
