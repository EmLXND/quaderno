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
