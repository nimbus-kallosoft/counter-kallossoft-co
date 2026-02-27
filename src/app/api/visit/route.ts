import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  // Get current count
  const { data: row, error: fetchError } = await supabase
    .from("visits")
    .select("id, count")
    .limit(1)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const newCount = (row.count ?? 0) + 1;

  // Increment
  const { error: updateError } = await supabase
    .from("visits")
    .update({ count: newCount, updated_at: new Date().toISOString() })
    .eq("id", row.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ count: newCount });
}

export async function GET() {
  const { data, error } = await supabase
    .from("visits")
    .select("count")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data.count });
}
