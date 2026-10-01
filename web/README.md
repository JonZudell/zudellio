# zudell.io — the app

A Next.js App Router site, TypeScript, `output: 'standalone'`, so the deployment
artefact is a container running `node server.js` — the same shape as the other
products on the cluster. It replaces `interface/` (the custom webpack static-site
generator) and the two Lambdas, and it is built beside the old site rather
than on top of it: `interface/` still serves production until this is proven.

## Run it

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # production build, standalone output
npm start          # run the standalone server from .next/standalone
npm run typecheck
npm run lint
```

Container:

```bash
docker build -t zudellio-web .
docker run --rm -p 3000:3000 zudellio-web
curl localhost:3000/api/health
```

`PORT` and `HOSTNAME` are read by the standalone server; the image defaults to
3000 on 0.0.0.0.

## What is where

| path | what |
| --- | --- |
| `content/posts/*.md` | the posts. Adding a post is adding a file. |
| `src/lib/posts.ts` | front matter, ordering, the sticky post |
| `src/lib/markdown.ts` | markdown to HTML, titled code blocks, the widget directive |
| `src/app/globals.css` | the whole design system, about a hundred lines of it |
| `src/app/api/health/route.ts` | `GET /api/health` — the chart's liveness and readiness path |
| `src/app/api/contact/route.ts` | `POST /api/contact` — replaces the contact Lambda |
| `src/app/rss.xml/route.ts` | the feed, from the same markdown |
| `src/components/widgets/` | the live things three posts embed |

### A post

    ---
    title: hire_me
    version: v1.0.0
    author: jon@zudell.io
    date: 2024-11-01T00:00:00Z
    sticky: true          # optional; the one post pinned above the list
    summary: >-
      Markdown shown on the index card.
    ---

    ## A heading reads as a comment

    Prose. `inline code`, **emphasis in pink**, [a link](https://example.com).

    ```js title="webpack.config.js"
    // a fenced block becomes a titled box
    ```

A post can embed one of the live components with a directive alone on its own
line:

```
:::widget rule30 cellSize=6 width=100 height=80
:::widget rule-visualizer ruleNumber=30
:::widget stimmy degreesOfFreedom=4 height=480
:::widget signup-form
```

## The contact form does not deliver anything, and never has

`lambdas/contact/post/handler.py` validated `{name, email, message}` with
pydantic, logged it, and returned it with HTTP 200. It did not send mail and it
did not store anything. `POST /api/contact` does exactly the same, deliberately:
validate, log, 200, with 422 for a malformed body (the status FastAPI gave). No
mail provider, no credential, no database has been added.

So **no message submitted through zudell.io has ever reached anyone.** Making it
deliver is a decision for the owner, and it is small either way:

- **Email it.** A transactional provider (Resend, Postmark, SES) is one API call
  in the route plus one secret in the deployment. Needs an account, a verified
  sender domain, and SPF/DKIM records on zudell.io.
- **Store it.** A table and a page to read it. Needs a database the app can
  reach; there is already a Postgres cluster in the account.
- **Neither.** Drop the form and leave the `mailto:` link, which is what the live
  contact page does today. Then the route can go too.

Whichever way it goes, a public unauthenticated form wants a rate limit and
spam defence before it is worth having.
