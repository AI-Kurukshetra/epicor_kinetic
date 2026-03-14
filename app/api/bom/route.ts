import { NextResponse } from "next/server";
import { getBomRows } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getBomRows());
}
