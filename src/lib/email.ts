import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "GrowthHQ <noreply@growthhq.online>";

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to GrowthHQ 🚀",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1e293b;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #2563eb;">Growth<span style="color: #1e293b;">HQ</span></span>
        </div>

        <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 12px;">Welcome, ${name || "Growth Seeker"} ⚡</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          You've just joined a community of leaders, entrepreneurs, and high performers who are serious about growth.
          Your AI coach is ready — let's build something remarkable.
        </p>

        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <p style="font-weight: 600; margin: 0 0 12px; font-size: 14px; color: #0f172a;">Your next steps:</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">✅ &nbsp;Complete your growth profile</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">🧠 &nbsp;Start your first AI coaching session</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #475569;">🎯 &nbsp;Take a skill assessment</p>
          <p style="margin: 0; font-size: 14px; color: #475569;">📈 &nbsp;Track your first habit</p>
        </div>

        <a href="https://growthhq.online/dashboard"
           style="display: inline-block; background: #2563eb; color: white; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none;">
          Go to Dashboard →
        </a>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0 20px;" />
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          You're receiving this because you signed up at growthhq.online.
          <a href="https://growthhq.online" style="color: #2563eb;">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}

export async function sendNewsletterConfirmation(to: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "You're on the GrowthHQ list 🎯",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1e293b;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #2563eb;">Growth<span style="color: #1e293b;">HQ</span></span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px;">You're in! 🔥</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          Every week you'll get growth tips, AI insights, and frameworks used by top performers.
          No fluff — just what moves the needle.
        </p>

        <a href="https://growthhq.online"
           style="display: inline-block; background: #2563eb; color: white; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none;">
          Explore GrowthHQ →
        </a>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0 20px;" />
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          You subscribed at growthhq.online.
          <a href="https://growthhq.online" style="color: #2563eb;">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}
