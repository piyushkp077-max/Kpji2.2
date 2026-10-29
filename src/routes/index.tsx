import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Copy,
  Flame,
  Hash,
  Heart,
  Home,
  Instagram,
  Moon,
  Search,
  Share2,
  Sparkles,
  Sun,
  Type,
  Drama,
  ImagePlus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import kpLogo from "@/assets/caption-craze-header.png";
import { DailyQuote } from "@/components/DailyQuote";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { quotesByCategory } from "@/lib/quotes-data";
import { cn } from "@/lib/utils";
import { StoryMaker } from "@/components/StoryMaker";
import { MemeKhazana, ScriptCollection } from "@/components/MemeKhazana";
import { FontStudio } from "@/components/FontStudio";
import { PhotoCaption } from "@/components/PhotoCaption";
import { LanguageSelector } from "@/components/LanguageSelector";
import { globalCategories, globalCategoryFor, type CaptionLanguage } from "@/lib/caption-settings";
import { fitnessQuotes } from "@/lib/fitness-quotes";
import { ScanSearch } from "lucide-react";
import { readSavedScripts, SAVED_SCRIPTS_KEY, toggleSavedScript, type ReelScript } from "@/lib/scriptify";

type Quote = {
  id: number;
  text: string;
  translation: string;
  category: string;
  views: string;
  gradient: string;
};

const categories = globalCategories;

const gradients = ["quote-gradient-one", "quote-gradient-two", "quote-gradient-three", "quote-gradient-four", "quote-gradient-five"];

const quotes: Quote[] = Object.entries(quotesByCategory).flatMap(([quoteCategory, entries], categoryIndex) =>
  entries.map(([text, translation], entryIndex) => {
    const id = categoryIndex * 1000 + entryIndex + 1;
    const viewsValue = 2.6 - ((categoryIndex * 7 + entryIndex * 13) % 220) / 100;
    return {
      id,
      text,
      translation,
      category: globalCategoryFor(quoteCategory),
      views: viewsValue >= 1 ? `${viewsValue.toFixed(1)}M` : `${Math.round(viewsValue * 1000)}K`,
      gradient: gradients[(categoryIndex + entryIndex) % gradients.length] ?? "quote-gradient-one",
    };
  }),
);

quotes.push(...fitnessQuotes.map(([text, translation], index) => ({ id: 100000 + index, text, translation, category: "Gym & Fitness", views: "", gradient: gradients[index % gradients.length] ?? "quote-gradient-one" })));

type HashtagGroup = { name: string; tagline: string; gradient: string; tags: string[] };

