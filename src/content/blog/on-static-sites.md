---
title: Why this site is just files
summary: A short note on the appeal of a site that's nothing but pre-built HTML sitting on a disk somewhere.
date: 2026-08-28
tags: [meta, web]
draft: false
---

There's no database here. No server rendering a page when you ask for it. The
whole site is built once — on my machine or in CI — into a folder of plain
HTML, CSS, and images, and that folder is what gets served.

That means it's fast (nothing to compute), cheap (static hosting is free), and
hard to break (there's no runtime to fall over). The trade is that every change
needs a rebuild. For a personal site, that's a trade worth making.

This is the second post, which exists mostly so the previous/next links at the
bottom have somewhere to point.
