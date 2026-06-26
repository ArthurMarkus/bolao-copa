import { BracketGuess } from "@/types";
import { db } from "@/lib/db";

export async function upsertBracketGuess(
  userId: number,
  matchId: number,
  predictedWinner: string
): Promise<BracketGuess> {
    const { rows } = await db.query(`
    INSERT INTO bracket_guesses (user_id, match_id, predicted_winner)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, match_id)
    DO UPDATE SET predicted_winner = $3
    RETURNING *`,
    [userId, matchId, predictedWinner]
)

return rows[0]
}

export async function findBracketGuessesByUser(userId: number): Promise<BracketGuess[]> {
    const { rows } = await db.query('SELECT id, user_id, match_id, predicted_winner, points FROM bracket_guesses WHERE user_id = $1',
        [userId]
    )

    return rows
}

export async function findBracketGuessesByMatchIds(matchIds: number[]): Promise<BracketGuess[]> {
    if (matchIds.length === 0) return []
    const { rows } = await db.query(
        'SELECT id, user_id, match_id, predicted_winner, points FROM bracket_guesses WHERE match_id = ANY($1)',
        [matchIds]
    )
    return rows
}
export async function updateBracketGuessPoints(guessId: number, points: number) {
    await db.query(`UPDATE bracket_guesses SET points = $1 WHERE id = $2`, [points, guessId])
}
