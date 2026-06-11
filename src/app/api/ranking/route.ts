import { getRanking } from "@/repositories/guess.repository";
import { recalcRanking } from "@/services/ranking.service";
import { NextResponse } from "next/server";

export async function GET() {
    await recalcRanking()
    const ranking = await getRanking()
    return NextResponse.json({ ranking }) 
}