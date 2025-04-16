"use client";
import { useEffect, useState } from "react";

interface NewsItem {
    title: string;
    link: string;
    summary: string;
}

export default function NewsList() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            const res = await fetch("/api/news");
            const data = await res.json();
            setNews(data.summaries);
            console.log(data.summaries);

            setLoading(false);
        }
        fetchNews();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🔍 AI News Summaries</h2>
            {loading ? <p>Loading...</p> :
                news.map((article, index) => (
                    <div key={index} className="p-4 border rounded-lg mb-4">
                        <a href={article.link} target="_blank" className="text-lg font-semibold text-blue-600">{article.title}</a>
                        <p className="mt-2 text-gray-700">{article.summary}</p>
                    </div>
                ))
            }
        </div>
    );
}
