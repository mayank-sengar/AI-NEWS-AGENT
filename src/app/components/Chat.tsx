"use client";
import { SignIn, SignUp, UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { BotIcon, Send, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";

export default function Chat() {
    const { user, isSignedIn } = useUser();
    const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [showSignUp, setShowSignUp] = useState(false);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch messages when user logs in
    useEffect(() => {
        if (user) fetchMessages();
    }, [user]);

    // Real-time updates from Supabase
    useEffect(() => {
        if (!user) return;

        const subscription = supabase
            .channel("messages")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                setMessages((prev) => {
                    const exists = prev.some((msg) => msg.id === payload.new.id);
                    if (!exists) {
                        return [
                            ...prev,
                            {
                                id: payload.new.id,
                                role: payload.new.role,
                                content: payload.new.content,
                            },
                        ];
                    }
                    return prev;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    // Fetch user-specific messages from Supabase
    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", user?.id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages: ", error);
        } else {
            setMessages(data.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content
            })));
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        if (!user) {
            alert("Please sign in to chat.");
            return;
        }

        const newMessage = { id: crypto.randomUUID(), role: "user", content: input, user_id: user.id };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        await supabase.from("messages").insert([newMessage]);

        try {
            const res = await axios.post("/api/chat", { message: input });
            const aiMessage = {
                id: crypto.randomUUID(),
                role: "ai",
                content: res.data.reply,
                user_id: user.id,
            };
            setMessages((prev) => [...prev, aiMessage]);
            await supabase.from("messages").insert([aiMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            {/* Header */}
            <div className="p-4 text-center border-b border-gray-700">
                <h1 className="text-3xl font-bold text-center">📰 AI News Assistant</h1>
            </div>

            {!isSignedIn ? (
                <div className="text-center flex justify-center items-center mt-5">
                    {showSignUp ? <SignUp routing="hash" /> : <SignIn routing="hash" />}
                </div>
            ) : (
                <>
                    <div className="text-center flex justify-between px-4 py-2">
                        <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
                        {/* <UserButton afterSignOutUrl="/" /> */}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-16">
                        {messages.length === 0 ? (
                            <p className="text-gray-400 text-center">No messages yet. Start a conversation!</p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {msg.role === "ai" ?
                                        <div className="flex gap-2">
                                            <BotIcon className="w-10 h-10 text-gray-400" />
                                            <div className="p-3 rounded-lg max-w-full bg-gray-800 text-gray-200 m-2" >
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div> :
                                        <div className="flex gap-2">
                                            <div className="p-3 rounded-lg max-w-full bg-blue-500 text-white ">
                                                <span className="break-words" >
                                                    {msg.content}
                                                </span>
                                            </div>
                                            <UserButton />
                                        </div>
                                    }
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Box */}
                    <div className="p-4 border-gray-700 fixed bottom-0 w-full flex">
                        <div className="w-full max-w-4xl mx-auto flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 p-3 bg-gray-700 text-white rounded-lg outline-none w-full"
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                className="bg-blue-600 px-4 py-2 rounded-lg text-white flex items-center"
                                onClick={sendMessage}
                            >
                                <Send className="w-4 h-4 mr-1" /> Send
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
