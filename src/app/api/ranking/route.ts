import { getRanking } from "@/repositories/guess.repository";
import { recalcRanking } from "@/services/ranking.service";
import { getMatches } from "@/lib/worldcup-api";
import { NextResponse } from "next/server";

export async function GET() {
    const matches = await getMatches()
    await recalcRanking(matches)
    
    const finishedMatchIds = matches
        .filter((m) => m.status === "FINISHED")
        .map((m) => m.id_match);

    const ranking = await getRanking(finishedMatchIds)
    return NextResponse.json({ ranking }) 
}