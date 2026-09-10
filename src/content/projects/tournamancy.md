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

Tournamancy is a multiplayer first-person arena shooter about wizards dueling to hone their magical craft.
Movement is fast: running, jumping, and flying through the arena, Synth City, to line up a shot or get out of one.
Opponents empty their pockets on knock-out; getting knocked out empties your own.
Inevitably, one wizard will accumulate such a trove of mystical curios that they will become unstoppable and the greatest in the land.

<!-- *To read about why and how this project was developed, read [this write-up](/blog/on-tournamancy).* -->

## Prisms
The main objective of the game is to accumulate spells, grow in strength, and snowball a lead into a victory.
You gather spells by opening prisms.
These spawn randomly around the map and hold a random selection of spells to take and add to your inventory.
Any time an opponent is knocked out, a random selection of spells from their inventory drops as a prism for the victorious wizard to loot.


## Active Spells
A wizard can wield up to two active spells, each with a cooldown.
Some are weapons, some are illusions, some protect you from incoming attacks.
Throw fireballs and disco balls, teleport to close the gap (or create one), summon land beneath your feet, or focus the energy of a dying star. 

Ten actives are implemented so far: Celestial Anchor, Crimson Thorn, Great Ball O' Fire, Iron Body, Lunar Towline, Polytope Party, Pulsar's Breath, Shockstar Disco, Starlight Blink, and Thunderwave.


## Passive Spells
A wizard can empower themselves with any number of passive spells, each a small, stacking effect that lasts until the wizard is knocked out.
Multiple copies of the same passive increase its effectiveness, or dull its detriment.
The passives cover stat boosts, damage-type modifiers, and more. 


## Anatomy of a Spell
The `Spell` system is data-driven, built so that a new `Spell` is easy to create, difficult to mess up, and replicates cleanly over the network.
Each `Spell` is a registry entry holding its name, description, icon, and script, plus the `Effect` and `Familiar` lists, whose contents are described below.
The script implements a fixed set of lifecycle hooks: equip, update, activate, unequip.
Script templates exist for each spell type.
Creating a new one is merely filling in a standardized interface rather than building each `Spell`'s from scratch.

Every visual and auditory `Effect` is split into a first-person and a third-person variant so it replicates cleanly over the network.
What the caster sees and hears might differ from what everyone else does.

Any independent entity a `Spell` spawns, projectiles or minions for example, is a `Familiar`.
They are replicated across the network identically; everyone is viewing the giant fireball from third-person, after all.

Multiplayer runs on [One True Pingus](/projects/one-true-pingus), a UDP peer-to-peer mesh built alongside this project, with no dedicated server.


Keyboard/mouse and controller are both supported; button rebinding is planned but not yet implemented.

Built in Godot 4, with assets from Blender, Aseprite, and Procreate.
No generative AI was used in its development. See the [AI policy](/ai#what-the-badges-mean).
