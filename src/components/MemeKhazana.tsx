import { useEffect, useRef, useState } from "react";
import { Check, Copy, Drama, Heart, Loader2, RefreshCw, Share2, Sparkles, Timer, UserRound, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nextScriptBatch, reelText, scriptCategories, scriptLanguages, translateScriptBatch, type ReelScript, type ScriptCategory, type ScriptLanguage } from "@/lib/scriptify";

type ScriptActions = { savedScripts: ReelScript[]; onSave: (script: ReelScript) => void };

type KhazanaResponse = { scripts: ReelScript[]; source: "ai" | "static" };

async function fetchAiScripts(category: ScriptCategory, language: ScriptLanguage, exclude: string[], signal: AbortSignal): Promise<KhazanaResponse | null> {
  try {
    const response = await fetch("/api/khazana", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, language, exclude }),
      signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { scripts?: unknown; source?: unknown };
    if (!Array.isArray(data.scripts)) return null;
    return { scripts: data.scripts as ReelScript[], source: data.source === "ai" ? "ai" : "static" };
  } catch {
    return null;
  }
}

export function MemeKhazana({ savedScripts, onSave }: ScriptActions) {
  const [category, setCategory] = useState<ScriptCategory>("funny");
  const [language, setLanguage] = useState<ScriptLanguage>("hinglish");
  const [scripts, setScripts] = useState<ReelScript[]>(() => nextScriptBatch("funny", "hinglish", [], [], () => 0.42).scripts);
  const histories = useRef<Record<string, string[]>>({});
  const current = useRef<ReelScript[]>(scripts);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "static" | "">("");

  const draw = async (nextCategory: ScriptCategory, nextLanguage: ScriptLanguage) => {
    const key = nextCategory;
    const previous = current.current.filter((s) => s.category === nextCategory).map((s) => s.storyId);
    setLoading(true);
    setMessage("");
    const controller = new AbortController();
    const ai = await fetchAiScripts(nextCategory, nextLanguage, histories.current[key] ?? [...previous], controller.signal);
    let batch: ReelScript[];
    let nextSource: "ai" | "static";
    if (ai && ai.scripts.length > 0) {
      batch = ai.scripts;
      nextSource = ai.source;
      histories.current[key] = [...(histories.current[key] ?? []), ...batch.map((s) => s.storyId)].slice(-200);
    } else {
      const fallback = nextScriptBatch(nextCategory, nextLanguage, histories.current[key] ?? [], previous);
      batch = fallback.scripts;
      histories.current[key] = fallback.seen;
      nextSource = "static";
    }
    current.current = batch;
    setScripts(batch);
    setSource(nextSource);
    setLoading(false);
    setMessage(nextSource === "ai" ? "5 fresh AI scripts" : "5 fresh scripts");
    try { window.sessionStorage.setItem("scriptify-story-history", JSON.stringify(histories.current)); } catch { /* Memory history still works. */ }
  };

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(window.sessionStorage.getItem("scriptify-story-history") ?? "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        histories.current = Object.fromEntries(Object.entries(parsed).filter(([, value]) => Array.isArray(value) && value.every((id) => typeof id === "string")));
      }
    } catch { histories.current = {}; }
    void draw("funny", "hinglish");
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <section className="rise" aria-label="Meme & Story Khazana">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0"><p className="flex items-center gap-2 text-xs font-bold uppercase text-primary"><Drama className="size-4" /> Reel collection</p><h1 className="mt-2 font-body text-3xl font-extrabold leading-tight sm:text-4xl">Meme & Story Khazana</h1></div>
      <Button variant="ink" size="lg" className="h-11 w-full sm:w-auto" disabled={!ready || loading} onClick={() => void draw(category, language)}>{loading ? <Loader2 className="animate-spin" /> : <RefreshCw />} {loading ? "Writing…" : "Refresh Story"}</Button>
    </div>
    <div role="group" aria-label="Script language" className="mt-5 flex flex-wrap gap-2">
      {scriptLanguages.map((item) => <Button key={item.id} variant={language === item.id ? "ink" : "outline"} aria-pressed={language === item.id} className="h-auto min-h-10 max-w-full whitespace-normal px-3 py-2 text-sm font-bold" onClick={() => { setLanguage(item.id); const translated = translateScriptBatch(current.current, item.id); current.current = translated; setScripts(translated); setMessage(""); setSource(""); }}><span aria-hidden="true">{item.emoji}</span>{item.label}</Button>)}
    </div>
    <div role="tablist" aria-label="Story categories" className="mt-5 grid gap-2 sm:grid-cols-2">
      {scriptCategories.map((item) => <Button key={item.id} id={`khazana-tab-${item.id}`} role="tab" aria-selected={category === item.id} aria-controls="khazana-scripts" variant={category === item.id ? "ink" : "glass"} className={cn("h-auto min-h-12 justify-start whitespace-normal px-3 py-3 text-left font-bold", item.id === "funny" && "sm:col-span-2")} onClick={() => { setCategory(item.id); void draw(item.id, language); }}><span aria-hidden="true">{item.emoji}</span><span className="min-w-0">{item.label}</span></Button>)}
    </div>
    <div className="my-5 flex items-center justify-between gap-3"><h2 className="font-body text-lg font-bold">{scriptCategories.find((item) => item.id === category)?.label}</h2><span role="status" aria-live="polite" className="shrink-0 text-xs font-semibold text-muted-foreground">{message || "5 scripts · 15–20 sec"}{source === "ai" && <span className="ml-2 inline-flex items-center gap-1 text-primary"><Sparkles className="size-3" /> AI</span>}</span></div>
    <div id="khazana-scripts" role="tabpanel" aria-labelledby={`khazana-tab-${category}`}>
      <ScriptCollection scripts={scripts} savedScripts={savedScripts} onSave={onSave} />
    </div>
  </section>;
}

