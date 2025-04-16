import { NextResponse } from "next/server";
import Parser from "rss-parser";
import Groq from "groq-sdk";
import axios from "axios";

const parser = new Parser();
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
    apiKey: GROQ_API_KEY,
});

// Function to fetch latest news from an RSS feed
export async function GET() {
    try {
        const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml");
        const articles = feed.items.slice(0, 3);

        const summaries = await Promise.all(
            articles.map(async (article) => {
                const prompt = `Summarize this article in 3 bullet points:\n\nTitle: ${article.title}\nContent: ${article.contentSnippet}`

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
                }).then((chatCompletion) => {
                    return chatCompletion.choices[0]?.message?.content || "";
                });

                return {
                    title: article.title,
                    link: article.link,
                    summary: response,
                };
            })
        );
        return NextResponse.json({ summaries });
    } catch (error) {
        console.error("Error fetching news: ", error);
        return NextResponse.json({
            error: 'Failed to Fetch News',
            status: 500
        });
    }
}