const hashtagGroups: HashtagGroup[] = [
  { name: "Viral & Trending", tagline: "For posts that need maximum reach right now", gradient: "quote-gradient-one", tags: ["#viral", "#trending", "#explore", "#explorepage", "#fyp", "#foryou", "#foryoupage", "#instagood", "#instadaily", "#viralpost", "#trendingnow", "#reelsinstagram", "#reelitfeelit", "#instareels", "#love", "#photooftheday"] },
  { name: "Attitude", tagline: "Bold captions deserve bold tags", gradient: "quote-gradient-three", tags: ["#attitude", "#attitudestatus", "#badshah", "#king", "#boss", "#bosslife", "#swag", "#desi", "#royal", "#selfmade", "#nofilter", "#darrnahi", "#attitudequotes", "#single", "#style", "#confidence"] },
  { name: "Love & Romantic", tagline: "Couple posts, crushes and soft moments", gradient: "quote-gradient-five", tags: ["#love", "#lovestory", "#romantic", "#couplegoals", "#couples", "#pyar", "#mohabbat", "#ishq", "#dil", "#truelove", "#lovequotes", "#forever", "#soulmate", "#romance", "#together", "#heartbeat"] },
  { name: "Motivation", tagline: "Hustle, grind and never-give-up energy", gradient: "quote-gradient-two", tags: ["#motivation", "#motivationalquotes", "#hustle", "#grind", "#success", "#nevergiveup", "#dreambig", "#focus", "#hardwork", "#inspiration", "#mindset", "#goals", "#selfbelief", "#positivity", "#discipline", "#winner"] },
  { name: "Sad & Alone", tagline: "For the quiet, heavy days", gradient: "quote-gradient-four", tags: ["#sad", "#sadquotes", "#alone", "#broken", "#heartbroken", "#pain", "#tears", "#lonely", "#missyou", "#sadshayari", "#feelings", "#hurt", "#depressed", "#goodbye", "#silent", "#lost"] },
  { name: "Reels/Shorts Special", tagline: "Built for Reels, Shorts and quick viral hits", gradient: "quote-gradient-one", tags: ["#reels", "#reelsinstagram", "#reelsvideo", "#reelitfeelit", "#reelsindia", "#shorts", "#youtubeshorts", "#reelkarofeelkaro", "#viralreels", "#trendingreels", "#reelsofinstagram", "#reelsdaily", "#explorepage", "#viralvideo", "#instavideo", "#contentcreator"] },
  { name: "Life Reality", tagline: "Real talk about zindagi and truth", gradient: "quote-gradient-two", tags: ["#life", "#zindagi", "#reality", "#truth", "#lifequotes", "#factsoflife", "#deep", "#thoughts", "#lifelessons", "#realtalk", "#waqt", "#kismat", "#lifeislife", "#wisdom", "#experience", "#sach"] },
  { name: "Friendship", tagline: "Dosti, yaari and squad love", gradient: "quote-gradient-four", tags: ["#friends", "#friendship", "#dosti", "#yaari", "#bff", "#bestfriends", "#squad", "#friendshipgoals", "#yaar", "#dost", "#friendsforever", "#brotherhood", "#masti", "#gang", "#memories", "#foreverfriends"] },
  { name: "Daily Quotes", tagline: "Good morning posts, thoughts and daily vibes", gradient: "quote-gradient-two", tags: ["#dailyquotes", "#quoteoftheday", "#goodmorning", "#thoughtoftheday", "#suvichar", "#hindiquotes", "#dailymotivation", "#positivevibes", "#morningvibes", "#quotestoliveby", "#aajkasuvichar", "#wordsofwisdom", "#inspirationalquotes", "#dailyinspiration", "#lifequotes", "#quotesdaily"] },
  { name: "Hindi Shayari", tagline: "दिल की बात, शायरी के साथ", gradient: "quote-gradient-five", tags: ["#shayari", "#hindishayari", "#urdushayari", "#shayarilover", "#dilkibaat", "#hindipoetry", "#ishqshayari", "#sadshayari", "#loveshayari", "#rekhta", "#hindiwriting", "#alfaaz", "#jazbaat", "#lafz", "#hindiquotes", "#shayarikiduniya"] },
  { name: "Attitude Hindi", tagline: "Desi swag aur royal attitude", gradient: "quote-gradient-three", tags: ["#attitudeshayari", "#hindiattitude", "#nawabi", "#rajputana", "#dabangg", "#khiladi", "#apnatimeaayega", "#swagger", "#desiboy", "#desigirl", "#jalwa", "#rutba", "#bhaigiri", "#attitudeking", "#queenattitude", "#tashan"] },
  { name: "Love Hindi", tagline: "Pyaar, ishq aur mohabbat ke tags", gradient: "quote-gradient-one", tags: ["#pyaar", "#ishqwala", "#mohabbatein", "#dilse", "#jaanu", "#meriduniya", "#tumhare_liye", "#pehlapyaar", "#loveshayari", "#hindilove", "#premkahani", "#saathhamesha", "#dilkirani", "#humsafar", "#chahat", "#romanticshayari"] },
  { name: "Sad Hindi", tagline: "Tanhai, dard aur toota dil", gradient: "quote-gradient-four", tags: ["#dardbharishayari", "#tanhai", "#toota_dil", "#bewafa", "#akelapan", "#dard", "#yaadein", "#sadstatus", "#brokenheart", "#aansu", "#judai", "#sadhindi", "#dilkadard", "#khamoshi", "#adhurapyar", "#emotional"] },
  { name: "Motivation Hindi", tagline: "Mehnat, junoon aur kamyabi", gradient: "quote-gradient-two", tags: ["#hindimotivation", "#mehnat", "#safalta", "#kamyabi", "#junoon", "#sapne", "#himmat", "#lakshya", "#motivationhindi", "#jeetega", "#studymotivation", "#upsc", "#successmantra", "#josh", "#jazba", "#kabhiharnamat"] },
  { name: "Reels Hindi", tagline: "Desi Reels aur Shorts ke liye", gradient: "quote-gradient-one", tags: ["#reelsindia", "#desireels", "#hindireels", "#bollywood", "#bollywoodreels", "#trendingsongs", "#reelkaro", "#indianreels", "#hindisong", "#reelsbollywood", "#viralindia", "#instaindia", "#mumbai", "#delhi", "#reelsvideo", "#shortsfeed"] },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scriptify" },
      { name: "description", content: "Discover punchy 15–20-second reel scripts, save favorites, and create multilingual captions with Scriptify." },
      { property: "og:title", content: "Scriptify" },
      { property: "og:description", content: "Original funny reel scripts, regional language flavors, and multilingual captions in Scriptify." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotelyApp,
});

