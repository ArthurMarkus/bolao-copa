export const flags: Record<string, string> = {
  // Hosts
  "Canada": "🇨🇦",
  "Mexico": "🇲🇽",
  "USA": "🇺🇸",

  // Europa
  "Austria": "🇦🇹",
  "Belgium": "🇧🇪",
  "Bosnia-H.": "🇧🇦",
  "Croatia": "🇭🇷",
  "Czechia": "🇨🇿",
  "Denmark": "🇩🇰",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Netherlands": "🇳🇱",
  "Norway": "🇳🇴",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Serbia": "🇷🇸",
  "Spain": "🇪🇸",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Turkey": "🇹🇷",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",

  // América do Sul
  "Argentina": "🇦🇷",
  "Brazil": "🇧🇷",
  "Colombia": "🇨🇴",
  "Ecuador": "🇪🇨",
  "Paraguay": "🇵🇾",
  "Uruguay": "🇺🇾",

  // América Central e Caribe
  "Costa Rica": "🇨🇷",
  "Curaçao": "🇨🇼",
  "Haiti": "🇭🇹",
  "Panama": "🇵🇦",

  // Ásia
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Japan": "🇯🇵",
  "Jordan": "🇯🇴",
  "Korea Republic": "🇰🇷",
  "Qatar": "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  "Uzbekistan": "🇺🇿",

  // África
  "Algeria": "🇩🇿",
  "Cameroon": "🇨🇲",
  "Cape Verde": "🇨🇻",
  "Congo DR": "🇨🇩",
  "Egypt": "🇪🇬",
  "Ghana": "🇬🇭",
  "Ivory Coast": "🇨🇮",
  "Morocco": "🇲🇦",
  "Senegal": "🇸🇳",
  "South Africa": "🇿🇦",
  "Tunisia": "🇹🇳",

  // Oceania
  "Australia": "🇦🇺",
  "New Zealand": "🇳🇿",
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
