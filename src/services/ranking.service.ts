import { getMatches } from "@/lib/worldcup-api";
import {
  findGuessesByMatchIds,
  updateGuessPoints,
} from "@/repositories/guess.repository";
import { Guess, Match } from "@/types";

export function calcPoints(guess: Guess, match: Match): number {
  const perfectResult =
    match.home_score === guess.home_score &&
    match.away_score === guess.away_score;

  const matchResult = Math.sign(match.home_score! - match.away_score!);
  const matchGuess = Math.sign(guess.home_score - guess.away_score);

  const correctResult = matchResult === matchGuess;

  if (perfectResult) return 2;
  if (correctResult) return 1;
  return 0;
}

let lastFinishedMatchesHash = "";

export async function recalcRanking(preFetchedMatches?: Match[], force = false) {
  const matches = preFetchedMatches || await getMatches();
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");
  if (finishedMatches.length === 0) return;

  const currentHash = finishedMatches
    .map((m) => `${m.id_match}-${m.home_score}-${m.away_score}`)
    .join("|");

  if (!force && currentHash === lastFinishedMatchesHash) {
    return;
  }

  const finishedMatchIds = finishedMatches.map((m) => m.id_match);
  const guesses = await findGuessesByMatchIds(finishedMatchIds);

  const updates = [];
  for (const guess of guesses) {
    const match = finishedMatches.find((m) => m.id_match === guess.match_id);
    if (match && match.home_score !== null && match.away_score !== null) {
      const currentPoints = calcPoints(guess, match);
      if (guess.points !== currentPoints) {
        updates.push(updateGuessPoints(guess.id, currentPoints));
      }
    }
  }

  if (updates.length > 0) {
    await Promise.all(updates);
  }

  lastFinishedMatchesHash = currentHash;
}
