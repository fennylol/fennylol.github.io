---
title: Literally this website
subtitle: you'd never believe me if i told you
summary: A personal site for projects, write-ups, and a résumé, built with Astro, hosted on GitHub Pages, and mostly free of client-side JavaScript.
date: 2026-09-01
tags: [Personal Project, Astro, TypeScript, Open Source, Website]
genai: used
status: live :O
link: /
source: https://github.com/fennylol/fennylol
favorite: false
---


The site exists to give projects, write-ups, and a résumé one place to live, instead of pages split across itch.io, GitHub, and PDF exports. The goal was minimal but current: visual restraint without looking dated, closer in spirit to the mostly-static pages of the early-2000s web than to a typical single-page application. Lightweight and fast were treated as requirements, not incidental properties.

That shows up directly in the build. Every page is generated at build time and served as plain HTML, with no client-side framework and no application shell. JavaScript is scoped to isolated, page-specific behavior rather than running the site.

Content is treated as structured data rather than code. Projects, write-ups, and résumé entries each live in a schema, validated at build time, so adding or editing content can't silently produce a broken or incomplete page. Publishing is a content change, not a code change.

The résumé page extends that model a step further. Rather than maintaining separate exported versions, a single data source can be filtered down to a specific subset of entries, with the resulting selection encoded directly into the URL. Sharing a particular configuration requires no server or storage; the link is the configuration.

The same content-as-data approach applies to disclosure: every project's generative-AI involvement is a required field, not an afterthought. This project is marked "Used GenAI". Specifics are on the [AI policy](/ai).

Built with Astro 5 and TypeScript, and deployed to GitHub Pages via GitHub Actions. Development involved substantial use of Claude Code for architecture and implementation.
