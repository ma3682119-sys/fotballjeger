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
      <h2 className="text-base font-semibold mb-0.5">Inbox</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">{gmailAuth?.authenticated ? "GMAIL CONNECTED" : "DEMO MODE"}</p>

      <StatGrid stats={[
        { val: interested, label: "Interested", color: "var(--color-green)" },
        { val: declined, label: "Declined", color: "var(--color-red)" },
        { val: noReply, label: "No reply" },
        { val: `${rate}%`, label: "Response" },
      ]} />

      {!gmailAuth?.authenticated && gmailAuth?.authUrl && (
        <Card glow="purple" className="mb-3">
          <div className="flex items-center justify-between">
            <div><div className="text-[13px] font-medium">Connect Gmail</div><div className="text-[11px] text-txt2">Live email data</div></div>
            <a href={gmailAuth.authUrl} className="text-[11px] px-2.5 py-1 rounded-md bg-purple/10 text-purple border border-purple/15 no-underline font-[family-name:var(--font-mono)]">Connect</a>
          </div>
        </Card>
      )}

      {gmailInbox.length > 0 && (<>
        <SectionLabel>Gmail — live</SectionLabel>
        <Card className="mb-3">
          {gmailInbox.map(msg => (
            <div key={msg.id} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
              <Dot type="green" /><div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{msg.subject}</div><div className="text-[10px] text-txt3 truncate">{msg.from}</div></div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">{msg.date}</span>
            </div>
          ))}
        </Card>
      </>)}

      <SectionLabel>Messages</SectionLabel>
      <Card>
        {inbox.map(item => (
          <div key={item.id}>
            <div className="flex items-center gap-2 py-2 border-b border-border cursor-pointer hover:bg-white/[0.01] -mx-3.5 px-3.5 transition-colors" onClick={() => setOpen(open === item.id ? null : item.id)}>
              <Dot type={item.status} />
              <div className="flex-1 min-w-0"><div className="text-[12px] font-medium">{item.club}</div><div className="text-[10px] text-txt3 truncate">{item.preview}</div></div>
              <span className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 shrink-0">{item.date}</span>
              {item.status === "green" && <Btn variant="green" onClick={e => { e.stopPropagation(); setOpen(item.id); }}>Reply</Btn>}
              {item.status === "gray" && <Btn onClick={e => e.stopPropagation()}>Follow up</Btn>}
            </div>
            {open === item.id && (
              <div className="py-2 border-b border-border">
                {item.full && <div className="text-[12px] text-txt2 bg-white/[0.02] p-2.5 rounded-md mb-2 italic border-l-2 border-green/20">&ldquo;{item.full}&rdquo;</div>}
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
