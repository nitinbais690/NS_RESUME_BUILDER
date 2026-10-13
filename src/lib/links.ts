/** Adds https:// to a bare link like "github.com/alex". */
export const withProtocol = (v: string) => {
  const t = v.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

/**
 * The user name from a LinkedIn or GitHub profile link, for display:
 * "https://www.linkedin.com/in/alex-j/" → "alex-j", "github.com/alex" → "alex".
 * Anything that isn't a recognisable profile link is shown without its protocol.
 */
export const profileHandle = (v: string) => {
  const bare = v
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '');
  const match =
    /^linkedin\.com\/(?:in|pub|company)\/([^/]+)/i.exec(bare) ??
    /^github\.com\/([^/]+)/i.exec(bare);
  if (!match) return bare;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};
