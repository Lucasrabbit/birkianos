import { NextResponse } from "next/server";

// Lets the client know which optional features have their env vars
// configured, without exposing any secret value.
export async function GET() {
  const photosEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  );
  return NextResponse.json({ photosEnabled });
}
