import { Episode, PodcastConfig } from "./db";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc2822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export function generateRssFeed(config: PodcastConfig, episodes: Episode[]): string {
  const baseUrl = (process.env.PODCAST_BASE_URL || config.websiteUrl || "http://localhost:3000").replace(/\/$/, "");
  const published = episodes.filter((e) => e.status === "published");

  const coverUrl = config.coverImage
    ? `${baseUrl}/api/covers/${config.coverImage}`
    : `${baseUrl}/podcast-cover.jpg`;

  const items = published
    .map((ep) => {
      const audioUrl = ep.audioUrl || `${baseUrl}/api/audio/${ep.audioFile}`;
      const enclosureType = ep.audioFile.endsWith(".m4a")
        ? "audio/x-m4a"
        : ep.audioFile.endsWith(".ogg")
        ? "audio/ogg"
        : "audio/mpeg";

      return `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description><![CDATA[${ep.description}]]></description>
      <content:encoded><![CDATA[${ep.showNotes || ep.description}]]></content:encoded>
      <pubDate>${formatRfc2822(ep.publishDate)}</pubDate>
      <guid isPermaLink="false">${baseUrl}/episodes/${ep.id}</guid>
      <link>${baseUrl}/episodes/${ep.id}</link>
      <enclosure url="${escapeXml(audioUrl)}" length="${ep.fileSize || 0}" type="${enclosureType}"/>
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:summary><![CDATA[${ep.description}]]></itunes:summary>
      <itunes:duration>${ep.duration || "0:00"}</itunes:duration>
      <itunes:explicit>${config.explicit ? "yes" : "no"}</itunes:explicit>
      <itunes:episodeType>${ep.episodeType || "full"}</itunes:episodeType>
      ${ep.season ? `<itunes:season>${ep.season}</itunes:season>` : ""}
      ${ep.episodeNumber ? `<itunes:episode>${ep.episodeNumber}</itunes:episode>` : ""}
      ${ep.coverImage ? `<itunes:image href="${escapeXml(`${baseUrl}/api/covers/${ep.coverImage}`)}"/>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <description><![CDATA[${config.description}]]></description>
    <link>${escapeXml(baseUrl)}</link>
    <language>${config.language || "he"}</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(config.author)}</copyright>
    <pubDate>${published[0] ? formatRfc2822(published[0].publishDate) : new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/api/feed`)}" rel="self" type="application/rss+xml"/>
    <itunes:author>${escapeXml(config.author)}</itunes:author>
    <itunes:summary><![CDATA[${config.description}]]></itunes:summary>
    <itunes:owner>
      <itunes:name>${escapeXml(config.author)}</itunes:name>
      <itunes:email>${escapeXml(config.email)}</itunes:email>
    </itunes:owner>
    <itunes:explicit>${config.explicit ? "yes" : "no"}</itunes:explicit>
    <itunes:image href="${escapeXml(coverUrl)}"/>
    <itunes:category text="${escapeXml(config.category)}">
      ${config.subcategory ? `<itunes:category text="${escapeXml(config.subcategory)}"/>` : ""}
    </itunes:category>
    <googleplay:author>${escapeXml(config.author)}</googleplay:author>
    <googleplay:email>${escapeXml(config.email)}</googleplay:email>
    <googleplay:image href="${escapeXml(coverUrl)}"/>
    <image>
      <url>${escapeXml(coverUrl)}</url>
      <title>${escapeXml(config.title)}</title>
      <link>${escapeXml(baseUrl)}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}
