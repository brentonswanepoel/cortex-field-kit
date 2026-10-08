export interface RoadmapIssue {
  number: number;
  title: string;
  url: string;
  labels: string[];
  updatedAt: string;
}

export interface RoadmapResult {
  available: boolean;
  reason: string;
  issues: RoadmapIssue[];
}

const TRACKED_LABELS = ['asset', 'site-feature', 'use-case'] as const;
const REPO = 'brentonswanepoel/cortex-field-kit';

/**
 * Loads open GitHub Issues at build time.
 * With no token, or if the API cannot be reached, returns an empty unavailable
 * result so local and offline builds still succeed.
 */
export async function loadRoadmap(): Promise<RoadmapResult> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    return {
      available: false,
      reason: 'Roadmap data is unavailable without a GitHub token. CI supplies GITHUB_TOKEN when the site is built for publication.',
      issues: [],
    };
  }

  const endpoint = `https://api.github.com/repos/${REPO}/issues?state=open&per_page=100`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'cortex-field-kit',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return {
        available: false,
        reason: `Roadmap data is unavailable (GitHub API returned ${response.status}).`,
        issues: [],
      };
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return {
        available: false,
        reason: 'Roadmap data is unavailable (unexpected GitHub API response).',
        issues: [],
      };
    }

    const issues: RoadmapIssue[] = [];
    for (const item of payload) {
      if (!item || typeof item !== 'object') continue;
      const record = item as Record<string, unknown>;
      if (record.pull_request) continue;
      if (typeof record.number !== 'number' || typeof record.title !== 'string' || typeof record.html_url !== 'string') {
        continue;
      }
      const labels = Array.isArray(record.labels)
        ? record.labels
            .map((label) => {
              if (typeof label === 'string') return label;
              if (label && typeof label === 'object' && 'name' in label && typeof label.name === 'string') {
                return label.name;
              }
              return '';
            })
            .filter(Boolean)
        : [];
      if (!labels.some((label) => (TRACKED_LABELS as readonly string[]).includes(label))) continue;
      issues.push({
        number: record.number,
        title: record.title,
        url: record.html_url,
        labels,
        updatedAt: typeof record.updated_at === 'string' ? record.updated_at : '',
      });
    }

    issues.sort((a, b) => b.number - a.number);
    return { available: true, reason: '', issues };
  } catch {
    return {
      available: false,
      reason: 'Roadmap data is unavailable because the GitHub API could not be reached. The rest of the site was built normally.',
      issues: [],
    };
  }
}

export const roadmapGroups = [
  { label: 'asset', title: 'Assets' },
  { label: 'use-case', title: 'Use cases' },
  { label: 'site-feature', title: 'Site features' },
] as const;
