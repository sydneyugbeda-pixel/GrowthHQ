"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { UserPlus, Users, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { TopBar } from "@/components/shared/TopBar";
import { InviteMemberModal } from "./InviteMemberModal";

interface OrgMember {
  id: string;
  email: string;
  role: string;
  subscription_tier: string;
  skill_focus: string[];
  status: string;
  invited_at: string;
  joined_at: string | null;
  users: { full_name: string | null; avatar_url: string | null; xp_points: number; streak_days: number } | null;
}

interface Props {
  org: { id: string; name: string; billing_email: string } | null;
  members: OrgMember[];
  currentUser: Record<string, unknown>;
}

function PaymentSuccessHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment confirmed! Invite email is on its way.");
      window.history.replaceState({}, "", "/team");
    }
  }, [searchParams]);
  return null;
}

export function TeamClient({ org, members: initialMembers, currentUser }: Props) {
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const active = members.filter((m) => m.status === "active");
  const pending = members.filter((m) => m.status === "pending");
  const proSeats = members.filter((m) => m.subscription_tier === "pro" && m.status !== "deactivated");
  const eliteSeats = members.filter((m) => m.subscription_tier === "elite" && m.status !== "deactivated");

  const refreshMembers = async () => {
    const res = await fetch("/api/enterprise/members");
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members);
    }
  };

  const handleDeactivate = async (memberId: string) => {
    setDeactivating(memberId);
    const res = await fetch(`/api/enterprise/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "deactivated" }),
    });
    if (res.ok) {
      toast.success("Member deactivated");
      await refreshMembers();
    } else {
      toast.error("Failed to deactivate member");
    }
    setDeactivating(null);
  };

  const statusBadge = (status: string) => {
    if (status === "active") return <Badge variant="green" size="sm" dot>Active</Badge>;
    if (status === "pending") return <Badge variant="yellow" size="sm" dot>Pending invite</Badge>;
    return <Badge variant="red" size="sm" dot>Deactivated</Badge>;
  };

  const tierBadge = (tier: string) => (
    <Badge variant={tier === "elite" ? "cyan" : "brand"} size="sm">
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </Badge>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Suspense fallback={null}>
        <PaymentSuccessHandler />
      </Suspense>

      <TopBar
        title={org?.name ?? "Team"}
        subtitle="Manage members and their development seats"
        actions={
          <Button variant="gradient" size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={() => setInviteOpen(true)}>
            Invite Member
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Seats" value={members.filter((m) => m.status !== "deactivated").length} icon={<Users className="w-5 h-5" />} />
          <StatCard title="Active Members" value={active.length} icon={<CheckCircle className="w-5 h-5" />} />
          <StatCard title="Pending Invites" value={pending.length} icon={<Clock className="w-5 h-5" />} />
          <StatCard title="Elite Seats" value={eliteSeats.length} icon={<XCircle className="w-5 h-5" />} />
        </div>

        {/* Member table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Team Members</h3>
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={refreshMembers}>
              Refresh
            </Button>
          </div>

          {members.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">No team members yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">Invite your first team member to get started.</p>
              <Button variant="gradient" size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={() => setInviteOpen(true)}>
                Invite First Member
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <Avatar
                    name={member.users?.full_name || member.email}
                    src={member.users?.avatar_url ?? undefined}
                    size="sm"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {member.users?.full_name || member.email}
                    </p>
                    {member.users?.full_name && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {tierBadge(member.subscription_tier)}
                    {statusBadge(member.status)}
                    {member.role === "owner" && <Badge variant="default" size="sm">Owner</Badge>}
                  </div>

                  {member.skill_focus?.length > 0 && (
                    <div className="hidden lg:flex gap-1 flex-wrap max-w-[200px]">
                      {member.skill_focus.slice(0, 2).map((f) => (
                        <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                          {f}
                        </span>
                      ))}
                      {member.skill_focus.length > 2 && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                          +{member.skill_focus.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {member.role !== "owner" && member.status !== "deactivated" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                      loading={deactivating === member.id}
                      onClick={() => handleDeactivate(member.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {org && (
        <InviteMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          orgId={org.id}
        />
      )}
    </div>
  );
}
