import { NextResponse } from "next/server";
import Parser from "rss-parser";
import Groq from "groq-sdk";
import { JSDOM } from "jsdom";

const parser: Parser = new Parser();
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// Utility: Filter articles published today (UTC)
function filterTodayArticles(items: Parser.Item[]) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  return items.filter((item) => {
    const pub = new Date(item.pubDate || "");
    return pub >= start && pub <= end;
  });
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    let articles: Parser.Item[] = [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatch = message.match(urlRegex);

    if (urlMatch) {
      const articleUrl = urlMatch[0];

      const articleRes = await fetch(articleUrl);
      const articleText = await articleRes.text();

      const dom = new JSDOM(articleText);
      const document = dom.window.document;

      const paragraphs = Array.from(document.querySelectorAll("p"));
      const articleContent = paragraphs
        .map((p) => p.textContent?.trim())
        .filter((text) => text)
        .join(" ");

      if (!articleContent || articleContent.length < 50) {
        return NextResponse.json({
          reply: "I couldn't extract meaningful content from this URL. Try another article link.",
        });
      }

      const summaryResponse = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Summarize the given article in a short and clear way.",
          },
          {
            role: "user",
            content: articleContent,
          },
        ],
        model: "llama3-70b-8192",
      });

      return NextResponse.json({
        reply:
          summaryResponse?.choices[0]?.message?.content ||
          "Couldn't summarize this article.",
      });
    }

    if (message.toLowerCase().includes("latest news")) {
      const res = await fetch("https://news.google.com/rss", {
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      const xml = await res.text();
      const feed = await parser.parseString(xml);

      const todayArticles = filterTodayArticles((feed.items || []) as Parser.Item[]);
      articles = todayArticles.slice(0, 3);
    }

    let prompt = `User: ${message}\nAI:`;
    if (articles.length > 0) {
      prompt += "\nHere are the top news articles today:\n" +
        articles.map((a, i) => `${i + 1}. ${a.title} - ${a.link}`).join("\n");
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
    });

    return NextResponse.json({
      reply: response?.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Error fetching news: ", error);
    return NextResponse.json({
      error: "Failed to Fetch News",
      status: 500,
    });
  }
}
