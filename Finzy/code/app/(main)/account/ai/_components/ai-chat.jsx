"use client";

import { useState, useRef, useEffect } from "react";
import { askAI } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, Trash2, Bot, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

const SUGGESTED_QUESTIONS = [
  "What did I spend the most on this month?",
  "What are my total expenses vs income?",
  "How much did I save last month?",
  "Which account has the most transactions?",
];

export default function AiChat({ accounts }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState("all");
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (customQuestion) => {
    const q = customQuestion || question;
    if (!q.trim() || loading) return;

    setError(null);

    const userMessage = { role: "user", text: q };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await askAI(q, account === "all" ? null : account);

      if (!response) throw new Error("No response received.");

      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg =
        err.message || "AI is currently unavailable. Please try again.";
      setError(errMsg);
      // Also add error as a chat bubble so context isn't lost
      setMessages((prev) => [...prev, { role: "error", text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Controls Row */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="h-11 rounded-xl border bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href={"/summary"}>
          <Button
            variant="ghost"
            className="h-10 px-1 gap-1.5 rounded-xl border text-sm text-muted-foreground hover:text-foreground font-normal hover:bg-transparent transition-colors active:scale-[0.98]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </Link>

        {messages.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="h-11 px-3 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-300 transition"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Chat Box */}
      <div className="h-[440px] overflow-y-auto rounded-2xl border bg-white/60 backdrop-blur-md shadow-lg p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">
                💬 Ask anything about your finances
              </p>
              <p className="text-gray-300 text-xs">Suggested questions:</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(q)}
                  className="text-xs px-3 py-2 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {(msg.role === "assistant" || msg.role === "error") && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mb-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-2xl text-sm max-w-[75%] shadow-sm whitespace-pre-wrap leading-relaxed
                ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm"
                    : msg.role === "error"
                      ? "bg-red-50 text-red-600 border border-red-200 rounded-bl-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mb-1">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error Banner (outside chat) */}
      {error && !loading && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border rounded-2xl p-2 shadow-sm">
        <Input
          placeholder="Ask something about your finances..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="border-none focus-visible:ring-0 bg-transparent text-sm"
        />

        <Button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="rounded-xl px-4 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Press Enter to send · Fina uses your real transaction data
      </p>
    </div>
  );
}