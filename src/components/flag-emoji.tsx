/**
 * FlagEmoji — renderiza emojis de bandeira como imagens via Twemoji CDN.
 * Isso garante que as bandeiras apareçam corretamente no Windows, que não
 * suporta emojis de bandeira nativamente.
 */

type FlagEmojiProps = {
  emoji: string
  title?: string
  size?: number
  className?: string
}

/**
 * Mapeamento explícito para bandeiras de subdivisão que o Twemoji não suporta.
 * O Windows renderiza apenas 🏴 para England, Scotland e Wales — usamos
 * SVGs da Wikimedia como fallback.
 */
const SUBDIVISION_FLAG_URLS: Record<string, string> = {
  // England 🏴󠁧󠁢󠁥󠁮󠁧󠁿
  "1f3f4-e0067-e0062-e0065-e006e-e0067-e007f":
    "https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg",
  // Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿
  "1f3f4-e0067-e0062-e0073-e0063-e0074-e007f":
    "https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Scotland.svg",
  // Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿
  "1f3f4-e0067-e0062-e0077-e006c-e0073-e007f":
    "https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Wales.svg",
}

/**
 * Converte um emoji (string) para o code point no formato usado pelo Twemoji.
 * Ex: "🇧🇷" → "1f1e7-1f1f7"
 */
function emojiToTwemojiId(emoji: string): string | null {
  const codePoints: string[] = []

  for (const char of emoji) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    // Ignora o variation selector U+FE0F (não faz parte do nome do arquivo)
    if (cp === 0xfe0f) continue
    codePoints.push(cp.toString(16))
  }

  if (codePoints.length === 0) return null
  return codePoints.join("-")
}

export default function FlagEmoji({ emoji, title, size = 28, className = "" }: FlagEmojiProps) {
  const id = emojiToTwemojiId(emoji)


  if (!id) {
    // Fallback: renderiza o emoji como texto normalmente
    return <span title={title} className={className}>{emoji}</span>
  }

  const src = SUBDIVISION_FLAG_URLS[id] ?? `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${id}.svg`

  return (
    <img
      src={src}
      alt={title ?? emoji}
      title={title}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      // Fallback para o emoji de texto caso a imagem falhe
      onError={(e) => {
        const parent = e.currentTarget.parentElement
        if (parent) {
          const span = document.createElement("span")
          span.textContent = emoji
          span.title = title ?? ""
          parent.replaceChild(span, e.currentTarget)
        }
      }}
    />
  )
}
