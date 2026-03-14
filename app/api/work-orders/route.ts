import { NextResponse } from "next/server";
import { workOrderSchema } from "@/lib/validators";
import { createWorkOrder, getWorkOrders } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getWorkOrders());
}

export async function POST(request: Request) {
  const payload = workOrderSchema.parse(await request.json());
  const item = await createWorkOrder(payload);
  return NextResponse.json(item, { status: 201 });
}
