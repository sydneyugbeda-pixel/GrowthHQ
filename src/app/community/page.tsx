"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Heart, MessageCircle, Share2, Trophy, Users, Flame, TrendingUp, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["All", "Leadership", "Communication", "Sales", "Wins", "Challenges", "Tips"];

const POSTS = [
  {
    id: 1, author: "Marcus T.", role: "VP of Sales", avatar: null, category: "Wins",
    content: "Just closed our biggest deal of the quarter — $2.3M ARR! The sales coaching in GrowthHQ completely transformed my discovery process. The AI roleplay sessions are worth every penny. 🎉",
    likes: 47, comments: 12, time: "2h ago", streak: 45,
  },
  {
    id: 2, author: "Sarah Chen", role: "Founder & CEO", avatar: null, category: "Tips",
    content: "Tip: The single most impactful communication habit I've developed is the 3-second pause before responding. It makes you look more confident AND helps you give better answers. Try it for one week.",
    likes: 83, comments: 24, time: "4h ago", streak: 30,
  },
  {
    id: 3, author: "David O.", role: "Senior Engineer", avatar: null, category: "Challenges",
    content: "Struggling with executive presence in our all-hands meetings. I know my content is solid but I always lose my composure when questioned. Anyone have tips or resources that helped?",
    likes: 31, comments: 18, time: "6h ago", streak: 12,
  },
  {
    id: 4, author: "Priya S.", role: "Marketing Director", avatar: null, category: "Leadership",
    content: "Weekly reflection: This week I practiced asking questions instead of giving answers. My team came up with solutions I never would have thought of. Leadership isn't about having all the answers — it's about asking better questions.",
    likes: 61, comments: 15, time: "1d ago", streak: 67,
  },
  {
    id: 5, author: "James R.", role: "Business Development", avatar: null, category: "Wins",
    content: "90 days on GrowthHQ. Before: struggled with cold outreach. Now: 34% reply rate on email sequences (3x my previous best). The communication assessment + AI coach combo is absolutely elite.",
    likes: 94, comments: 31, time: "2d ago", streak: 90,
  },
];

const LEADERBOARD = [
  { name: "James R.", xp: 12450, streak: 90, level: 11, rank: 1 },
  { name: "Priya S.", xp: 10230, streak: 67, level: 10, rank: 2 },
  { name: "Sarah C.", xp: 9870, streak: 30, level: 9, rank: 3 },
  { name: "Marcus T.", xp: 8900, streak: 45, level: 9, rank: 4 },
  { name: "You", xp: 4230, streak: 12, level: 5, rank: 47, isYou: true },
];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [posts, setPosts] = useState(POSTS);

  const handleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts((prev) => prev.filter((p) => p !== id));
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts((prev) => [...prev, id]);
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(), author: "You", role: "Growth Seeker", avatar: null, category: "All",
      content: newPost, likes: 0, comments: 0, time: "Just now", streak: 12,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost("");
    toast.success("Post shared with the community! 🎉");
  };

  const filtered = posts.filter((p) => activeCategory === "All" || p.category === activeCategory);

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
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {["Win 🏆", "Tip 💡", "Challenge 🤔"].map((tag) => (
                      <button key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900/20 transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                  <Button variant="gradient" size="sm" onClick={handlePost} disabled={!newPost.trim()} icon={<Plus className="w-4 h-4" />}>
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
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    {/* Author */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={post.author} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{post.author}</p>
                            {post.streak > 20 && (
                              <span className="text-orange-500 text-xs flex items-center gap-0.5">
                                <Flame className="w-3 h-3" />{post.streak}d
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{post.role} · {post.time}</p>
                        </div>
                      </div>
                      <Badge variant={post.category === "Wins" ? "green" : post.category === "Tips" ? "brand" : "default"}>
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "flex items-center gap-1.5 text-sm font-medium transition-colors",
                          likedPosts.includes(post.id) ? "text-red-500" : "text-slate-400 hover:text-red-500"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", likedPosts.includes(post.id) && "fill-red-500")} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium ml-auto">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
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
                  {LEADERBOARD.map((user) => (
                    <div
                      key={user.name}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-xl",
                        user.isYou && "bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-bold w-6 text-center",
                        user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-slate-500" : user.rank === 3 ? "text-orange-500" : "text-slate-400"
                      )}>
                        #{user.rank}
                      </span>
                      <Avatar name={user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {user.name} {user.isYou && "(You)"}
                        </p>
                        <p className="text-[10px] text-slate-400">Level {user.level} · {user.xp.toLocaleString()} XP</p>
                      </div>
                      <span className="text-xs text-orange-500 font-medium shrink-0">
                        🔥{user.streak}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active challenges */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Active Challenges</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "30-Day Communication Sprint", participants: 342, daysLeft: 18, joined: true },
                    { title: "Leadership Reading Challenge", participants: 187, daysLeft: 24, joined: false },
                    { title: "Daily AI Coaching Streak", participants: 891, daysLeft: 12, joined: true },
                  ].map((challenge, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{challenge.title}</p>
                        {challenge.joined && <Badge variant="green" size="sm">Joined</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {challenge.participants}</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                      {!challenge.joined && (
                        <Button variant="outline" size="sm" className="w-full justify-center mt-2">
                          Join Challenge
                        </Button>
                      )}
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
