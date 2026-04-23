# cv-builder

> 100% vibe coded. built for speed, not perfection.

A local tool to quickly spin up tailored versions of my CV for each job I apply to — no overengineering, no cloud, just JSON files and a Node server.

## what it does

- Stores CV profiles as local JSON files under `profiles/`
- Lets me duplicate and tweak a base CV for a specific job post
- Serves everything through a simple Express backend + single HTML page

## why it exists

Copy-pasting and manually editing a PDF for every application is painful. This lets me keep a base CV and make quick targeted adjustments (summary, skills order, highlights) before exporting — without touching a design tool every time.

## stack

- Node.js + Express — local server
- Vanilla HTML/JS — single-file frontend (`cv-builder.html`)
- JSON files — dead simple persistence, no database

## usage

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

## disclaimer

This is a personal productivity tool. It's scrappy by design.

