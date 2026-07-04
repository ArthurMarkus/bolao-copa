export type Match = {
  id_match: number;
  team_home: string;
  team_away: string;
  /** Para pontuação do bolão: placar dos 90 min (tempo regular) */
  home_score: number | null;
  away_score: number | null;
  /** Placar acumulado final (fullTime da API — inclui ET e pênaltis se houver) */
  final_home_score: number | null;
  final_away_score: number | null;
  /** Placar da disputa de pênaltis (somente os gols do shootout, ex: 6×5) */
  penalty_home_score: number | null;
  penalty_away_score: number | null;
  /** Como a partida terminou: REGULAR, EXTRA_TIME ou PENALTY_SHOOTOUT */
  score_duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT" | null;
  stage: string;
  date: Date;
  status: "TIMED" | "IN_PLAY" | "FINISHED" | "PAUSED";
};

export type Guess = {
  id: number;
  user_id: number;
  match_id: number;
  home_score: number;
  away_score: number;
  points: number;
};

export type MatchGuessWithUser = {
  id: number;
  user_id: number;
  user_name: string;
  match_id: number;
  home_score: number;
  away_score: number;
  points: number;
};

export type RankingEntry = {
  user_id: number;
  name: string;
  total_points: number;
  hits?: number;
  perfect?: number;
  misses?: number;
};

export type BracketGuess = {
  id: number
  user_id: number
  match_id: number
  predicted_winner: string
  points: number
}
