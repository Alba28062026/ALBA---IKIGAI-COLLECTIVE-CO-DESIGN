import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    app: "alba-ikigai",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
