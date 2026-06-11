import { getMatches } from "@/lib/worldcup-api";
import { findGuessesByMatch, updateGuessPoints } from "@/repositories/guess.repository";
import { Guess, Match } from "@/types";

export function calcPoints(guess: Guess, match: Match): number {
    const perfectResult = match.home_score === guess.home_score && match.away_score === guess.away_score;

    const matchResult = Math.sign(match.home_score! - match.away_score!)
    const matchGuess  = Math.sign(guess.home_score - guess.away_score)

    const correctResult = matchResult === matchGuess

    if (perfectResult) return 2
    if (correctResult) return 1
    return 0
}

export async function recalcRanking() {
    const matches = await getMatches()
    const finishededMatches = matches.filter(m => m.status ===`FINISHED`)

    for (const match of finishededMatches) {
        const matchGuesses = await findGuessesByMatch(match.id_match);
        for (const guess of matchGuesses) {
            await updateGuessPoints(guess.id, calcPoints(guess, match))
        }
    }
}