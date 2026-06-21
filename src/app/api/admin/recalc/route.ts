import { recalcRanking } from "@/services/ranking.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await recalcRanking(undefined, true)
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: "" }, { status: 500})
    }
}