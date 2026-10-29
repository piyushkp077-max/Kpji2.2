import { useEffect, useState } from "react";
import { Copy, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const quote = "पहले खुद को पसंद करो, बाकी सब बाद में।";

export function DailyQuote({ onCopy, notify }: { onCopy: (text: string) => Promise<void>; notify: (message: string) => void }) {
  const [date, setDate] = useState("Today");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    setDate(new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(new Date()));
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const listen = () => {
    if (!("speechSynthesis" in window)) {
      notify("Listening is not supported on this device.");
      return;
    }
    window.speechSynthesis.cancel();
    if (listening) { setListening(false); return; }
    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.lang = "hi-IN";
    const hindiVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith("hi"));
    if (hindiVoice) utterance.voice = hindiVoice;
    utterance.onend = () => setListening(false);
    utterance.onerror = () => { setListening(false); notify("Listening could not start on this device."); };
    setListening(true);
    window.speechSynthesis.speak(utterance);
  };

  return <section aria-label="Quote of the Day" className="daily-quote quote-gradient-one mb-7 rounded-[20px] p-5 text-story-foreground shadow-elevated sm:p-7">
    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
      <span className="rounded-full bg-story-soft px-3 py-1.5 font-semibold uppercase tracking-[0.12em]">Quote of the Day</span>
      <time className="opacity-80">{date}</time>
    </div>
    <p className="mt-5 font-hindi text-[27px] leading-[1.35] sm:text-4xl">“{quote}”</p>
    <p className="mt-2.5 text-sm opacity-80 sm:text-lg">Love yourself first, the rest follows.</p>
    <div className="mt-5 flex gap-2">
      <Button variant="glass" className="h-10 rounded-full bg-background px-4 text-foreground" onClick={() => onCopy(quote)}><Copy /> Copy</Button>
      <Button variant="story" className="h-10 rounded-full px-4" onClick={listen} aria-pressed={listening}>{listening ? <Square /> : <Play />}{listening ? "Stop" : "Listen"}</Button>
    </div>
  </section>;
}