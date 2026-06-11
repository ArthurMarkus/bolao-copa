import { NextRequest, NextResponse } from "next/server"
import { recalcRanking } from "@/services/ranking.service"

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("Cron: Atualizando ranking...")

  try {
    await recalcRanking()
    console.log("Ranking atualizado com sucesso")
    return NextResponse.json({ success: true, message: "Ranking updated" })
  } catch (error) {
    console.error("Erro ao atualizar ranking:", error)
    return NextResponse.json(
      { error: "Failed to update ranking" },
      { status: 500 }
    )
  }
}