export function ScriptCollection({ scripts, savedScripts, onSave }: ScriptActions & { scripts: ReelScript[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [shared, setShared] = useState<string | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const feedback = (id: string, action: "copy" | "share") => {
    if (timer.current) clearTimeout(timer.current);
    setCopied(action === "copy" ? id : null); setShared(action === "share" ? id : null);
    timer.current = setTimeout(() => { setCopied(null); setShared(null); }, 2500);
  };
  const copy = async (script: ReelScript) => {
    try { await navigator.clipboard.writeText(reelText(script)); setError(""); feedback(script.id, "copy"); }
    catch { setError("Could not copy. Please try again."); }
  };
  const share = async (script: ReelScript) => {
    setError("");
    try {
      if (navigator.share) { await navigator.share({ title: `Scriptify · ${script.title}`, text: reelText(script) }); }
      else { await navigator.clipboard.writeText(reelText(script)); feedback(script.id, "share"); }
    } catch (failure) { if (!(failure instanceof Error && failure.name === "AbortError")) setError("Could not share. Try Copy Script instead."); }
  };
  return <>
    {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
    <div className="grid items-start gap-5 md:grid-cols-2">
      {scripts.map((script, index) => {
        const saved = savedScripts.some((item) => item.id === script.id);
        return <article key={script.id} data-script-id={script.storyId} className={cn("rise overflow-hidden rounded-lg border bg-card shadow-glass", index === 0 ? "border-primary/50 md:col-span-2" : "border-border")} aria-label={script.title}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-primary/5 px-4 py-4 sm:px-5">
            <h3 className="min-w-0 font-body text-xl font-extrabold leading-snug">{script.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground"><span className="flex items-center gap-1"><Timer className="size-3.5" /> 15–20 sec</span><span className="flex items-center gap-1">{script.people === 1 ? <UserRound className="size-3.5" /> : <UsersRound className="size-3.5" />}{script.people === 1 ? "Solo POV" : `${script.people} people`}</span><span>{scriptLanguages.find((item) => item.id === script.language)?.label}</span></div>
          </div>
          <p dir={script.language === "arabic" ? "rtl" : undefined} lang={script.language === "arabic" ? "ar" : script.language === "hinglish" ? "en" : "hi"} className="min-w-0 break-words p-4 font-body text-lg font-semibold leading-relaxed sm:p-5">{reelText(script)}</p>
          <div className="flex items-center gap-2 px-4 pb-4 sm:px-5">
            <Button aria-label={copied === script.id ? "Copied!" : "Copy Script"} variant={copied === script.id ? "secondary" : "ink"} className="h-11 min-w-0 flex-1 sm:flex-none" onClick={() => copy(script)}>{copied === script.id ? <Check /> : <Copy />}<span role="status" aria-live="polite">{copied === script.id ? "Copied!" : "Copy Script"}</span></Button>
            <Button variant="outline" size="icon" className="size-11 shrink-0" onClick={() => share(script)} aria-label={shared === script.id ? "Copied for sharing" : "Share script"} title={shared === script.id ? "Copied — paste to share" : "Share script"}>{shared === script.id ? <Check /> : <Share2 />}</Button>
            <Button variant={saved ? "secondary" : "outline"} size="icon" className="size-11 shrink-0" onClick={() => onSave(script)} aria-label={saved ? "Remove saved script" : "Save script"} aria-pressed={saved} title={saved ? "Remove saved script" : "Save script"}><Heart className={cn(saved && "fill-primary text-primary")} /></Button>
          </div>
          {shared === script.id && <p role="status" className="px-4 pb-4 text-sm font-semibold text-muted-foreground">Script copied — paste to share.</p>}
        </article>;
      })}
    </div>
  </>;
}
