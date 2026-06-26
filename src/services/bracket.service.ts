import { findBracketGuessesByMatchIds, updateBracketGuessPoints } from "@/repositories/bracket.repository";
import { getMatches } from "@/lib/worldcup-api";
import { BracketGuess, Match } from "@/types";

export function calcBracketPoints(guess: BracketGuess, match: Match): number {
  if (match.home_score === null || match.away_score === null) return 0;

  const realWinner =
    match.home_score > match.away_score ? match.team_home : match.team_away;

  const correctBracketGuess = guess.predicted_winner === realWinner;

  if (correctBracketGuess) return 1;

  return 0;
}

let lastFinishedMatchesHash = "";

export async function recalcBracket(prefetchedMatches?: Match[], force = false) {
  const matches = prefetchedMatches || (await getMatches());
  const finishedMatches = matches.filter(
    (m) => m.status === "FINISHED" && m.stage !== "GROUP_STAGE",
  );
  if (finishedMatches.length === 0) return;

  const currentHash = finishedMatches
    .map((m) => `${m.id_match}-${m.home_score}-${m.away_score}`)
    .join("|");

  if (!force && currentHash === lastFinishedMatchesHash) return;

  const finishedMatchIds = finishedMatches.map((m) => m.id_match);
  const guesses = await findBracketGuessesByMatchIds(finishedMatchIds);

  const updates = [];
  for (const guess of guesses) {
    const match = finishedMatches.find((m) => m.id_match === guess.match_id);
    if (match && match.home_score !== null && match.away_score !== null) {
      const currentPoints = calcBracketPoints(guess, match);
      if (guess.points !== currentPoints) {
        updates.push(updateBracketGuessPoints(guess.id, currentPoints));
      }
    }
  }

  if (updates.length > 0) await Promise.all(updates);

  lastFinishedMatchesHash = currentHash;
}