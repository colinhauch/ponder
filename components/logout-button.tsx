"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Note: router.push() automatically adds basePath, so don't use appPath()
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
