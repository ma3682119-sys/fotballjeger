"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, Dot, Card, Btn, Insight } from "@/components/ui";
import { INBOX } from "@/store/data";

export default function InboxApp() {
  const [inbox, setInbox] = useState(INBOX);
  const [gmailAuth, setGmailAuth] = useState(null);
  const [gmailInbox, setGmailInbox] = useState([]);
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(setGmailAuth).catch(() => {}); }, []);
  useEffect(() => { if (gmailAuth?.authenticated) fetch("/api/gmail/inbox").then(r => r.json()).then(d => d.messages && setGmailInbox(d.messages)).catch(() => {}); }, [gmailAuth]);

  const interested = inbox.filter(i => i.status === "green").length;
  const declined = inbox.filter(i => i.status === "red").length;
  const noReply = inbox.filter(i => i.status === "gray").length;
  const rate = inbox.length ? Math.round((inbox.filter(i => i.status !== "gray").length / inbox.length) * 100) : 0;

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>Inbox</h2>
      <p className="mb-4 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>{gmailAuth?.authenticated ? "GMAIL CONNECTED" : "DEMO MODE"}</p>

      <StatGrid stats={[
        { val: interested, label: "Interested", color: "var(--color-green)" },
        { val: declined, label: "Declined", color: "var(--color-red)" },
        { val: noReply, label: "No reply" },
        { val: `${rate}%`, label: "Response" },
      ]} />

      {!gmailAuth?.authenticated && gmailAuth?.authUrl && (
        <Card glow="purple" className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--color-text-primary)" }}>Connect Gmail</div>
              <div className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>Live email data</div>
            </div>
            <a href={gmailAuth.authUrl} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "var(--color-purple-dim)", color: "var(--color-purple)", border: "1px solid rgba(159,113,223,0.15)", textDecoration: "none" }}>Connect</a>
          </div>
        </Card>
      )}

      {gmailInbox.length > 0 && (<>
        <SectionLabel>Gmail — live</SectionLabel>
        <Card className="mb-3">
          {gmailInbox.map(msg => (
            <div key={msg.id} className="flex items-center gap-2 py-2 last:border-0" style={{ borderBottom: "1px solid var(--color-border-primary)" }}>
              <Dot type="green" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate" style={{ color: "var(--color-text-primary)" }}>{msg.subject}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--color-text-tertiary)" }}>{msg.from}</div>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>{msg.date}</span>
            </div>
          ))}
        </Card>
      </>)}

      <SectionLabel>Messages</SectionLabel>
      <Card>
        {inbox.map(item => (
          <div key={item.id}>
            <div className="flex items-center gap-2 py-2 cursor-pointer transition-colors" style={{ borderBottom: "1px solid var(--color-border-primary)", margin: "0 -16px", padding: "8px 16px" }}
              onClick={() => setOpen(open === item.id ? null : item.id)}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(242,223,203,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Dot type={item.status} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium" style={{ color: "var(--color-text-primary)" }}>{item.club}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--color-text-tertiary)" }}>{item.preview}</div>
              </div>
              <span className="shrink-0" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-tertiary)" }}>{item.date}</span>
              {item.status === "green" && <Btn variant="green" onClick={e => { e.stopPropagation(); setOpen(item.id); }}>Reply</Btn>}
              {item.status === "gray" && <Btn onClick={e => e.stopPropagation()}>Follow up</Btn>}
            </div>
            {open === item.id && (
              <div className="py-2" style={{ borderBottom: "1px solid var(--color-border-primary)" }}>
                {item.full && <div className="text-[12px] italic mb-2" style={{ color: "var(--color-text-secondary)", background: "rgba(242,223,203,0.02)", padding: 10, borderRadius: 6, borderLeft: "2px solid var(--color-green)" }}>&ldquo;{item.full}&rdquo;</div>}
                {item.status === "green" && (
                  <div>
                    <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type reply..." className="w-full min-h-[60px] mb-2 text-[12px]" />
                    <div className="flex gap-1"><Btn variant="green" onClick={() => { setReply(""); setOpen(null); }}>Send</Btn><Btn onClick={() => setOpen(null)}>Close</Btn></div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
