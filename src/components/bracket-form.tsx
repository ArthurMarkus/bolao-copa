"use client";
import { useState, useRef, useEffect } from "react";
import { Match } from "@/types";

type BracketColumnProps = {
  stage: string;
  matches: Match[];
  picks: Record<number, string>;
  onPick: (matchId: number, team: string) => void;
  isDragging: React.RefObject<boolean>;
};

const stageLabels: Record<string, string> = {
  LAST_32: "16avos",
  LAST_16: "Oitavas",
  QUARTER_FINALS: "Quartas",
  SEMI_FINALS: "Semis",
  FINAL: "Final",
};

function BracketColumn({
  stage,
  matches,
  picks,
  onPick,
  isDragging,
}: BracketColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider text-center">
        {stageLabels[stage]}
      </p>
      <div className="flex flex-col justify-around flex-1 gap-8">
        {matches.map((match) => (
          <div
            key={match.id_match}
            className="bg-gray-900 rounded-xl border border-gray-800 w-48 overflow-hidden"
          >
            <button
              onClick={() => {
                if (isDragging.current) return;
                onPick(match.id_match, match.team_home);
              }}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors border-b border-gray-800 ${
                picks[match.id_match] === match.team_home
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {match.team_home}
            </button>
            <button
              onClick={() => {
                if (isDragging.current) return;
                onPick(match.id_match, match.team_away);
              }}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                picks[match.id_match] === match.team_away
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {match.team_away}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type BracketFormProps = {
  matches: Match[];
  existingPicks: Record<number, string>;
};

export default function BracketForm({
  matches,
  existingPicks,
}: BracketFormProps) {
  const [picks, setPicks] = useState<Record<number, string>>(existingPicks);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDragging.current = false;
      el.style.cursor = "grabbing";
      startX = e.pageX - el.getBoundingClientRect().left;
      scrollLeft = el.scrollLeft;
      e.preventDefault();
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      isDragging.current = true;
      const x = e.pageX - el.getBoundingClientRect().left;
      el.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const [toast, setToast] = useState<string | null>(null)

  async function pickWinner(matchId: number, team: string) {
  setPicks((prev) => ({ ...prev, [matchId]: team }));
  
  await fetch("/api/bracket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId, predictedWinner: team })
  })

  setToast(`${team} avança! ✅`)
  setTimeout(() => setToast(null), 2000)
}

  const STAGES = [
    "LAST_32",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "FINAL",
  ];

  const matchesByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = matches.filter((m) => m.stage === stage);
      return acc;
    },
    {} as Record<string, Match[]>,
  );

  const half = (stage: string) => {
    const arr = matchesByStage[stage];
    return {
      left: arr.slice(0, arr.length / 2),
      right: arr.slice(arr.length / 2),
    };
  };

  const last32 = half("LAST_32");
  const last16 = half("LAST_16");
  const quarters = half("QUARTER_FINALS");
  const semis = half("SEMI_FINALS");

  function getNextRoundMatches(currentMatches: Match[], nextMatches: Match[]) {
    const winners = currentMatches.map((m) => picks[m.id_match] ?? "A definir");
    return nextMatches.map((match, i) => ({
      ...match,
      team_home: winners[i * 2] ?? "A definir",
      team_away: winners[i * 2 + 1] ?? "A definir",
    }));
  }

  const last16Left = getNextRoundMatches(last32.left, last16.left);
  const last16Right = getNextRoundMatches(last32.right, last16.right);
  const quartersLeft = getNextRoundMatches(last16Left, quarters.left);
  const quartersRight = getNextRoundMatches(last16Right, quarters.right);
  const semisLeft = getNextRoundMatches(quartersLeft, semis.left);
  const semisRight = getNextRoundMatches(quartersRight, semis.right);
  const finalMatch = getNextRoundMatches(
    [...semisLeft, ...semisRight],
    matchesByStage["FINAL"],
  );

  return (
    <div
      ref={scrollRef}
      className="overflow-auto cursor-grab active:cursor-grabbing select-none hide-scrollbar"
      style={{
        height: "calc(100vh - 120px)",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE
      }}
    >
      <div className="flex gap-8 min-w-max p-4">
        <div className="flex gap-8">
          <BracketColumn
            stage="LAST_32"
            matches={last32.left}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="LAST_16"
            matches={last16Left}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="QUARTER_FINALS"
            matches={quartersLeft}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="SEMI_FINALS"
            matches={semisLeft}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
        </div>

        <BracketColumn
          stage="FINAL"
          matches={finalMatch}
          picks={picks}
          onPick={pickWinner}
          isDragging={isDragging}
        />

        <div className="flex gap-8 flex-row-reverse">
          <BracketColumn
            stage="LAST_32"
            matches={last32.right}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="LAST_16"
            matches={last16Right}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="QUARTER_FINALS"
            matches={quartersRight}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
          <BracketColumn
            stage="SEMI_FINALS"
            matches={semisRight}
            picks={picks}
            onPick={pickWinner}
            isDragging={isDragging}
          />
        </div>
        <div className="flex justify-center p-6">
      </div>
      </div>
    </div>
  );
}
