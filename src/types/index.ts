export type Match = {
    id_match: number;
    team_home: string;
    team_away: string;
    home_score: number | null;
    away_score: number | null;
    date: Date;
    status: 'TIMED' | 'IN_PLAY' | 'FINISHED'; 
}

export type Guess = {
    id: number;
    user_id: number;
    match_id: number;
    home_score: number;
    away_score: number;
    points: number;
}

export type RankingEntry = {
    user_id: number;
    name: string;
    total_points: number;
}