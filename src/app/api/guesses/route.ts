import { getSession } from "@/lib/auth";
import { saveGuess } from "@/services/guess.service";
import { getMatches } from "@/lib/worldcup-api";
import { findGuessesByUser } from "@/repositories/guess.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userIdStr = searchParams.get('userId')
    if (!userIdStr) {
        return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })
    }

    const userId = Number(userIdStr)
    if (isNaN(userId)) {
        return NextResponse.json({ error: 'userId inválido' }, { status: 400 })
    }

    try {
        const [matches, guesses] = await Promise.all([
            getMatches(),
            findGuessesByUser(userId)
        ])

        // Filtra apenas partidas com times confirmados
        const confirmedMatches = matches.filter(
            (m) => m.team_home !== "A definir" && m.team_away !== "A definir"
        )

        // Mescla detalhes das partidas com os palpites do usuário
        const data = confirmedMatches.map(m => {
            const guess = guesses.find(g => g.match_id === m.id_match)
            return {
                ...m,
                guess: guess ? {
                    home_score: guess.home_score,
                    away_score: guess.away_score,
                    points: guess.points
                } : null
            }
        })

        return NextResponse.json(data)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Erro ao buscar palpites' }, { status: 500 })
    }
}

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