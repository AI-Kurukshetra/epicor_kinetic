import { NextResponse } from "next/server";
import { inventorySchema } from "@/lib/validators";
import { createInventoryItem, getInventoryItems } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getInventoryItems());
}

export async function POST(request: Request) {
  const payload = inventorySchema.parse(await request.json());
  const item = await createInventoryItem(payload);
  return NextResponse.json(item, { status: 201 });
}
