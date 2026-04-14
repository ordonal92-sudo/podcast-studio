import { NextRequest, NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No authorization code" }, { status: 400 });
  }

  try {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    // Show the refresh token so the user can copy it to .env.local
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>YouTube Connected</title>
<style>
  body { font-family: sans-serif; background: #07071A; color: #F8F8FF; padding: 40px; max-width: 700px; margin: 0 auto; }
  h1 { color: #A78BFA; }
  .token-box { background: #16163A; border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 16px; word-break: break-all; font-family: monospace; font-size: 13px; margin: 16px 0; }
  .step { background: rgba(139,92,246,0.1); border-left: 3px solid #8B5CF6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 8px 0; }
  a { color: #A78BFA; }
</style>
</head>
<body>
<h1>✅ YouTube Connected!</h1>
<p>Copy the refresh token below and add it to your <code>.env.local</code> file:</p>
<div class="token-box">YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token || "⚠️ No refresh token returned — re-authorize with prompt=consent"}</div>
<div class="step"><strong>Step 1:</strong> Open your <code>.env.local</code> file</div>
<div class="step"><strong>Step 2:</strong> Add or update: <code>YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token || "TOKEN_HERE"}</code></div>
<div class="step"><strong>Step 3:</strong> Restart the dev server: <code>npm run dev</code></div>
<div class="step"><strong>Step 4:</strong> <a href="/dashboard/upload">Upload your first episode →</a></div>
${!tokens.refresh_token ? `<p style="color:#EF4444">⚠️ No refresh token received. This happens when you've already authorized before. <a href="/api/youtube/auth" style="color:#F472B6">Click here to re-authorize</a>.</p>` : ""}
</body>
</html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
