import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { CommunityClient } from "@/components/community/CommunityClient";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();

  const [postsRes, likedRes, leaderboardRes, currentUserRes] = await Promise.all([
    // Use admin client to join posts with user info (bypasses RLS on users table)
    admin.from("community_posts")
      .select("*, author:users!community_posts_user_id_fkey(id, full_name, avatar_url, streak_days, xp_points)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("post_likes").select("post_id").eq("user_id", user.id),
    admin.from("users").select("id, full_name, avatar_url, xp_points, streak_days").order("xp_points", { ascending: false }).limit(10),
    supabase.from("users").select("full_name, avatar_url, xp_points, streak_days").eq("id", user.id).single(),
  ]);

  const likedPostIds = new Set((likedRes.data || []).map((l: { post_id: string }) => l.post_id));

  // Find current user's leaderboard rank
  const { count: rankCount } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .gt("xp_points", currentUserRes.data?.xp_points ?? 0);

  const currentUserRank = (rankCount ?? 0) + 1;

  return (
    <CommunityClient
      userId={user.id}
      currentUser={{ ...currentUserRes.data, rank: currentUserRank }}
      initialPosts={postsRes.data || []}
      likedPostIds={Array.from(likedPostIds) as string[]}
      leaderboard={leaderboardRes.data || []}
    />
  );
}
