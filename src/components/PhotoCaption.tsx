import { Camera, Copy, Hash, Loader2, RefreshCw, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type AiCaption } from "@/lib/video-captions";
import { getVisitorId } from "@/lib/visitor";
import { globalCategories, limitCaptions, MAX_CAPTIONS, MIN_CAPTIONS, type CaptionLanguage } from "@/lib/caption-settings";

type Media = { kind: "photo"; src: string } | { kind: "video"; src: string; frames: Promise<string[]> } | null;

function drawScaled(source: CanvasImageSource, w: number, h: number, max = 640) {
  const scale = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing is unavailable.");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.75);
}

function resize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { resolve(drawScaled(img, img.width, img.height)); URL.revokeObjectURL(img.src); };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Grabs 3 small frames without decoding the whole file — works for any length or format the browser can play.
async function videoFrames(url: string): Promise<string[]> {
  const v = document.createElement("video");
  v.muted = true; v.playsInline = true; v.preload = "metadata"; v.src = url;
  await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("video")); });
  const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 1;
  const frames: string[] = [];
  for (const t of [0.15, 0.5, 0.85]) {
    await new Promise<void>((res) => { v.onseeked = () => res(); v.currentTime = Math.min(d - 0.05, d * t); });
    frames.push(drawScaled(v, v.videoWidth, v.videoHeight, 512));
  }
  v.removeAttribute("src"); v.load();
  return frames;
}

export function PhotoCaption({ onCopy, onWhatsApp, language, category, mode = "media" }: { onCopy: (text: string, message: string) => void; onWhatsApp: (text: string) => void; language: CaptionLanguage; category: string; mode?: "media" | "prompt" }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [media, setMedia] = useState<Media>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("");
  const [captions, setCaptions] = useState<AiCaption[]>([]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const reset = () => {
    abortRef.current?.abort();
    if (media?.kind === "video") URL.revokeObjectURL(media.src);
    setMedia(null); setPrompt(""); setCaptions([]); setNote(""); setMood(""); setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fallback = () => setNote("Couldn't finish your captions. Please try again.");

  const generate = async () => {
    if (loading || (mode === "media" ? !media : !prompt.trim())) return;
    abortRef.current?.abort();
    const ctrl = new AbortController(); abortRef.current = ctrl;
    setNote(""); setLoading(true); setCaptions([]); setMood("");
    try {
      const images = mode === "prompt" ? [] : media?.kind === "video" ? await media.frames : media ? [media.src] : [];
      if (ctrl.signal.aborted) return;
      const res = await fetch("/api/caption", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ images, kind: mode === "prompt" ? "prompt" : media?.kind, prompt, category: globalCategories.find((item) => item === category), language, visitorId: getVisitorId() }) });
      if (!res.ok || !res.body) { const error = await res.json().catch(() => null); setNote(error?.error || "Couldn't generate captions. Please try again."); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "", got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const o = JSON.parse(line);
          if (o.error) { setNote(o.error); return; }
          if (o.mood) setMood(o.mood);
          else if (o.text && got < MAX_CAPTIONS) { got++; setCaptions((c) => limitCaptions([...c, o])); }
        }
      }
      if (got < MIN_CAPTIONS) { setCaptions([]); fallback(); }
    } catch (e) {
      if (!ctrl.signal.aborted) fallback();
    } finally {
      if (abortRef.current === ctrl) setLoading(false);
    }
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    reset();
    if (file.type.startsWith("video/")) {
      const src = URL.createObjectURL(file);
      const frames = videoFrames(src); frames.catch(() => {}); // start extracting in the background right away
      setMedia({ kind: "video", src, frames });
    } else setMedia({ kind: "photo", src: await resize(file) });
  };

  return <section className="rise mx-auto max-w-2xl">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 font-display text-xl font-medium"><Sparkles className="size-5 text-primary" />{category === "Roast" ? "Generate Roasts" : mode === "prompt" ? "Generate Captions" : "Media AI Captions"}</h1>
      </div>
      {(media || prompt || captions.length > 0 || loading) && <Button size="sm" variant="outline" className="rounded-full" onClick={reset}><RotateCcw /> Reset</Button>}
    </div>
    {mode === "prompt" && <label className="mt-2 block"><textarea aria-label="Caption prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={2000} rows={2} placeholder={category === "Roast" ? "हर बात में खुद को हीरो समझने वाला दोस्त…" : "समंदर किनारे ढलता सूरज…"} className="w-full resize-none rounded-lg border border-input bg-background p-2 font-hindi text-sm outline-none focus:ring-2 focus:ring-ring" /></label>}

    <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
    {mode === "media" && <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} className="mt-2 flex h-28 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-glass-border bg-glass p-0 text-center">
      {media?.kind === "photo" ? <img src={media.src} alt="Your uploaded photo" className="size-full object-contain" />
        : media?.kind === "video" ? <video src={media.src} className="size-full object-contain" muted autoPlay loop playsInline />
        : <><Camera className="size-9 text-primary" /><span className="mt-2 text-sm font-semibold">Tap to upload a photo or video</span><span className="text-xs text-muted-foreground">JPG, PNG, HEIC, MP4, MOV — any length</span></>}
    </Button>}

    <Button variant="ink" className="mt-2 h-10 w-full rounded-lg" disabled={(mode === "prompt" ? !prompt.trim() : !media) || loading} onClick={generate}>
      {loading ? <><Loader2 className="animate-spin" /> {captions.length ? `Writing captions… ${captions.length}` : mode === "prompt" ? "Writing captions…" : media?.kind === "video" ? "Analysing your video…" : "Analysing your photo…"}</> : captions.length ? <><RefreshCw /> Generate Again</> : <><Sparkles /> Generate Captions</>}
    </Button>
    {mood && <p className="mt-2 text-xs text-muted-foreground">{mood}</p>}
    {note && <p className="mt-3 rounded-xl bg-muted p-3 text-sm text-muted-foreground">{note}</p>}

    <div className="mt-3 space-y-2" aria-live="polite">
      {captions.map((c, i) => <article key={c.text + i} aria-label={`Generated caption ${i + 1}`} className="rise rounded-lg border border-glass-border bg-glass p-3">
        <p dir="auto" className={cn("break-words text-base font-medium leading-snug", /[\u0900-\u097F]/.test(c.text) ? "font-hindi" : "font-display")}>“{c.text}”</p>
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" variant="glass" className="h-8 rounded-lg" onClick={() => onCopy(c.text, "Caption copied")}><Copy /> Copy</Button>
          <Button size="icon" variant="glass" className="size-8 rounded-lg" aria-label="Copy hashtags" title="Copy hashtags" onClick={() => onCopy(c.hashtags.join(" "), "Hashtags copied")}><Hash /></Button>
          <Button size="sm" variant="ink" className="ml-auto h-8 rounded-lg" onClick={async () => { const text = `${c.text}\n\n${c.hashtags.join(" ")}`; if (navigator.share) { try { await navigator.share({ text }); } catch { /* user cancelled */ } } else onWhatsApp(text); }}><Share2 /> Share</Button>
        </div>
      </article>)}
    </div>
  </section>;
}
