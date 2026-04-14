import { NextRequest, NextResponse } from "next/server";
import { getEpisode, updateEpisode, deleteEpisode } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ep = getEpisode(id);
  if (!ep) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(ep);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = await req.json();
  const updated = updateEpisode(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ep = getEpisode(id);
  if (!ep) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete audio file
  if (ep.audioFile) deleteUploadedFile(ep.audioFile, "audio");
  if (ep.coverImage) deleteUploadedFile(ep.coverImage, "cover");

  deleteEpisode(id);
  return NextResponse.json({ ok: true });
}
