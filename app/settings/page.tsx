
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <SettingsForm
      initialName={user.name}
      email={user.email}
    />
  );
}
