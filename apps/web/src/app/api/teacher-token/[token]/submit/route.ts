import { NextResponse } from "next/server";
import { apiClient } from "@workspace/sdk";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const body = await req.json();
    const res = await apiClient.post(`/teacher-tokens/${token}/submit`, body);
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message = err?.response?.data?.message ?? "Submission failed.";
    return NextResponse.json({ message }, { status });
  }
}
