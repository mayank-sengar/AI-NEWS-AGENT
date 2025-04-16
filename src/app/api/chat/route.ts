import { NextResponse } from "next/server";
import Parser from "rss-parser";
import Groq from "groq-sdk";
import { JSDOM } from "jsdom";


const parser = new Parser();
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
    apiKey: GROQ_API_KEY,
});

// Function to fetch latest news from an RSS feed
export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        let articles: any[] = [];

        // Check if message contains a URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlMatch = message.match(urlRegex);

        if (urlMatch) {
            const articleUrl = urlMatch[0];

            // Fetch article content
            const articleRes = await fetch(articleUrl);
            const articleText = await articleRes.text();

            // Extract meaningful text using JSDOM
            const dom = new JSDOM(articleText);
            const document = dom.window.document;

            // Extract visible text from all paragraphs
            const paragraphs = Array.from(document.querySelectorAll("p"));
            const articleContent = paragraphs.map(p => p.textContent?.trim()).filter(text => text).join(" ");

            if (!articleContent || articleContent.length < 50) {
                return NextResponse.json({ reply: "I couldn't extract meaningful content from this URL. Try another article link." });
            }

            // Summarize using Groq
            const summaryResponse = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Summarize the given article in a short and clear way."
                    },
                    {
                        role: "user",
                        content: articleContent
                    },
                ],
                model: "llama3-70b-8192"
            });

            const summaryData = await summaryResponse;
            return NextResponse.json({
                reply: summaryData?.choices[0]?.message?.content || "Couldn't summarize this article."
            });
        }

        // If user asks for latest news, fetch it
        if (message.toLowerCase().includes("latest news")) {
            const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml");
            articles = feed.items.slice(0, 3);
        }

        // Construct AI prompt
        let prompt = `User: ${message}\nAI:`;
        if (articles.length > 0) {
            prompt += "\nHere are the top news articles:\n" +
                articles.map((a, i) => `${i + 1}. ${a.title} - ${a.link}`).join("\n");
        }

        // Call Groq Cloud API 
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
        });

        return NextResponse.json({ reply: response?.choices[0]?.message?.content });
    } catch (error) {
        console.error("Error fetching news: ", error);
        return NextResponse.json({
            error: 'Failed to Fetch News',
            status: 500
        });
    }
}
