Performance optimization applied 2026-08-21.

- Static HTML pages are cached at the Vercel edge for 24h and can be served stale for 7d while revalidating.
- sitemap.xml and robots.txt receive the same edge caching strategy.
- HTML document size is unchanged; this optimization targets response/TTFB rather than page content.
- SEO page generation remains unchanged.