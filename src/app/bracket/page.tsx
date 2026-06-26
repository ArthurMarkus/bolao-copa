import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/worldcup-api";
import { findBracketGuessesByUser } from "@/repositories/bracket.repository";
import BracketForm from "@/components/bracket-form";
import { redirect } from "next/navigation";

const BRACKET_STAGES = [
  "LAST_32",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "FINAL",
];

export default async function BracketPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const matches = await getMatches();

  const bracketMatches = matches.filter((m) =>
    BRACKET_STAGES.includes(m.stage),
  );

  const bracketLocked = bracketMatches.some(
    (m) => m.status === "IN_PLAY" || m.status === "FINISHED",
  );
  
  const last32Matches = bracketMatches.filter((m) => m.stage === "LAST_32");
  
  const teamsReady =
    last32Matches.length > 0 &&
    last32Matches.every(
      (m) => m.team_home !== "A definir" && m.team_away !== "A definir",
    );

  if (!teamsReady) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-extrabold mb-4">🏆 Bracket</h1>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          <p className="text-4xl mb-4">⏳</p>
          <p className="text-white font-bold text-lg">
            Bracket disponível após a fase de grupos
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Os times serão definidos quando a fase de grupos terminar.
          </p>
        </div>
      </div>
    );
  }

  const bracketGuesses = await findBracketGuessesByUser(session.userId);
  const existingPicks = bracketGuesses.reduce(
    (acc, g) => {
      acc[g.match_id] = g.predicted_winner;
      return acc;
    },
    {} as Record<number, string>,
  );

  return (
    <div className="px-4 py-8 overflow-hidden">
      <h1 className="text-white text-3xl font-extrabold mb-6">🏆 Bracket</h1>
      {bracketLocked && (
        <p className="text-yellow-400 text-sm mb-4">
          ⚠️ O mata-mata já começou — seu bracket está bloqueado.
        </p>
      )}
      <BracketForm
        matches={bracketMatches}
        existingPicks={existingPicks}
        locked={bracketLocked}
      />
    </div>
  );
}
