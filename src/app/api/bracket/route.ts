import { getSession } from "@/lib/auth";
import { upsertBracketGuess } from "@/repositories/bracket.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    try {
        const { matchId, predictedWinner } = await req.json()

        await upsertBracketGuess(
            session.userId,
            matchId,
            predictedWinner
        )

        return NextResponse.json({ ok: true })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar palpite do bracket'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}