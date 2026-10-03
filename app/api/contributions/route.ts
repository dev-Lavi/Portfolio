import { NextResponse } from "next/server";

export interface ContributionDay {
  date: string;
  count: number;
}

export const revalidate = 3600; // Cache on Next.js edge / server for 1 hour

async function fetchGitHubContributions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch("https://github-contributions-api.jogruber.de/v4/dev-Lavi", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub contributions API returned ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data.contributions)) {
      return data.contributions.map((item: { date: string; count: number }) => ({
        date: item.date,
        count: Number(item.count) || 0,
      }));
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch GitHub contributions:", err);
    return [];
  }
}

async function fetchLeetCodeSubmissions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: `query userProfileCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              streak
              totalActiveDays
              submissionCalendar
            }
          }
        }`,
        variables: { username: "Lavi10" },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`LeetCode API returned ${res.status}`);
    }

    const data = await res.json();
    const rawCalendar = data?.data?.matchedUser?.userCalendar?.submissionCalendar;
    if (rawCalendar && typeof rawCalendar === "string") {
      const parsed: Record<string, number> = JSON.parse(rawCalendar);
      const items: ContributionDay[] = Object.entries(parsed).map(([ts, count]) => {
        const d = new Date(parseInt(ts, 10) * 1000);
        return {
          date: d.toISOString().slice(0, 10),
          count: Number(count) || 0,
        };
      });
      items.sort((a, b) => a.date.localeCompare(b.date));
      return items;
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch LeetCode submissions:", err);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "all";

  try {
    if (source === "github") {
      const github = await fetchGitHubContributions();
      return NextResponse.json({ success: true, source: "github", data: github });
    }

    if (source === "leetcode") {
      const leetcode = await fetchLeetCodeSubmissions();
      return NextResponse.json({ success: true, source: "leetcode", data: leetcode });
    }

    // Default: fetch both in parallel
    const [github, leetcode] = await Promise.all([
      fetchGitHubContributions(),
      fetchLeetCodeSubmissions(),
    ]);

    return NextResponse.json({
      success: true,
      github,
      leetcode,
    });
  } catch (err) {
    console.error("Contributions route handler error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contribution data" },
      { status: 500 }
    );
  }
}
