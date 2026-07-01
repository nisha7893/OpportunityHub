"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Opportunity = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
  salary: string;
  applicationLink: string;
  deadline: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("out"), 1400);
    const t3 = setTimeout(() => onDone(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0d1f1e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.5s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#2dd4bf",
          opacity: phase === "hold" || phase === "out" ? 0.15 : 0,
          filter: "blur(24px)",
          transition: "opacity 0.6s ease",
        }} />
        <svg
          width="96"
          height="96"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: phase === "in" ? "scale(0.3)" : "scale(1)",
            opacity: phase === "in" ? 0 : 1,
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease",
          }}
        >
          <circle cx="32" cy="32" r="30" fill="#134e4a" />
          <circle cx="32" cy="32" r="30" fill="none" stroke="#2dd4bf" strokeWidth="2" />
          <path d="M 32 12 L 43 32 L 32 52 L 21 32 Z" fill="#2dd4bf" />
          <path d="M 32 12 L 43 32 L 32 32 Z" fill="#5eead4" />
          <circle cx="32" cy="32" r="4" fill="#0f172a" />
        </svg>
      </div>
      <p style={{
        color: "#ffffff",
        fontSize: "22px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        opacity: phase === "in" ? 0 : 1,
        transform: phase === "in" ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
        fontFamily: "sans-serif",
      }}>
        Opportunity<span style={{ color: "#2dd4bf" }}>Hub</span>
      </p>
    </div>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#134e4a" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#2dd4bf" strokeWidth="2" />
      <path d="M 32 12 L 43 32 L 32 52 L 21 32 Z" fill="#2dd4bf" />
      <path d="M 32 12 L 43 32 L 32 32 Z" fill="#5eead4" />
      <circle cx="32" cy="32" r="4" fill="#0f172a" />
    </svg>
  );
}

function handleStop(e: React.MouseEvent) {
  e.stopPropagation();
}

function ApplyButton({ href, dark }: { href: string; dark: boolean }) {
  const color = dark ? "#2dd4bf" : "#0f766e";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleStop} style={{ color: color }} className="text-sm font-semibold hover:underline">View and apply</a>
  );
}

function SaveButton({ jobId, dark, isLoggedIn, savedIds, onToggle }: { jobId: string; dark: boolean; isLoggedIn: boolean; savedIds: string[]; onToggle: (id: string) => void }) {
  const isSaved = savedIds.includes(jobId);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) { alert("Please log in to save jobs."); return; }
    onToggle(jobId);
  };
  return (
    <button onClick={handleClick} style={{ color: isSaved ? "#f59e0b" : dark ? "#6b7280" : "#9ca3af" }} className="text-lg leading-none" title={isSaved ? "Unsave" : "Save"}>
      {isSaved ? "★" : "☆"}
    </button>
  );
}

