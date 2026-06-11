export const flags: Record<string, string> = {
  "Mexico": "🇲🇽",
  "South Africa": "🇿🇦",
  "Korea Republic": "🇰🇷",
  "Czechia": "🇨🇿",
  "Canada": "🇨🇦",
  "Bosnia-H.": "🇧🇦",
  "USA": "🇺🇸",
  "Paraguay": "🇵🇾",
  "Qatar": "🇶🇦",
  "Switzerland": "🇨🇭",
  "Brazil": "🇧🇷",
  "Morocco": "🇲🇦",
  "Haiti": "🇭🇹",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Australia": "🇦🇺",
  "Turkey": "🇹🇷",
  "Argentina": "🇦🇷",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Spain": "🇪🇸",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", // 
  "Portugal": "🇵🇹",
  "Belgium": "🇧🇪",
  "Netherlands": "🇳🇱",
  "Croatia": "🇭🇷",
  "Uruguay": "🇺🇾",
  "Senegal": "🇸🇳",
  "Japan": "🇯🇵",
  "Saudi Arabia": "🇸🇦",
  "Ecuador": "🇪🇨",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", // 🏴󠁧󠁢󠁷󠁬󠁳󠁿
  "Iran": "🇮🇷",
  "Poland": "🇵🇱",
  "Denmark": "🇩🇰",
  "Tunisia": "🇹🇳",
  "Costa Rica": "🇨🇷",
  "Serbia": "🇷🇸",
  "Cameroon": "🇨🇲",
  "Ghana": "🇬🇭",
  "Switzerland": "🇨🇭",
  "Morocco": "🇲🇦",
  "Haiti": "🇭🇹",
  "USA": "🇺🇸",
  "Saudi Arabia": "🇸🇦",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "Korea": "🇰🇷",
  "Republic of Korea": "🇰🇷",
};

export function getFlagEmoji(countryName: string): string {
  if (!countryName || countryName === "A definir") return "🏳️";
  
  // Limpar espaços extras
  const cleanName = countryName.trim();
  
  // Tentar encontrar correspondência exata
  if (flags[cleanName]) return flags[cleanName];

  // Caso seja Inglaterra ou País de Gales (correção de unicode escape se der erro)
  if (cleanName.toLowerCase() === "england") return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  if (cleanName.toLowerCase() === "wales") return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
  if (cleanName.toLowerCase() === "scotland") return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  
  // Tentar busca parcial insensível a maiúsculas
  const found = Object.keys(flags).find(key => 
    key.toLowerCase() === cleanName.toLowerCase() ||
    cleanName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(cleanName.toLowerCase())
  );
  
  if (found) return flags[found];
  
  return "🏳️";
}