function QuotelyApp() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [category, setCategory] = useState<string>("Attitude");
  const [roastMode, setRoastMode] = useState(false);
  const [language, setLanguage] = useState<CaptionLanguage>("शुद्ध हिंदी");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [tab, setTab] = useState<"home" | "saved" | "khazana" | "hashtags" | "fonts" | "ai">("khazana");
  const [savedScripts, setSavedScripts] = useState<ReelScript[]>([]);
  const [makerQuote, setMakerQuote] = useState<Quote | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSavedScripts(readSavedScripts(window.localStorage.getItem(SAVED_SCRIPTS_KEY)));
    const savedTheme = window.localStorage.getItem("quotely-theme");
    const savedFavorites = window.localStorage.getItem("quotely-favorites");
    if (savedTheme === "dark") setTheme("dark");
    if (savedFavorites) {
      try { setFavorites(JSON.parse(savedFavorites)); } catch { setFavorites([]); }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("quotely-theme", theme);
  }, [theme]);

  const visibleQuotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      const categoryMatch = tab === "saved" || quote.category === category || (category === "Friendship" && quote.category === "Friends");
      const searchMatch = !normalized || `${quote.text} ${quote.translation} ${quote.category}`.toLowerCase().includes(normalized);
      const favoriteMatch = tab !== "saved" || favorites.includes(quote.id);
      return categoryMatch && searchMatch && favoriteMatch;
    });
  }, [category, favorites, query, tab]);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    notify("Copied clean text");
  };

  const copyAllHashtags = async (group: HashtagGroup) => {
    await navigator.clipboard.writeText(group.tags.join(" "));
    notify(`Copied all ${group.tags.length} hashtags`);
  };

  const visibleHashtagGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return hashtagGroups;
    return hashtagGroups.filter((group) => `${group.name} ${group.tags.join(" ")}`.toLowerCase().includes(normalized));
  }, [query]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("quotely-favorites", JSON.stringify(next));
      notify(current.includes(id) ? "Removed from saved" : "Saved to favorites");
      return next;
    });
  };

  const saveScript = (script: ReelScript) => {
    const next = toggleSavedScript(savedScripts, script);
    try {
      window.localStorage.setItem(SAVED_SCRIPTS_KEY, JSON.stringify(next));
      setSavedScripts(next);
      notify(next.length > savedScripts.length ? "Script saved" : "Script removed");
    } catch { notify("Could not save. Please try again."); }
  };

  const share = async (quote: Quote, channel: "whatsapp" | "instagram") => {
    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(quote.text)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (navigator.share) {
      try { await navigator.share({ text: quote.text, title: "Scriptify" }); } catch { return; }
    } else {
      await copyText(quote.text);
      notify("Caption copied — paste it in Instagram");
    }
  };

  const setActiveTab = (next: "home" | "saved" | "khazana" | "hashtags" | "fonts" | "ai") => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ambient-page min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
      <header className="sticky top-0 z-30 border-b border-glass-border bg-glass backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 pb-3 pt-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <Button variant="ghost" className="h-auto min-w-0 justify-start gap-2 p-0 text-left hover:bg-transparent" onClick={() => setActiveTab("home")} aria-label="Go home">
              <img src={kpLogo} alt="KP logo" width={720} height={697} className="size-11 sm:size-14 shrink-0 object-contain drop-shadow-lg" />
              <span className="min-w-0 leading-none"><span className="block font-display text-lg sm:text-2xl font-medium leading-tight">Scriptify</span><span className="mt-1 block truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">CAPTIONS, QUOTES & REEL SCRIPTS</span></span>
            </Button>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button variant="glassIcon" size="icon" className="rounded-full" aria-label="Saved favorites" onClick={() => setActiveTab("saved")}><Heart className={cn((favorites.length > 0 || savedScripts.length > 0) && "fill-primary text-primary")} /></Button>
              <Button variant="ink" size="icon" className="rounded-full" aria-label="Toggle color theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon /> : <Sun />}</Button>
            </div>
          </div>
          {(tab === "home" || tab === "saved" || tab === "hashtags") && <label className="mt-4 flex items-center gap-3 rounded-full border border-glass-border bg-card px-4 py-3.5 shadow-glass backdrop-blur-xl">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" placeholder="Search captions, mood, keyword..." aria-label="Search quotes" />
          </label>}
          {(tab === "home" || tab === "ai") && <div role="group" aria-label="Caption category" className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {categories.filter((item) => tab !== "home" || item !== "Roast").map((item) => {
              const roastToggle = item === "Roast" && tab === "ai";
              const active = roastToggle ? roastMode : category === item;
              return <Button key={item} aria-pressed={active} variant={active ? "ink" : item === "Roast" ? "outline" : "glass"} size="sm" className={cn("h-9 shrink-0 rounded-full px-3 text-xs", item === "Roast" && "sticky left-0 z-10", item === "Roast" && !active && "bg-background")} onClick={() => { if (roastToggle) setRoastMode((on) => !on); else setCategory(item); }}>{item === "Roast" && <Flame className="size-3.5" />}{item}</Button>;
            })}
          </div>}
          {tab === "ai" && <>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Language</span>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold"><Flame className="size-4 text-primary" /> Roast Mode <Switch aria-label="Roast Mode" checked={roastMode} onCheckedChange={setRoastMode} /></label>
            </div>
            <LanguageSelector value={language} onChange={setLanguage} />
          </>}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4">
        {tab === "ai" ? (
          <PhotoCaption language={language} category={roastMode ? "Roast" : category} onCopy={async (text, message) => { await navigator.clipboard.writeText(text); notify(message); }} onWhatsApp={(text) => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")} />
        ) : tab === "fonts" ? (
          <FontStudio onCopy={async (text, message) => { await navigator.clipboard.writeText(text); notify(message); }} />
        ) : tab === "hashtags" ? (
          <Hashtags groups={visibleHashtagGroups} onCopyAll={copyAllHashtags} />
        ) : tab === "khazana" ? (
          <MemeKhazana savedScripts={savedScripts} onSave={saveScript} />
        ) : (
          <>

            <section className="mt-1">
              {tab === "home" && <DailyQuote onCopy={copyText} notify={notify} />}
              <div className="flex items-end justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{tab === "saved" ? "Your collection" : "Fresh picks"}</p><h1 className="mt-1 flex items-center gap-2 font-display text-3xl sm:text-4xl font-medium">{tab === "saved" ? <Heart className="size-5 fill-primary text-primary" /> : <Flame className="size-5 fill-primary text-primary" />}{tab === "saved" ? "Saved Favorites" : "Trending Now"}</h1></div>
                {tab === "home" && <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">Live <span className="size-1.5 rounded-full bg-primary" /></span>}
              </div>
              {tab === "saved" && savedScripts.length > 0 && <div className="mt-5"><h2 className="mb-4 font-body text-xl font-bold">Saved Scripts</h2><ScriptCollection scripts={savedScripts.filter((script) => !query.trim() || `${script.title} ${script.hook} ${script.twist} ${script.punchline}`.toLowerCase().includes(query.trim().toLowerCase()))} savedScripts={savedScripts} onSave={saveScript} /></div>}
              {tab === "saved" && visibleQuotes.length > 0 && <h2 className="mt-8 font-body text-xl font-bold">Saved Captions</h2>}
              {visibleQuotes.length ? <div className="mt-4 grid gap-6 md:grid-cols-2">
                {visibleQuotes.map((quote, index) => <QuoteCard key={quote.id} quote={quote} favorite={favorites.includes(quote.id)} delay={Math.min(index, 3)} onCopy={() => copyText(quote.text)} onFavorite={() => toggleFavorite(quote.id)} onCreateImage={() => setMakerQuote(quote)} onShare={(channel) => share(quote, channel)} />)}
              </div> : tab === "saved" && savedScripts.length > 0 ? null : <div className="mt-12 text-center"><Sparkles className="mx-auto size-8 text-primary" /><h2 className="mt-3 font-display text-xl">No captions found</h2><p className="mt-1 text-sm text-muted-foreground">Try another keyword or category.</p></div>}
            </section>
          </>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-[999999] border-t border-border bg-background shadow-glass" aria-label="Main navigation" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 px-3 pt-2">
          <TabButton active={tab === "home"} label="Home" icon={<Home />} onClick={() => setActiveTab("home")} />
          <TabButton active={tab === "khazana"} label="Meme & Story Khazana" icon={<Drama />} onClick={() => setActiveTab("khazana")} />
          <TabButton active={tab === "ai"} label="AI Photo" icon={<ScanSearch />} onClick={() => setActiveTab("ai")} />
          <TabButton active={tab === "fonts"} label="Fonts" icon={<Type />} onClick={() => setActiveTab("fonts")} />
          <TabButton active={tab === "saved"} label="Saved" icon={<Heart />} onClick={() => setActiveTab("saved")} />
        </div>
      </nav>
      {makerQuote && <StoryMaker text={makerQuote.text} translation={makerQuote.translation} id={makerQuote.id} onClose={() => setMakerQuote(null)} notify={notify} />}
      {toast && <div role="status" className="toast-in fixed bottom-24 left-1/2 z-[1000001] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background shadow-elevated"><Check className="size-3.5" />{toast}</div>}
    </div>
  );
}

function Hashtags({ groups, onCopyAll }: { groups: HashtagGroup[]; onCopyAll: (group: HashtagGroup) => void }) {
  return (
    <section className="rise">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Boost your reach</p><h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-medium"><Hash className="size-5 text-primary" />Trending Hashtags</h1></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">Live <span className="size-1.5 rounded-full bg-primary" /></span>
      </div>
      {groups.length ? <div className="mt-4 grid gap-5 md:grid-cols-2">
        {groups.map((group, index) => (
          <article key={group.name} className="rise overflow-hidden rounded-2xl border border-glass-border bg-glass shadow-glass backdrop-blur-xl" style={{ animationDelay: `${Math.min(index, 3) * 70}ms` }}>
            <div className={cn("flex items-center justify-between gap-3 px-4 py-3 text-story-foreground", group.gradient)}>
              <div className="min-w-0"><h2 className="truncate font-display text-lg font-medium">{group.name}</h2><p className="truncate text-[11px] opacity-80">{group.tagline}</p></div>
              <span className="shrink-0 rounded-full bg-story-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">{group.tags.length} tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {group.tags.map((tag) => <span key={tag} className="rounded-full border border-glass-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">{tag}</span>)}
            </div>
            <div className="px-4 pb-4">
              <Button variant="ink" className="w-full rounded-xl" onClick={() => onCopyAll(group)}><Copy /> Copy All Hashtags</Button>
            </div>
          </article>
        ))}
      </div> : <div className="mt-12 text-center"><Sparkles className="mx-auto size-8 text-primary" /><h2 className="mt-3 font-display text-xl">No hashtags found</h2><p className="mt-1 text-sm text-muted-foreground">Try another keyword.</p></div>}
    </section>
  );
}

function QuoteCard({ quote, favorite, delay, onCopy, onFavorite, onCreateImage, onShare }: { quote: Quote; favorite: boolean; delay: number; onCopy: () => void; onFavorite: () => void; onCreateImage: () => void; onShare: (channel: "whatsapp" | "instagram") => void }) {
  return <article className="rise" style={{ animationDelay: `${delay * 70}ms` }}>
    <div className={cn("relative min-h-60 overflow-hidden rounded-[20px] p-5 sm:p-7 text-story-foreground shadow-elevated", quote.gradient)}>
      <div className="relative flex h-full min-h-42 flex-col justify-between"><div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80"><span>{quote.category}</span><span className="flex items-center gap-2">{quote.views} views<Button variant="ghost" size="icon" aria-label={favorite ? "Remove from saved" : "Save caption"} onClick={onFavorite} className="grid size-8 place-items-center rounded-full bg-story-soft transition active:scale-90"><Heart className={cn("size-4", favorite && "fill-current")} /></Button></span></div><div><p className={cn("mt-5 text-[24px] font-medium leading-tight", /[\u0900-\u097F]/.test(quote.text) ? "font-hindi" : "font-display")}>“{quote.text}”</p><p className={cn("mt-2 text-sm opacity-80", /[\u0900-\u097F]/.test(quote.translation) && "font-hindi")}>{quote.translation}</p></div></div>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-1.5">
      <Button variant="glass" size="sm" className="min-w-0 rounded-full px-2" onClick={onCopy}><Copy /> Copy</Button>
      <Button size="sm" className="min-w-0 rounded-full bg-whatsapp px-2 text-whatsapp-foreground hover:bg-whatsapp/90" aria-label="Share to WhatsApp" onClick={() => onShare("whatsapp")}><Share2 /> <span className="truncate">WhatsApp</span></Button>
      <Button variant="ink" size="sm" className="min-w-0 rounded-full px-2" onClick={onCreateImage}><ImagePlus /> <span className="truncate">Image</span></Button>
    </div>
    <div className="mt-1.5 flex justify-end gap-1.5">
      <Button variant="glassIcon" size="dock" aria-label="Share on Instagram" title="Instagram" onClick={() => onShare("instagram")}><Instagram /></Button>
      <Button variant="glassIcon" size="dock" aria-label={favorite ? "Remove from favorites" : "Save to favorites"} title="Favorite" onClick={onFavorite}><Heart className={cn(favorite && "fill-primary text-primary")} /></Button>
    </div>
  </article>;
}

function TabButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
  return <Button variant="ghost" className={cn("h-14 sm:h-16 min-w-0 flex-col gap-1 rounded-2xl px-0 text-[10px] sm:text-xs", label === "Meme & Story Khazana" && "h-16 py-1", active ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "text-muted-foreground")} onClick={onClick} aria-label={label}>{icon}<span className={cn("block w-full whitespace-normal text-center leading-tight", label === "Meme & Story Khazana" && "text-[9px] leading-[10px] sm:text-[10px] sm:leading-3")}>{label}</span></Button>;
}