---
title: Tournamancy
summary: A multiplayer first-person boomer shooter where wizards knock each other out to steal spells.
date: 2026-05-15
tags: [Personal Project, GDScript, Godot, Open Source, Linux Executable, Windows Executable]
genai: none
status: in development :]
source: https://github.com/fennylol/tournamancy
favorite: false
---

Tournamancy is a multiplayer first-person shooter about wizards knocking
each other out to steal spells. Movement is fast — running, jumping, and
flying through the arena, Synth City, to line up a shot or get out of one.
Knocking out an opponent takes their spells; getting knocked out gives up
your own. The last wizard still holding any spells wins.

## Spells

A wizard carries up to two active spells, each triggered on a button and
gated by a cooldown, plus any number of passive spells, each a small
permanent effect that lasts until the wizard is knocked out. Ten actives
are implemented so far — Celestial Anchor, Crimson Thorn, Great Ball O'
Fire, Iron Body, Lunar Towline, Polytope Party, Pulsar's Breath, Shockstar
Disco, Starlight Blink, and Thunderwave — alongside a set of passives
covering stat boosts, damage-type modifiers, and movement. Spells are
picked up from knocked-out opponents or from prisms that spawn randomly
around the map.

The system is data-driven. Each spell is a registry entry — name,
description, icon, script, effects, familiars — plus a script implementing
a fixed set of lifecycle hooks: equip, update, activate, unequip. First-
and third-person effects are handled separately, so what the caster sees
differs from what everyone else sees. Script templates exist for each
spell type, so adding a new one means filling in hooks rather than wiring
up plumbing from scratch.

Multiplayer runs on [One True Pingus](/projects/one-true-pingus), a UDP
peer-to-peer mesh built alongside this project, with no dedicated server.
Keyboard/mouse and controller are both supported; button rebinding is
planned but not yet implemented.

Built in Godot 4, with assets from Blender, Aseprite, and Procreate. No
generative AI was used in its development — see the [AI page](/ai) for
what that disclosure means across this site.
