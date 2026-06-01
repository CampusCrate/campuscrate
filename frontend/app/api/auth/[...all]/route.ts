import { NextResponse } from "next/server";

// This better-auth route is unused — auth is handled by Django JWT.
// Keeping a minimal stub so this file doesn't crash the build.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 404 });
}
