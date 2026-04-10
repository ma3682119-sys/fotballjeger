"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, PageTitle, Dot, Card, Badge, Insight } from "@/components/ui";
import { INBOX } from "@/store/data";

export default function InboxPage() {
  const [inbox, setInbox] = useState(INBOX);
  const [gmailInbox, setGmailInbox] = useState([]);
  const [gmailAuth, setGmailAuth] = useState(null);
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Check Gmail auth status
    fetch("/api/auth").then(r => r.json()).then(d => setGmailAuth(d)).catch(() => {});
  }, []);

  useEffect(() => {
    if (gmailAuth?.authenticated) {
      fetch("/api/gmail/inbox").then(r => r.json()).then(d => {
        if (d.messages) setGmailInbox(d.messages);
      }).catch(() => {});
    }
  }, [gmailAuth]);

  const interested = inbox.filter(i => i.status === "green").length;
  const declined = inbox.filter(i => i.status === "red").length;
  const noReply = inbox.filter(i => i.status === "gray").length;
  const responseRate = inbox.length ? Math.round((inbox.filter(i => i.status !== "gray").length / inbox.length) * 100) : 0;

  const handleSendReply = async (item) => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `${item.club.toLowerCase().replace(/\s/g, "")}@example.com`,
          subject: `Re: ${item.club} — Trial inquiry`,
          body: reply,
        }),
      });
      setReply("");
      setOpen(null);
    } catch {
      // silent
    }
    setSending(false);
  };

  return (
    <div>
      <PageTitle sub={gmailAuth?.authenticated ? "GMAIL CONNECTED · LIVE DATA" : "DEMO MODE · CONNECT GMAIL FOR LIVE DATA"}>
        Inbox
      </PageTitle>

      <StatGrid stats={[
        { val: interested, label: "Interested", color: "var(--color-green)" },
        { val: declined, label: "Declined", color: "var(--color-red)" },
        { val: noReply, label: "No reply", color: "var(--color-txt3)" },
        { val: `${responseRate}%`, label: "Response rate" },
      ]} />

      {/* Gmail connection banner */}
      {!gmailAuth?.authenticated && gmailAuth?.authUrl && (
        <Card glow="purple" className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">Connect Gmail</div>
              <div className="text-xs text-txt2">Link your Gmail to send real emails and receive live replies</div>
            </div>
            <a
              href={gmailAuth.authUrl}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-purple-dim text-purple border border-purple/25 hover:bg-purple/20 transition font-[family-name:var(--font-mono)] no-underline"
            >
              CONNECT GMAIL
            </a>
          </div>
        </Card>
      )}

      {gmailAuth?.authenticated && (
        <Insight type="green" className="mb-4">Gmail connected. Showing live email data alongside local inbox.</Insight>
      )}

      {/* Gmail messages */}
      {gmailInbox.length > 0 && (
        <>
          <SectionLabel>Gmail — live messages</SectionLabel>
          <Card className="mb-4">
            {gmailInbox.map(msg => (
              <div key={msg.id} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                <Dot type="green" />
                <div className="flex-1 min-w-0">
                  <div className="font-[family-name:var(--font-display)] text-[13px] font-medium truncate">{msg.subject}</div>
                  <div className="text-[11px] text-txt2 truncate">{msg.from}</div>
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 shrink-0">{msg.date}</div>
              </div>
            ))}
          </Card>
        </>
      )}

      <SectionLabel>Local inbox</SectionLabel>
      <Card>
        {inbox.map(item => (
          <div key={item.id}>
            <div
              className="flex items-center gap-3 py-3 border-b border-border cursor-pointer hover:bg-bg3/30 transition -mx-4 px-4"
              onClick={() => setOpen(open === item.id ? null : item.id)}
            >
              <Dot type={item.status} />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{item.club}</div>
                <div className="text-[11px] text-txt2 truncate">{item.preview}</div>
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 shrink-0 mr-2">{item.date}</div>
              {item.status === "green" && (
                <button
                  className="text-[11px] px-3 py-1 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition shrink-0 font-[family-name:var(--font-mono)]"
                  onClick={e => { e.stopPropagation(); setOpen(item.id); }}
                >
                  REPLY
                </button>
              )}
              {item.status === "red" && (
                <button
                  className="text-[11px] px-3 py-1 rounded-lg border border-border2 text-txt2 hover:bg-bg3 transition shrink-0 font-[family-name:var(--font-mono)]"
                  onClick={e => { e.stopPropagation(); setInbox(prev => prev.filter(i => i.id !== item.id)); }}
                >
                  ARCHIVE
                </button>
              )}
              {item.status === "gray" && (
                <button className="text-[11px] px-3 py-1 rounded-lg border border-border2 text-txt2 hover:bg-bg3 transition shrink-0 font-[family-name:var(--font-mono)]">
                  FOLLOW UP
                </button>
              )}
            </div>

            {open === item.id && (
              <div className="py-3 border-b border-border">
                {item.full && (
                  <div className="text-[13px] text-txt2 leading-relaxed bg-bg3 p-3 rounded-lg mb-2.5 italic border-l-2 border-green/30">
                    <span className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 uppercase tracking-wider not-italic block mb-1">&gt; MESSAGE</span>
                    &ldquo;{item.full}&rdquo;
                  </div>
                )}
                {item.status === "green" && (
                  <div>
                    <textarea
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full min-h-[80px] mb-2"
                    />
                    <div className="flex gap-1.5">
                      <button
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]"
                        onClick={() => handleSendReply(item)}
                        disabled={sending}
                      >
                        {sending ? "SENDING..." : "SEND REPLY"}
                      </button>
                      <button
                        className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 transition font-[family-name:var(--font-mono)]"
                        onClick={() => setOpen(null)}
                      >
                        CLOSE
                      </button>
                    </div>
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
