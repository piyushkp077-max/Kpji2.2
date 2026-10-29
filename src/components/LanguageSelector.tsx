import { Button } from "@/components/ui/button";
import { captionLanguages, type CaptionLanguage } from "@/lib/caption-settings";

export function LanguageSelector({ value, onChange }: { value: CaptionLanguage; onChange: (value: CaptionLanguage) => void }) {
  return <div role="group" aria-label="Caption language" className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-9">
    {captionLanguages.map((language) => <Button key={language} aria-pressed={value === language} variant={value === language ? "ink" : "outline"} className="h-9 min-w-0 rounded-lg px-1 font-hindi text-xs" onClick={() => onChange(language)}>{language}</Button>)}
  </div>;
}