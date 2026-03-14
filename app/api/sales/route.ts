import { NextResponse } from "next/server";
import { salesOrderSchema } from "@/lib/validators";
import { createSalesOrder, getSalesOrders } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getSalesOrders());
}

export async function POST(request: Request) {
  const payload = salesOrderSchema.parse(await request.json());
  const item = await createSalesOrder(payload);
  return NextResponse.json(item, { status: 201 });
}
