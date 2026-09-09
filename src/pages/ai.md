---
layout: ../layouts/SimplePage.astro
title: AI Philosophy
description: My stance on generative AI, and how I use it across this site and my projects.
intro: My stance on generative AI, and how I use it across this site and my projects.
updated: 2026-09-09
---

In short: *I believe generative AI is a tool that produces a **product** faster by compressing or eliminating the **process**.*

The value of that trade depends on what the process was for. 
When the process excites me, or the learning is worth more than the time it costs, I would like to do it by hand.
When the process is overhead between me and a result I already understand, I am content to use the tool.

While that heuristic is clean on paper, in the real world it is more of a gradation than a hard line.
What follows lays out where and how I currently aim to apply it.


## When I avoid it
### When I want to learn
If the point of the work is to come out the other side understanding something, generating the answer defeats the point. 
[One True Pingus](/blog/on-the-pingus) is the clearest example. 
The networking model was the thing I wanted to learn, so I built it by hand and kept the tool to the edges.

### When I want to be the one communicating
Some things I want to say, not just have said.
My [write-ups](/blog) are an example. 
The reader would get the same facts from a generated version, but they would not get them from me.
In these instances, I want to do the saying myself.

### When I am the target audience
Some projects I undergo because I want them to exist, not because anyone needs or wants or would benefit from them.
They do not have to speak to anyone else, and it is fine if they do not.
Those projects are meant to be made for and by me.
A generated version would be a different object with the same name.


## When I use it
### As a debugging companion
Debugging can teach regardless of who finds the bug, if I am intentional about learning from it.
The lesson comes from understanding the cause, not from finding it.
The tool shortens the search and still leaves room for understanding.

### As a development companion
When I already know what the correct result looks like and want it produced, or when I want to see the standard way to do something before deciding whether to do it that way, I feel comfortable offloading that work.
[This website](/projects/fennylol-portfolio) was built this way, with Claude Code handling much of the architecture and implementation under direction.

### As a problem solver for one-off work
Some tasks have no tool and are not worth building one for.
I recently had it translate the command block contents of an old Minecraft world into modern syntax.
There were over 600 commands. Redoing them by hand would have taken weeks, and nobody learns anything from doing it.


## What the badges mean
Every project on this site carries one of three labels. The label describes how the project was built and where along the gradation it lies.

- **No GenAI.** Nothing in the project was generated. Design, code, art, and writing are all hand-made. Using an AI tool to look something up, the way I would use a search engine, does not change this label.
- **Some GenAI.** The project is hand-made, with generative AI used for isolated tasks: drafting small artifacts, solving sub-problems, or interacting with specific protocols, standards or APIs. The project page will name what tasks involve AI.
- **Used GenAI.** Generative AI did a substantial share of the implementation. I directed the work, reviewed it, and am responsible for it, but I did not write significant portions.
