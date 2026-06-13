"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Send, Plus, Mic, MicOff, Sparkles, ChevronRight,
  MoreHorizontal, Trash2, MessageSquare, RefreshCw, Copy
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { TopBar } from "@/components/shared/TopBar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const QUICK_PROMPTS = [
  { emoji: "🗣️", text: "Help me prepare for a difficult conversation" },
  { emoji: "🎯", text: "Create a 30-day leadership sprint for me" },
  { emoji: "📈", text: "Coach me on closing a sales deal" },
  { emoji: "🧘", text: "Give me a confidence-building exercise" },
  { emoji: "📝", text: "Review my goals and suggest next actions" },
  { emoji: "💡", text: "What should I focus on this week?" },
];

interface CoachClientProps {
  user: Record<string, unknown> | null;
  growthProfile: Record<string, unknown> | null;
  conversations: Record<string, unknown>[];
}

export function CoachClient({ user, growthProfile, conversations: initialConversations }: CoachClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const loadConversation = async (id: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("coach_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setConversationId(id);
    setMessages(data || []);
  };

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId,
          growthProfile,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
        // refresh conversation list
        const supabase = createClient();
        const { data: convs } = await supabase
          .from("coach_conversations")
          .select("id, title, created_at, updated_at")
          .eq("user_id", user?.id as string)
          .order("updated_at", { ascending: false })
          .limit(20);
        setConversations(convs || []);
      }
    } catch {
      toast.error("Failed to get AI response. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="AI Coach" subtitle="Atlas — your personal growth mentor" />

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation sidebar */}
        <AnimatePresence>
          {sidebarVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shrink-0 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <Button variant="primary" size="sm" className="w-full justify-center" icon={<Plus className="w-4 h-4" />} onClick={startNewConversation}>
                  New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id as string}
                    onClick={() => loadConversation(conv.id as string)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors",
                      conversationId === conv.id
                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{(conv.title as string) || "New conversation"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 ml-5.5">
                      {formatRelativeTime(conv.updated_at as string)}
                    </p>
                  </button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No conversations yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center gap-6">
                {/* Atlas intro */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/25 pulse-ring">
                    <Zap className="w-10 h-10 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Meet Atlas, your AI growth coach
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                      I know your goals, track your progress, and deliver expert coaching on
                      communication, leadership, sales, and more. What would you like to work on?
                    </p>
                  </div>
                </motion.div>

                {/* Quick prompts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg"
                >
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.text}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all group text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-xl shrink-0">{prompt.emoji}</span>
                      <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {prompt.text}
                      </span>
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-5">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
                    className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-brand-500/20">
                        <Zap className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    <div className="group relative max-w-[75%]">
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-brand-600 text-white rounded-br-sm"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-tl-sm shadow-sm"
                      )}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {/* Copy button on hover */}
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {msg.role === "user" && (
                      <Avatar name={user?.full_name as string} src={user?.avatar_url as string} size="sm" />
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className={`w-2 h-2 rounded-full bg-brand-400 typing-dot`} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 focus-within:border-brand-400 dark:focus-within:border-brand-600 transition-colors">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI coach anything..."
                  className="flex-1 border-none bg-transparent focus:ring-0 resize-none min-h-[40px] max-h-32 py-0 px-0 text-sm"
                  rows={1}
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-brand-600"
                    icon={<Sparkles className="w-4 h-4" />}
                    title="AI suggestions"
                  />
                  <Button
                    variant="primary"
                    size="icon"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    icon={loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">
                Atlas can make mistakes. For critical decisions, verify with domain experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
