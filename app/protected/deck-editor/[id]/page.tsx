import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResizableGrid } from "@/components/deck-builder/resizable-grid";

export default async function DeckBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Await params to satisfy Next.js 15 requirements
  await params;

  return <ResizableGrid />;
}