function Modal({ opp, onClose, dark }: { opp: Opportunity; onClose: () => void; dark: boolean }) {
  const deadline = new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const cardBg = dark ? "#1c1f26" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#0f172a";
  const textSub = dark ? "#9ca3af" : "#4b5563";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div style={{ backgroundColor: cardBg, color: textMain }} className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span style={{ backgroundColor: opp.type === "Internship" ? "#99f6e4" : "#fde68a", color: opp.type === "Internship" ? "#0f766e" : "#92400e" }} className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full">{opp.type}</span>
            <h2 style={{ color: textMain }} className="text-xl font-bold mt-2">{opp.title}</h2>
            <p style={{ color: textSub }} className="text-base font-semibold">{opp.company}</p>
          </div>
          <button onClick={onClose} style={{ color: textSub }} className="text-2xl font-bold leading-none">x</button>
        </div>
        <div style={{ color: textSub }} className="flex flex-col gap-2 text-sm">
          <p>Location: {opp.location}</p>
          <p>Salary: {opp.salary}</p>
          <p>Deadline: {deadline}</p>
        </div>
        {opp.skills.length > 0 && (
          <div>
            <p style={{ color: textMain }} className="text-sm font-semibold mb-2">Skills Required:</p>
            <div className="flex flex-wrap gap-2">
              {opp.skills.map((skill) => (
                <span key={skill} style={{ backgroundColor: dark ? "#272b33" : "#f3f4f6", color: textSub }} className="text-xs px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        )}
        <div>
          <p style={{ color: textMain }} className="text-sm font-semibold mb-2">About this role:</p>
          <p style={{ color: textSub }} className="text-sm leading-relaxed">{opp.description.replace(/<[^>]*>/g, "").substring(0, 500)}{opp.description.length > 500 ? "..." : ""}</p>
        </div>
        <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: dark ? "#2dd4bf" : "#0f766e" }} className="mt-2 text-center text-white font-semibold py-3 rounded-xl">Apply Now</a>
      </div>
    </div>
  );
}

function JobCard({ opp, onClick, dark, isLoggedIn, savedIds, onToggleSave }: { opp: Opportunity; onClick: () => void; dark: boolean; isLoggedIn: boolean; savedIds: string[]; onToggleSave: (id: string) => void }) {
  const isInternship = opp.type === "Internship";
  const cardBg = dark ? "#1c1f26" : "#ffffff";
  const border = dark ? "#2a2e37" : "#e5e7eb";
  const textMain = dark ? "#ffffff" : "#0f172a";
  const textSub = dark ? "#9ca3af" : "#6b7280";
  const initial = opp.company ? opp.company.charAt(0).toUpperCase() : "?";
  return (
    <div onClick={onClick} style={{ backgroundColor: cardBg, borderColor: border }} className="border rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between">
        <span style={{ backgroundColor: isInternship ? (dark ? "#0f3a36" : "#ccfbf1") : (dark ? "#3a2e0f" : "#fef3c7"), color: isInternship ? "#2dd4bf" : "#f59e0b" }} className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full">{opp.type}</span>
        <div className="flex items-center gap-2">
          <SaveButton jobId={opp._id} dark={dark} isLoggedIn={isLoggedIn} savedIds={savedIds} onToggle={onToggleSave} />
          <span style={{ backgroundColor: dark ? "#272b33" : "#f3f4f6", color: textSub }} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">{initial}</span>
        </div>
      </div>
      <h3 style={{ color: textMain }} className="text-base font-bold leading-snug">{opp.title}</h3>
      <p style={{ color: textSub }} className="text-sm">{opp.company} · {opp.location}</p>
      <ApplyButton href={opp.applicationLink} dark={dark} />
    </div>
  );
}

function CardSkeleton({ dark }: { dark: boolean }) {
  const cardBg = dark ? "#1c1f26" : "#ffffff";
  const border = dark ? "#2a2e37" : "#e5e7eb";
  const skeleton = dark ? "#2a2e37" : "#e5e7eb";
  return (
    <div style={{ backgroundColor: cardBg, borderColor: border }} className="border rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div style={{ backgroundColor: skeleton }} className="h-5 w-20 rounded-full"></div>
      <div style={{ backgroundColor: skeleton }} className="h-4 w-3/4 rounded"></div>
      <div style={{ backgroundColor: skeleton }} className="h-3 w-1/2 rounded"></div>
      <div style={{ backgroundColor: skeleton }} className="h-3 w-1/3 rounded"></div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const ids = data.user.savedJobs.map((j: any) => (typeof j === "string" ? j : j._id));
          setSavedIds(ids);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (typeFilter) params.append("type", typeFilter);
    setLoading(true);
    fetch(`${API}/api/opportunities?` + params.toString())
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOpportunities(data.data);
        else setError("Failed to load opportunities");
      })
      .catch(() => setError("Could not connect to server"))
      .finally(() => setLoading(false));
  }, [search, typeFilter]);

  const handleToggleSave = async (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSavedIds((prev) => prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
    try {
      await fetch(`${API}/api/opportunities/${jobId}/save`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    } catch {
      setSavedIds((prev) => prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSavedIds([]);
  };

  const bg = darkMode ? "#0d0f13" : "#ecfdf8";
  const headerBg = darkMode ? "#0d0f13" : "#ffffff";
  const headerBorder = darkMode ? "#1c1f26" : "#e5e7eb";
  const textMain = darkMode ? "#ffffff" : "#0f172a";
  const textSub = darkMode ? "#9ca3af" : "#475569";
  const accent = "#2dd4bf";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div style={{ backgroundColor: bg, minHeight: "100vh" }}>
        <header style={{ backgroundColor: headerBg, borderColor: headerBorder }} className="border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
              <h1 style={{ color: textMain }} className="text-xl font-bold">Opportunity<span style={{ color: accent }}>Hub</span></h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span style={{ color: textSub }} className="text-sm hidden sm:inline">Hi, {user.name}</span>
                  <button onClick={handleLogout} style={{ backgroundColor: darkMode ? "#1c1f26" : "#f3f4f6", color: textMain, borderColor: darkMode ? "#2a2e37" : "#e5e7eb" }} className="px-4 py-2 rounded-full text-sm font-semibold border">Log out</button>
                </>
              ) : (
                <button onClick={() => router.push("/login")} style={{ backgroundColor: "#0f766e" }} className="px-4 py-2 rounded-full text-sm font-semibold text-white">Log in</button>
              )}
              <button onClick={() => setDarkMode(!darkMode)} style={{ backgroundColor: darkMode ? "#1c1f26" : "#0f172a", color: darkMode ? accent : "#ffffff" }} className="px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-transform">
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <h2 style={{ color: textMain }} className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">Got potential?<br />Meet opportunity.</h2>
              <p style={{ color: textSub }} className="text-base mb-6">Internships and jobs from top companies, synced automatically every 6 hours.</p>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 mb-3">
                <input type="text" placeholder="Search by title or company..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ backgroundColor: darkMode ? "#1c1f26" : "#ffffff", borderColor: darkMode ? "#2a2e37" : "#d1d5db", color: textMain }} className="flex-1 border rounded-full px-5 py-3 text-sm outline-none" />
                <button type="submit" style={{ backgroundColor: "#0f766e" }} className="text-white font-semibold px-6 py-3 rounded-full text-sm whitespace-nowrap">Search</button>
              </form>
              <p style={{ color: textSub }} className="text-xs">Popular: Software Intern, Data Analyst, SDE</p>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white/20">
                <img src="/hero-student.jpg" alt="Student using laptop" className="w-full h-full object-cover" />
              </div>
              <span style={{ backgroundColor: darkMode ? "#1c1f26" : "#ffffff", color: textMain }} className="absolute -top-2 right-2 sm:right-0 text-xs font-semibold px-3 py-1.5 rounded-full shadow">{opportunities.length} live roles</span>
              <span style={{ backgroundColor: darkMode ? "#1c1f26" : "#ffffff", color: accent }} className="absolute bottom-4 -left-2 sm:left-4 text-xs font-semibold px-3 py-1.5 rounded-full shadow">Synced 2h ago</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            <div style={{ backgroundColor: darkMode ? "#0f3a36" : "#ccfbf1" }} className="rounded-2xl p-6 flex flex-col gap-3">
              <h3 style={{ color: darkMode ? "#ffffff" : "#134e4a" }} className="text-xl font-bold">Internships</h3>
              <p style={{ color: darkMode ? "#5eead4" : "#0f766e" }} className="text-sm">Find roles for students and recent graduates.</p>
              <button onClick={() => setTypeFilter("Internship")} style={{ backgroundColor: "#0f766e" }} className="w-fit text-white text-sm font-semibold px-5 py-2.5 rounded-full mt-1">Browse internships</button>
            </div>
            <div style={{ backgroundColor: darkMode ? "#3a2e0f" : "#fef3c7" }} className="rounded-2xl p-6 flex flex-col gap-3">
              <h3 style={{ color: darkMode ? "#ffffff" : "#78350f" }} className="text-xl font-bold">Full-time jobs</h3>
              <p style={{ color: darkMode ? "#fbbf24" : "#b45309" }} className="text-sm">Explore engineering and tech roles at top companies.</p>
              <button onClick={() => setTypeFilter("Job")} style={{ backgroundColor: "#d97706" }} className="w-fit text-white text-sm font-semibold px-5 py-2.5 rounded-full mt-1">Browse jobs</button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            {["", "Internship", "Job"].map((t) => (
              <button key={t || "all"} onClick={() => setTypeFilter(t)} style={{ backgroundColor: typeFilter === t ? "#0f766e" : darkMode ? "#1c1f26" : "#ffffff", color: typeFilter === t ? "#ffffff" : textMain, borderColor: darkMode ? "#2a2e37" : "#e5e7eb" }} className="px-5 py-2 rounded-full text-sm font-semibold border">
                {t === "" ? "All" : t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: textMain }} className="text-xl font-bold">Latest opportunities</h3>
            <span style={{ color: accent }} className="text-sm font-semibold">{opportunities.length} live</span>
          </div>

          {error && <p style={{ color: "#ef4444" }} className="mb-4">{error}</p>}
          {!loading && opportunities.length === 0 && <p style={{ color: textSub }} className="text-center py-20">No opportunities found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? [1, 2, 3, 4, 5, 6].map((n) => <CardSkeleton key={n} dark={darkMode} />)
              : opportunities.map((opp) => (
                  <JobCard key={opp._id} opp={opp} onClick={() => setSelected(opp)} dark={darkMode} isLoggedIn={!!user} savedIds={savedIds} onToggleSave={handleToggleSave} />
                ))}
          </div>
        </main>

        {selected && <Modal opp={selected} onClose={() => setSelected(null)} dark={darkMode} />}
      </div>
    </>
  );
}