<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Khazana scenario variations and seeded daily rotation in a standalone browser-safe library; this preserves existing caption datasets and keeps comedy combinations coherent.
- Render Khazana through the existing bottom-tab system without backend writes; existing Home and quote-to-image flows remain independent.

- Keep Scriptify's materialized short-scene bank, regional translations and Fisher–Yates batch selection in browser-safe libraries; language switches translate current story IDs without consuming refresh history and caption datasets stay independent.
- Save scripts as validated text snapshots in a separate localStorage key and batch history in sessionStorage; no auth or backend writes are needed and saved captions remain intact.
- Render and export script prose through the shared reelText formatter while retaining stored scene fields for saved-script compatibility.
