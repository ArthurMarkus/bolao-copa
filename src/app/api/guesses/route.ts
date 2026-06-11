import { getSession } from "@/lib/auth";
import { saveGuess } from "@/services/guess.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    } 

    const { matchId, homeScore, awayScore } = await req.json()

    try {
        await saveGuess(session.userId, matchId, homeScore, awayScore)

        return NextResponse.json({ ok: true })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar palpite'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}