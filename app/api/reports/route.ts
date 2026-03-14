import { NextResponse } from "next/server";
import { getReportsSnapshot } from "@/services/erp";

export async function GET() {
  return NextResponse.json(await getReportsSnapshot());
}
