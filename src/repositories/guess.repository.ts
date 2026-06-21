import { db } from '@/lib/db';
import { Guess, MatchGuessWithUser, RankingEntry } from '@/types';

export async function upsertGuess(userId: number, matchId: number, homeScore: number, awayScore: number): Promise<Guess> {
    const { rows } = await db.query(`
        INSERT INTO guesses (user_id, match_id, home_score, away_score) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, match_id)
        DO UPDATE SET home_score = $3, away_score = $4
        RETURNING *`,
        [userId, matchId, homeScore, awayScore]
    )

    return rows[0]
}

export async function findGuessesByMatch(matchId: number): Promise<Guess[]> {
    const { rows } = await db.query('SELECT id, user_id, match_id, home_score, away_score, points FROM guesses WHERE match_id = $1', [matchId])

    return rows
}

export async function findGuessesByMatchIds(matchIds: number[]): Promise<Guess[]> {
    if (matchIds.length === 0) return []
    const { rows } = await db.query(
        'SELECT id, user_id, match_id, home_score, away_score, points FROM guesses WHERE match_id = ANY($1)',
        [matchIds]
    )
    return rows
}

export async function findGuessesByUser(userId: number): Promise<Guess[]> {
    const { rows } = await db.query(
        'SELECT id, user_id, match_id, home_score, away_score, points FROM guesses WHERE user_id = $1',
        [userId]
    )
    return rows
}

export async function findAllGuessesWithUserNames(): Promise<MatchGuessWithUser[]> {
    const { rows } = await db.query(`
        SELECT g.id, g.user_id, u.name as user_name, g.match_id, g.home_score, g.away_score, g.points
        FROM guesses g
        JOIN users u ON u.id = g.user_id
    `)
    return rows
}

export async function findGuessesWithUserNamesByMatch(matchId: number): Promise<MatchGuessWithUser[]> {
    const { rows } = await db.query(`
        SELECT g.id, g.user_id, u.name as user_name, g.match_id, g.home_score, g.away_score, g.points
        FROM guesses g
        JOIN users u ON u.id = g.user_id
        WHERE g.match_id = $1
    `, [matchId])
    return rows
}


export async function updateGuessPoints(guessId: number, points: number) {
    await db.query('UPDATE guesses SET points = $1 WHERE id = $2', [points, guessId])
}

export async function getRanking(): Promise<RankingEntry[]> {
    const { rows } = await db.query(`
        SELECT u.id as user_id, u.name, COALESCE(SUM(g.points), 0)::int as total_points
        FROM users u 
        LEFT JOIN guesses g ON g.user_id = u.id
        GROUP BY u.id, u.name
        ORDER BY total_points DESC`
    )

    return rows
}

export async function getMostCorrectGuesses(matchIds: number[]): Promise<{ name: string, count: number }> {
    const { rows } = await db.query(`
        SELECT u.name, COUNT(*) as count
        FROM guesses g
        JOIN users u ON u.id = g.user_id
        WHERE g.points > 0 AND g.match_id = ANY($1)
        GROUP BY u.id, u.name
        HAVING (SELECT COUNT(*) FROM guesses WHERE user_id = u.id AND match_id = ANY($1)) >= 10
        ORDER BY count DESC
        LIMIT 1 `, [matchIds]
    )

    return rows[0]
}

export async function getMostPerfectScores(matchIds: number[]): Promise<{ name: string, count: number }> {
    const { rows } = await db.query(`
        SELECT u.name, COUNT(*) as count
        FROM guesses g
        JOIN users u ON u.id = g.user_id
        WHERE g.points > 1 AND g.match_id = ANY($1)
        GROUP BY u.id, u.name
        HAVING (SELECT COUNT(*) FROM guesses WHERE user_id = u.id AND match_id = ANY($1)) >= 10
        ORDER BY count DESC
        LIMIT 1 `, [matchIds]
    )

    return rows[0]
}

export async function getLeastCorrectGuesses(matchIds: number[]): Promise<{ name: string, count: number }> {
    const { rows } = await db.query(`
        SELECT u.name, COUNT(*) as count
        FROM guesses g
        JOIN users u ON u.id = g.user_id
        WHERE g.points = 0 AND g.match_id = ANY($1)
        GROUP BY u.id, u.name
        HAVING (SELECT COUNT(*) FROM guesses WHERE user_id = u.id AND match_id = ANY($1)) >= 10
        ORDER BY count DESC
        LIMIT 1 `, [matchIds]
    )

    return rows[0]
}