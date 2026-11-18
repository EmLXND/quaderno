# Quaderno

Single-file static app (`index.html`) served by GitHub Pages from `main` (root).

- On every change to `index.html`, bump `<meta name="app-version" content="YYYY-MM-DD.N">`.
  The installed home-screen app compares this value with the online copy (at launch, on
  return to foreground, and via "Controlla aggiornamenti" in Categorie) and reloads itself
  when they differ. Without a bump, installed copies will not update on their own.
- Progress (`quaderno-v1`) and highscores (`quaderno-scores-v1`) live in localStorage; keep
  those keys and formats backwards compatible.
- Progress is per direction with spaced repetition: `st.srs.it` / `st.srs.de` map word id
  (`it|de`) to `[box, dueDay]` (box 0 = learning, intervals in `IV`, days roll over at 4:00).
  The old `st.known` map is legacy and only read once to migrate into `st.srs.it`.
- Impara works in rounds ("giro") of `st.run` cards (picker in the UI): reviews (relearning
  first, then due words most overdue first) and new words. The new-word share is 50% while the
  backlog fits in one round and slides to 10% from three rounds on; whichever side runs short
  is filled from the other. There is no daily new-word cap. `st.streak = [lastDay, count]`
  counts days with a finished round; `st.nd` / `st.rv` only count today's new words and
  reviews for the end-of-round stats.
- Offline: `sw.js` serves the page network-first (2.5 s timeout, then the saved copy) and
  assets cache-first. Bump `CACHE` in `sw.js` only when its `ASSETS` list changes. Fonts are
  self-hosted in `fonts/` (OFL) — don't reintroduce external font or script URLs.
