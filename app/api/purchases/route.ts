import { NextResponse } from "next/server";
import { purchaseOrderSchema } from "@/lib/validators";
import { createPurchaseOrder, getPurchaseOrders } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getPurchaseOrders());
}

export async function POST(request: Request) {
  const payload = purchaseOrderSchema.parse(await request.json());
  const item = await createPurchaseOrder(payload);
  return NextResponse.json(item, { status: 201 });
}
