import { Resend } from "resend";

const FROM = "GrowthHQ <noreply@growthhq.online>";
const BRAND_BLUE = "#2563EB";
const BRAND_DARK = "#1E3A8A";
const BRAND_LIGHT = "#EFF6FF";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY env var is not set");
  return new Resend(apiKey);
}

function emailShell(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GrowthHQ</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_DARK} 0%,${BRAND_BLUE} 100%);border-radius:16px 16px 0 0;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 10px;vertical-align:middle;">
                          <span style="font-size:18px;line-height:1;">⚡</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Growth<span style="opacity:0.75;">HQ</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
              ${body}

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">GrowthHQ · <a href="https://growthhq.online" style="color:${BRAND_BLUE};text-decoration:none;">growthhq.online</a></p>
                    <p style="margin:0;font-size:12px;color:#cbd5e1;">You're receiving this because you have an account at GrowthHQ.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,${BRAND_BLUE} 0%,${BRAND_DARK} 100%);color:#ffffff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;letter-spacing:0.1px;">${label} →</a>`;
}

function infoBox(content: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background:${BRAND_LIGHT};border-left:4px solid ${BRAND_BLUE};border-radius:8px;padding:16px 20px;">
        ${content}
      </td>
    </tr>
  </table>`;
}

// ─── Welcome email ──────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Welcome, ${name || "Growth Seeker"} ⚡
    </h1>
    <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.7;">
      You've just joined a community of leaders, entrepreneurs, and high performers who are serious about levelling up.
      Your AI growth coach is ready — take your first assessment and let's get started.
    </p>
    ${infoBox(`
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">Your next steps</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">🎯 &nbsp;Take a growth assessment</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">🧠 &nbsp;Start your first AI coaching session</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">📈 &nbsp;Set your first growth goal</p>
      <p style="margin:0;font-size:14px;color:#334155;">🔥 &nbsp;Build your first daily streak</p>
    `)}
    ${ctaButton("https://growthhq.online/assessments?welcome=1", "Begin your growth journey")}
  `;
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Your GrowthHQ journey starts now ⚡",
    html: emailShell(body),
  });
}

// ─── Team invite email ───────────────────────────────────────────────────────

export async function sendTeamInviteEmail(
  to: string, orgName: string, inviterName: string, tier: string, inviteUrl: string
) {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      You're invited to join ${orgName} 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.7;">
      <strong>${inviterName}</strong> has invited you to GrowthHQ with a <strong>${tierLabel} seat</strong> — fully paid by ${orgName}.
      You'll get AI coaching, skill assessments, and a personalised growth roadmap from day one.
    </p>
    ${infoBox(`
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">What's included in your ${tierLabel} seat</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">🧠 &nbsp;Unlimited AI coaching sessions</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">🎯 &nbsp;Full access to growth assessments</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;">📊 &nbsp;Personal progress dashboard</p>
      <p style="margin:0;font-size:14px;color:#334155;">🏆 &nbsp;XP, streaks &amp; leaderboard</p>
    `)}
    ${ctaButton(inviteUrl, "Accept invitation")}
    <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;">
      This invite is unique to you. If you weren't expecting it, you can safely ignore this email.
    </p>
  `;
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `${inviterName} invited you to GrowthHQ — ${orgName}`,
    html: emailShell(body),
  });
}

// ─── Newsletter confirmation ─────────────────────────────────────────────────

export async function sendNewsletterConfirmation(to: string) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      You're on the list 🔥
    </h1>
    <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.7;">
      Every week you'll get growth strategies, AI insights, and frameworks used by top performers.
      No fluff — just what actually moves the needle.
    </p>
    ${ctaButton("https://growthhq.online", "Explore GrowthHQ")}
  `;
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "You're on the GrowthHQ list 🎯",
    html: emailShell(body),
  });
}
