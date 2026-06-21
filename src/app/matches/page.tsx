import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/worldcup-api";
import { findGuessesByUser } from "@/repositories/guess.repository";
import { recalcRanking } from "@/services/ranking.service";
import { redirect } from "next/navigation";
import MatchesList from "@/components/matches-list";

export default async function MatchesPage() {
  await recalcRanking();
  const session = await getSession();
  if (!session) redirect("/login");

  const [matches, guesses] = await Promise.all([
    getMatches(),
    findGuessesByUser(session.userId),
  ]);

  // Filtra apenas partidas com times confirmados
  const confirmedMatches = matches.filter(
    (m) => m.team_home !== "A definir" && m.team_away !== "A definir",
  );

  // Determina a partida ativa/próxima para scroll automático
  let activeMatchId = confirmedMatches.find(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
  )?.id_match;

  if (!activeMatchId) {
    activeMatchId = confirmedMatches.find((m) => m.status === "TIMED")?.id_match;
  }

  if (!activeMatchId && confirmedMatches.length > 0) {
    activeMatchId = confirmedMatches[confirmedMatches.length - 1].id_match;
  }

  return (
    <MatchesList
      confirmedMatches={confirmedMatches}
      userGuesses={guesses}
      sessionUserId={session.userId}
      initialActiveMatchId={activeMatchId}
    />
  );
}

