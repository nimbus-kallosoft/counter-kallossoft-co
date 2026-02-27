import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const { data, error } = await supabase.rpc("increment_page_views");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data });
}

export async function GET() {
  const { data, error } = await supabase
    .from("page_views")
    .select("count")
    .eq("id", "counter")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data.count });
}
