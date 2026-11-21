import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, FolderCode, GitBranch, Globe, KeyRound, MessageSquare, Rocket, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { brand } from "../../config/brand";
import { Notice } from "../../components/ui";

const flow = [
  { icon: MessageSquare, title: "Client asks for a change", text: "They send it from their own portal, tied to the right website." },
  { icon: FolderCode, title: "Your team edits the source", text: "HTML, CSS, JavaScript and more, saved separately from what is live." },
  { icon: GitBranch, title: "Changes are committed", text: "Every edit lands in the website's Git repository with history." },
  { icon: Rocket, title: "The site is published", text: "Deployment status is recorded, so everyone sees what is live." },
];

export function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.05] sm:text-6xl">{brand.tagline}</h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            {brand.name} lets a web agency run many client websites from one dashboard, and gives every client a secure portal for their own sites only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary btn-lg">Get started</Link>
            <Link to="/login" className="btn-secondary btn-lg">Client login</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <Link to="/features" className="font-medium text-brand-dark hover:underline">Explore features</Link>
            <Link to="/contact" className="font-medium text-brand-dark hover:underline">Contact us</Link>
          </div>
        </div>
        <ol className="card divide-y divide-ink/10 overflow-hidden">
          {flow.map((s, i) => (
            <li key={s.title} className="flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{i + 1}. {s.title}</p>
                <p className="mt-0.5 text-sm text-ink/60">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="max-w-xl text-3xl font-semibold">Built for agencies that look after other people's websites</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, t: "Clients and staff in one place", d: "Add clients, invite them by email link, and suspend access with one change." },
              { icon: Globe, t: "A record for every website", d: "Domain, live URL, hosting, repository and status for each site." },
              { icon: ShieldCheck, t: "Separation enforced by the database", d: "Clients can only read the websites assigned to them. Rules run in Supabase, not just in the browser." },
              { icon: KeyRound, t: "Roles that match your team", d: "Owner, admin, manager, developer, viewer and client, each with their own permissions." },
              { icon: MessageSquare, t: "Change requests, not email chains", d: "Clients describe what they need and you track it to done." },
              { icon: GitBranch, t: "Git-based publishing, step by step", d: "Source editing, GitHub and deployments are being added in stages." },
            ].map((f) => (
              <div key={f.t} className="card p-5">
                <f.icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 text-lg font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-ink/65">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold">Set up your agency in a few minutes</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/65">Create an account, name your agency, then add your first client and website.</p>
        <Link to="/register" className="btn-primary btn-lg mt-6">Get started</Link>
      </section>
    </>
  );
}

function Row({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-ink/65">{text}</p>
      </div>
    </li>
  );
}

export function Features() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold">Features</h1>
      <p className="mt-3 max-w-xl text-ink/70">What works today, and what is still being built. Nothing below is shown as live until it is.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Available now</h2>
          <ul className="mt-4 space-y-4">
            <Row icon={KeyRound} title="Secure sign in" text="Email and password, password reset and persistent sessions." />
            <Row icon={Users} title="Clients and team" text="Add clients, invite staff and clients, change roles, remove access." />
            <Row icon={Globe} title="Website records" text="Domain, live URL, hosting, repository details and status." />
            <Row icon={ShieldCheck} title="Row-level security" text="Clients see only the websites assigned to them." />
            <Row icon={MessageSquare} title="Client portal and change requests" text="Clients view their sites and send requests." />
            <Row icon={Check} title="Activity log" text="Key actions are recorded for your team." />
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold">In development</h2>
          <ul className="mt-4 space-y-4">
            <Row icon={FolderCode} title="File manager and code editor" text="Browse, edit and save website files with the Monaco editor." />
            <Row icon={GitBranch} title="GitHub integration" text="Agency-owned and client-owned repositories, commits and history." />
            <Row icon={Rocket} title="Publishing" text="GitHub Pages first, then other hosts, with real deployment history." />
          </ul>
        </div>
      </div>
    </div>
  );
}

const plans = [
  { name: "Starter", price: "Free", note: "During early access", items: ["Unlimited clients", "Website records", "Client portal", "Change requests"] },
  { name: "Agency", price: "Contact us", note: "For growing teams", items: ["Everything in Starter", "Team roles", "File manager and editor (when released)", "Priority support"] },
  { name: "Enterprise", price: "Contact us", note: "For large portfolios", items: ["Everything in Agency", "Custom branding", "GitHub and publishing integrations", "Onboarding help"] },
];

export function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold">Pricing</h1>
      <p className="mt-3 max-w-xl text-ink/70">{brand.name} is in early access. Final plans and prices will be announced before any charges begin.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className="card flex flex-col p-6">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-3 font-display text-3xl font-semibold">{p.price}</p>
            <p className="text-sm text-ink/60">{p.note}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{i}</li>
              ))}
            </ul>
            <Link to={p.price === "Free" ? "/register" : "/contact"} className={`${p.price === "Free" ? "btn-primary" : "btn-secondary"} mt-6`}>
              {p.price === "Free" ? "Get started" : "Contact us"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold">About {brand.name}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/75">
        <p>Agencies that build websites for many small businesses end up running a second business on the side: keeping track of who owns which site, where it is hosted, what changed and what the client asked for last week.</p>
        <p>{brand.name} puts that work in one place. Your team gets a dashboard for clients, websites and activity. Your clients get a simple portal that shows only their own sites and lets them ask for changes.</p>
        <p>It is built on Supabase for authentication and data, with access rules enforced in the database, so a client can never read another client's information.</p>
      </div>
      <Link to="/register" className="btn-primary btn-lg mt-8">Get started</Link>
    </div>
  );
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const to = brand.contactEmail;

  function submit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${brand.name} enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold">Contact us</h1>
      <p className="mt-3 text-ink/70">Tell us about your agency and what you want to manage.</p>
      {!to ? (
        <div className="mt-8">
          <Notice kind="info">The contact email is not configured yet. Set VITE_CONTACT_EMAIL in the hosting environment to turn this form on.</Notice>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          <div>
            <label className="label" htmlFor="c-name">Your name</label>
            <input id="c-name" className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="c-email">Email</label>
            <input id="c-email" type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="c-msg">Message</label>
            <textarea id="c-msg" className="input min-h-32" required value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className="btn-primary w-full" type="submit">Open in my email app</button>
          <p className="text-xs text-ink/50">This opens your email app with the message ready to send.</p>
        </form>
      )}
    </div>
  );
}
