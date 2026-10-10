import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SAVÉRA" },
      { name: "description", content: "Get in touch with the SAVÉRA team." },
      { property: "og:title", content: "Contact SAVÉRA" },
      { property: "og:description", content: "Questions about sizing, orders or collaborations? Say hello." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    if (!String(f.get("name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !String(f.get("message")).trim()) {
      setErr("Please fill in your name, a valid email and a message.");
      return;
    }
    setErr("");
    setSent(true);
  };
  const field = "w-full border-b bg-transparent py-3 outline-none focus:border-foreground";
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-5 py-20 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-taupe">Contact</p>
        <h1 className="mt-4 text-5xl md:text-6xl">We'd love to hear from you.</h1>
        <div className="mt-10 space-y-2 text-muted-foreground">
          <p>Email: hello@[your-domain]</p>
          <p>Phone: +91 [phone number]</p>
          <p>Studio: [city, India]</p>
        </div>
      </div>
      {sent ? (
        <p className="self-center font-serif text-3xl italic" role="status">Thank you — your message is noted. (Demo form: nothing is sent yet.)</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-6">
          <label className="block"><span className="eyebrow">Name</span><input name="name" className={field} /></label>
          <label className="block"><span className="eyebrow">Email</span><input name="email" type="email" className={field} /></label>
          <label className="block"><span className="eyebrow">Message</span><textarea name="message" rows={5} className={field} /></label>
          {err && <p className="text-sm text-destructive" role="alert">{err}</p>}
          <button className="eyebrow bg-primary px-10 py-4 text-primary-foreground">Send message</button>
        </form>
      )}
    </div>
  );
}
