import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminSession";
import { adminAuth, adminStorageBucket } from "@/lib/firebase/admin";

// Members upload their own card photo into this folder with a Firebase Auth
// ID token instead of an admin session — everything else is admin-only.
const MEMBER_FOLDERS = new Set(["members"]);

async function isAuthorizedAdmin(): Promise<boolean> {
  return Boolean(await getAdminSession());
}

async function isAuthorizedMember(req: NextRequest): Promise<boolean> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  try {
    await adminAuth.verifyIdToken(header.slice("Bearer ".length));
    return true;
  } catch {
    return false;
  }
}

// A plain Route Handler (not a Server Action) so the client can upload via
// XMLHttpRequest and get real `upload.onprogress` events — Server Actions
// don't expose upload progress.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File) || typeof folder !== "string" || !folder) {
    return NextResponse.json({ error: "Missing file or folder." }, { status: 400 });
  }

  const authorized = MEMBER_FOLDERS.has(folder) ? await isAuthorizedMember(req) : await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${folder}/${randomUUID()}-${file.name}`;
  const token = randomUUID();
  const storageFile = adminStorageBucket.file(path);

  await storageFile.save(buffer, {
    metadata: {
      contentType: file.type || "application/octet-stream",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const encodedPath = encodeURIComponent(path);
  const url = `https://firebasestorage.googleapis.com/v0/b/${adminStorageBucket.name}/o/${encodedPath}?alt=media&token=${token}`;
  return NextResponse.json({ url });
}
