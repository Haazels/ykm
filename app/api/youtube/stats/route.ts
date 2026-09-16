import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey =
    process.env.YOUTUBE_API_KEY ||
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const channelHandle =
    process.env.YOUTUBE_CHANNEL_HANDLE || "youknowme892";
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  // Baseline fallback stats if API key is not configured or fails
  const fallbackStats = {
    subscribers: 21400,
    views: 254000,
    videoCount: 45,
    isLiveApi: false,
    message: "Using baseline stats. Set YOUTUBE_API_KEY in .env to enable real-time YouTube Data API sync.",
  };

  if (!apiKey) {
    return NextResponse.json(fallbackStats);
  }

  try {
    let url = "";
    if (channelId) {
      url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
    } else {
      const cleanHandle = channelHandle.replace(/^@/, "");
      url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${cleanHandle}&key=${apiKey}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour to save API quota
    });

    if (!res.ok) {
      console.warn(`YouTube API error (${res.status}): returning baseline stats.`);
      return NextResponse.json(fallbackStats);
    }

    const data = await res.json();
    const channel = data?.items?.[0];

    if (!channel || !channel.statistics) {
      console.warn("YouTube channel not found or statistics hidden: returning baseline stats.");
      return NextResponse.json(fallbackStats);
    }

    const statistics = channel.statistics;
    const subscribers = parseInt(statistics.subscriberCount ?? "21400", 10);
    const views = parseInt(statistics.viewCount ?? "254000", 10);
    const videoCount = parseInt(statistics.videoCount ?? "45", 10);

    return NextResponse.json({
      subscribers,
      views,
      videoCount,
      isLiveApi: true,
    });
  } catch (err) {
    console.error("Failed to fetch YouTube channel statistics:", err);
    return NextResponse.json(fallbackStats);
  }
}
