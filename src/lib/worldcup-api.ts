import { Match } from "@/types";

type ApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  homeTeam: { shortName: string | null };
  awayTeam: { shortName: string | null };
  score: {
    /** Como a partida terminou: REGULAR, EXTRA_TIME ou PENALTY_SHOOTOUT */
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT" | null;
    /** Placar acumulado final (inclui pênaltis se houver) */
    fullTime: {
      home: number | null;
      away: number | null;
    };
    /**
     * Placar apenas dos 90 minutos (tempo regular).
     * Presente quando duration === EXTRA_TIME ou PENALTY_SHOOTOUT.
     */
    regularTime?: {
      home: number | null;
      away: number | null;
    } | null;
  };
};

export async function getMatches(): Promise<Match[]> {
  const res = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) throw new Error("Erro ao buscar partidas");

  const data = await res.json();
  return data.matches.map(
    (m: ApiMatch): Match => {
      const duration = m.score.duration;
      const fullTime = m.score.fullTime;
      const regularTime = m.score.regularTime;

      // Para pênaltis ou prorrogação: o placar "oficial" para pontuação do bolão
      // é o do tempo regular (90 min), não o acumulado com os pênaltis.
      // regularTime estará preenchido nesses casos.
      const useRegularTime =
        (duration === "PENALTY_SHOOTOUT" || duration === "EXTRA_TIME") &&
        regularTime != null;

      return {
        id_match: m.id,
        team_home: m.homeTeam.shortName ?? "A definir",
        team_away: m.awayTeam.shortName ?? "A definir",
        date: new Date(m.utcDate),
        status: m.status as "TIMED" | "IN_PLAY" | "FINISHED" | "PAUSED",
        stage: m.stage,
        score_duration: duration ?? null,
        // home_score / away_score: placar para fins de pontuação (tempo regular)
        home_score: useRegularTime ? regularTime!.home : fullTime.home,
        away_score: useRegularTime ? regularTime!.away : fullTime.away,
        // placar real dos 90 min (iguais a home/away quando REGULAR)
        regular_home_score: regularTime?.home ?? fullTime.home,
        regular_away_score: regularTime?.away ?? fullTime.away,
      };
    },
  );

}

export async function getMatchById(id: number): Promise<Match | null> {
  const matches = await getMatches();
  return matches.find((m) => m.id_match === id) ?? null;
}
