import { NextResponse } from "next/server";
import { apiClient } from "@workspace/sdk";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const res = await apiClient.get(`/teacher-tokens/${token}/validate`);
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message = err?.response?.data?.message ?? "Token validation failed.";
    return NextResponse.json({ valid: false, message }, { status });
  }
}
