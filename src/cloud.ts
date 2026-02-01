import { getToken } from "./auth";
import type { Memo } from "./types";

const API_URL = "https://solaris-project.com/api/v1/memo";

export async function syncToCloud(memo: Memo): Promise<void> {
  const token = await getToken();

  if (!token) {
    console.error("Cloud sync: not authenticated. Run: bunx solaris auth login");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: memo.id,
        timestamp: memo.timestamp,
        content: memo.content,
      }),
    });

    if (!response.ok) {
      console.error(`Cloud sync failed: ${response.status}`);
    }
  } catch (error) {
    console.error(`Cloud sync error: ${error}`);
  }
}
