---
title: Tournamancy
summary: A multiplayer first-person boomer shooter where wizards knock each other out to steal spells.
date: 2026-05-15
tags: [Personal Project, GDScript, Godot, Open Source, Linux Executable, Windows Executable, No GenAI]
status: in development :]
source: https://github.com/fennylol/tournamancy
featured: false
---

A multiplayer first-person boomer shooter where you play as a wizard honing
your spellcrafting through friendly competition. Knock out opponents to
collect their spells, get knocked out and come back with more, until one
wizard stands above the rest.

- **Fast-paced movement** — move, jump, and fly through Synth City to
  outmaneuver opponents.
- **Spells as weapons and powerups** — looted from knocked-out opponents,
  or from prisms that spawn randomly across the map.
- **Free-for-all multiplayer** over a peer-to-peer mesh.

## Spells

Two kinds. A wizard carries up to two **active** spells, triggered on a
button and gated by a cooldown, plus any number of **passive** spells, each
a small permanent effect lasting until knockout.

Ten actives are implemented so far — Celestial Anchor, Crimson Thorn, Great
Ball O' Fire, Iron Body, Lunar Towline, Polytope Party, Pulsar's Breath,
Shockstar Disco, Starlight Blink, and Thunderwave — alongside passives
covering stat boosts, damage-type modifiers, and movement.

The system is data-driven. Each spell is a registry entry (name,
description, icon, script, effects, familiars) plus a script implementing a
fixed set of lifecycle hooks: equip, update, activate, unequip. Effects are
split between first-person and third-person, so what the owning player sees
differs from what everyone else sees. Script templates cover each spell
type, so adding one means filling in hooks rather than wiring plumbing.

## Networking

Runs on [One True Pingus](/projects/one-true-pingus), the UDP peer-to-peer
mesh built alongside it.

## Controls

Keyboard and mouse or controller, supported throughout. Rebinding is
planned.

## Credits

Made in Godot 4, with assets created in Blender, Aseprite, and Procreate.
All code and assets were made by humans — no generative AI.
