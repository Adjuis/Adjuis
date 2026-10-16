# Adjuis

Splash page for **Adjuis** ("the creative house of C Mecca"), adjuis.com.

A single static page: no build step, no framework, no dependencies.
Everything lives in `index.html` plus the files under `assets/`.

## What it does

- Fades in on load, then swaps the tagline copy after a few seconds.
- Picks one of five background clips at random every time the page loads
  (`assets/videos/`).
- The "CM" mark bottom-of-page auto-expands to "C MECCA" shortly after
  load, holds, then collapses back once.
- The email button opens `mailto:info@adjuis.com` in a new tab (worked
  around with `window.open` so it also behaves inside sandboxed iframes).

## Local preview

Any static file server works, e.g.:

```
npx serve .
```

or just open `index.html` directly in a browser (the background videos
will still load fine from a `file://` URL in most browsers; some browsers
block autoplay on `file://` more aggressively than over http).

## Pushing this to GitHub

This folder isn't a git repo yet (the zip leaves `.git` out to keep the
download smaller). From inside this folder:

```
git init
git add -A
git commit -m "Initial commit: Adjuis splash page"
```

Then create an empty repo on GitHub (no README/license/gitignore —
this folder already has those), and:

```
git remote add origin https://github.com/<you>/adjuis.git
git branch -M main
git push -u origin main
```

## Deploying to Netlify

This repo needs zero configuration — it's already a flat static site.

1. Push this repo to GitHub (above).
2. In Netlify: **Add new site → Import an existing project**, pick this
   repo.
3. Build command: leave blank. Publish directory: `.` (repo root).
4. Deploy. Netlify will pick up `netlify.toml` automatically if you want
   to tweak headers/redirects later — none are required for this page to
   work.

## Structure

```
index.html
assets/
  videos/   -- 5 background clips, one chosen at random per page load
  logos/    -- award marks + laurels shown in the awards row
```

## Editing

Everything is in one file (`index.html`) — styles, markup, and the small
amount of vanilla JS are all inline. There's nothing to build; edit and
redeploy.
