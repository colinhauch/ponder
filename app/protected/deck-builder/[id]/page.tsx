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

  // Access the deck ID from params (for future use)
  const { id: _deckId } = await params;

  return <ResizableGrid />;
}
