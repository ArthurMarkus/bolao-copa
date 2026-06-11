import { getMatchById } from "@/lib/worldcup-api";
import { upsertGuess } from "@/repositories/guess.repository";

export async function saveGuess(userId: number, matchId: number, homeScore: number, awayScore: number) {
    const match = await getMatchById(matchId)
    if (match === null) {
        throw new Error('jogo inválido')
    }

    if (match.status !== `TIMED`) {
        throw new Error('nao é possível fazer palpite')
    }

    return await upsertGuess(userId, matchId, homeScore, awayScore)
}