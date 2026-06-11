import { Match } from "@/types"

type ApiMatch = {
  id: number
  utcDate: string
  status: string
  homeTeam: { shortName: string | null }
  awayTeam: { shortName: string | null }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

export async function getMatches(): Promise<Match[]> {
    const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY!
        },
        next: { revalidate: 60 }
    })

    if (!res.ok) throw new Error('Erro ao buscar partidas')

    const data = await res.json()

    return data.matches.map((m: ApiMatch): Match => ({
        id_match: m.id,
        team_home: m.homeTeam.shortName ?? 'A definir',
        team_away: m.awayTeam.shortName ?? 'A definir',
        date: new Date(m.utcDate),
        status: m.status as 'TIMED' | 'IN_PLAY' | 'FINISHED',
        home_score: m.score.fullTime.home,
        away_score: m.score.fullTime.away,
    }))
}

export async function getMatchById(id: number): Promise<Match | null> {
  const matches = await getMatches()
  return matches.find(m => m.id_match === id) ?? null
}