"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Heart, MessageCircle, Share2, Trophy, Users, Flame, TrendingUp, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    streak_days: number;
    xp_points: number;
  } | null;
};

type LeaderboardUser = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  xp_points: number;
  streak_days: number;
};

type CurrentUser = {
  full_name?: string;
  avatar_url?: string | null;
  xp_points?: number;
  streak_days?: number;
  rank: number;
};

interface Props {
  userId: string;
  currentUser: CurrentUser;
  initialPosts: Post[];
  likedPostIds: string[];
  leaderboard: LeaderboardUser[];
}

const CATEGORIES = ["All", "Leadership", "Communication", "Sales", "Wins", "Challenges", "Tips"];

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export function CommunityClient({ userId, currentUser, initialPosts, likedPostIds, leaderboard }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [liked, setLiked] = useState<Set<string>>(new Set(likedPostIds));
  const [activeCategory, setActiveCategory] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [newCategory, setNewCategory] = useState("All");
  const [posting, setPosting] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);

  const supabase = createClient();

  const handleLike = async (postId: string) => {
    if (likingId) return;
    setLikingId(postId);
    const isLiked = liked.has(postId);

    // Optimistic update
    setLiked((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p));

    if (isLiked) {
      await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
      await supabase.from("community_posts").update({ likes: posts.find(p => p.id === postId)!.likes - 1 }).eq("id", postId);
    } else {
      await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
      await supabase.from("community_posts").update({ likes: posts.find(p => p.id === postId)!.likes + 1 }).eq("id", postId);
    }
    setLikingId(null);
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    const category = newCategory === "All" ? "general" : newCategory;
    const { data, error } = await supabase
      .from("community_posts")
      .insert({ user_id: userId, content: newPost.trim(), category })
      .select()
      .single();

    if (error) {
      toast.error("Failed to post");
    } else {
      const newEntry: Post = {
        ...data,
        author: {
          id: userId,
          full_name: currentUser.full_name || "You",
          avatar_url: currentUser.avatar_url || null,
          streak_days: currentUser.streak_days || 0,
          xp_points: currentUser.xp_points || 0,
        },
      };
      setPosts((prev) => [newEntry, ...prev]);
      setNewPost("");
      setNewCategory("All");
      toast.success("Posted to the community! 🎉");
    }
    setPosting(false);
  };

  const filtered = posts.filter((p) => activeCategory === "All" || p.category === activeCategory || p.category === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Community" subtitle="Connect, share, and grow together" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main feed */}
            <div className="lg:col-span-2 space-y-5">

              {/* New post */}
              <Card>
                <Textarea
                  placeholder="Share a win, insight, or ask the community for help..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {["Wins", "Tips", "Challenges", "Leadership", "Communication", "Sales"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setNewCategory(tag)}
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full transition-colors",
                          newCategory === tag
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/20"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <Button variant="gradient" size="sm" onClick={handlePost} loading={posting} disabled={!newPost.trim()} icon={<Plus className="w-4 h-4" />}>
                    Post
                  </Button>
                </div>
              </Card>

              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      activeCategory === cat
                        ? "bg-brand-600 text-white"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {filtered.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-2xl mb-2">🌱</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No posts yet</p>
                  <p className="text-sm text-slate-500">Be the first to share something with the community</p>
                </Card>
              ) : (
                filtered.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={post.author?.full_name || "?"} size="md" src={post.author?.avatar_url || undefined} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                {post.author?.full_name || "Member"}
                                {post.author?.id === userId && <span className="text-slate-400 font-normal"> (You)</span>}
                              </p>
                              {(post.author?.streak_days ?? 0) > 7 && (
                                <span className="text-orange-500 text-xs flex items-center gap-0.5">
                                  <Flame className="w-3 h-3" />{post.author?.streak_days}d
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
                          </div>
                        </div>
                        <Badge variant={post.category === "Wins" ? "green" : post.category === "Tips" ? "brand" : "default"}>
                          {post.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.content}</p>

                      <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleLike(post.id)}
                          disabled={likingId === post.id}
                          className={cn(
                            "flex items-center gap-1.5 text-sm font-medium transition-colors",
                            liked.has(post.id) ? "text-red-500" : "text-slate-400 hover:text-red-500"
                          )}
                        >
                          {likingId === post.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Heart className={cn("w-4 h-4", liked.has(post.id) && "fill-red-500")} />}
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                        <button
                          onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium ml-auto"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Leaderboard */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Top Growers</h3>
                </div>
                <div className="space-y-3">
                  {leaderboard.map((u, i) => {
                    const rank = i + 1;
                    const isYou = u.id === userId;
                    return (
                      <div key={u.id} className={cn("flex items-center gap-3 p-2.5 rounded-xl", isYou && "bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40")}>
                        <span className={cn("text-sm font-bold w-6 text-center", rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-500" : rank === 3 ? "text-orange-500" : "text-slate-400")}>#{rank}</span>
                        <Avatar name={u.full_name} size="sm" src={u.avatar_url || undefined} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{u.full_name}{isYou && " (You)"}</p>
                          <p className="text-[10px] text-slate-400">{u.xp_points.toLocaleString()} XP</p>
                        </div>
                        {u.streak_days > 0 && <span className="text-xs text-orange-500 font-medium shrink-0">🔥{u.streak_days}</span>}
                      </div>
                    );
                  })}
                  {/* Show current user if not in top 10 */}
                  {!leaderboard.find(u => u.id === userId) && currentUser.full_name && (
                    <>
                      <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-2" />
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40">
                        <span className="text-sm font-bold w-6 text-center text-slate-400">#{currentUser.rank}</span>
                        <Avatar name={currentUser.full_name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.full_name} (You)</p>
                          <p className="text-[10px] text-slate-400">{(currentUser.xp_points || 0).toLocaleString()} XP</p>
                        </div>
                        {(currentUser.streak_days || 0) > 0 && <span className="text-xs text-orange-500 font-medium shrink-0">🔥{currentUser.streak_days}</span>}
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Community stats */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Community</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: <Users className="w-4 h-4" />, label: "Members", value: leaderboard.length > 0 ? `${leaderboard.length}+` : "0" },
                    { icon: <MessageCircle className="w-4 h-4" />, label: "Posts", value: String(posts.length) },
                    { icon: <Heart className="w-4 h-4" />, label: "Total Likes", value: posts.reduce((s, p) => s + p.likes, 0).toString() },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400">{stat.icon}</span>
                      <span className="text-slate-600 dark:text-slate-400 flex-1">{stat.label}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
