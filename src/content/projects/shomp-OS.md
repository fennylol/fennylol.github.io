---
title: shompOS
summary: A 32-bit x86 based operating system built from scratch. 
date: 2025-04-25
tags: [Academic Project, C, ASM, Open Source]
genai: none
status: completed :3
source: https://github.com/jacobobendrado/4810-Operating-System
favorite: true
---

shompOS is a small 32-bit x86 operating system, written from scratch in C and a little assembly for a university operating systems course.
GRUB hands off to a multiboot-compliant kernel, which brings the machine up one subsystem at a time: a GDT, an interrupt table, the PIT timer, the keyboard controller, a heap, an in-memory filesystem, and finally a scheduler with a handful of processes already running.
It boots as an ISO in QEMU.

We split the OS into pieces that each stand on their own, partly so it could double as something you can read to learn from.

> ![The GRUB bootloader displaying shompOS as a bootable kernel](/images/shompOS/bootloader.png "The GRUB bootloader displaying shompOS as a bootable kernel")
> The GRUB bootloader displaying shompOS as a bootable kernel

>![Listing the contents of the in-memory file system using ls](/images/shompOS/ls.png "Listing the contents of the in-memory file system using ls")
> Listing the contents of the in-memory file system using ls

## What I worked on
**The terminal and keyboard.**
An IRQ1 keyboard handler with scancode tables and modifier keys, and the `shompOS> ` prompt on top of 80x25 VGA text mode.
Keystrokes feed both the shell's line buffer and the filesystem's STDIN.

**The heap allocator.**
A free list that splits blocks on allocation and merges neighbours back together on free, with `brk`/`sbrk` underneath to grow the heap in chunks.
Nothing clever, but it doesn't leak and it doesn't fragment itself into uselessness.

**Processes and scheduling.**
Process control blocks, context switching in assembly, and preemption driven by the PIT clock, so it's genuinely preemptive rather than cooperative.
Processes clean themselves up on exit and free their own memory, and a PID 0 "backstop" process runs when nothing else can, so the scheduler always has something to switch to.

> ![Running rudimentary processes concurrently](/images/shompOS/processes.png "Running rudimentary processes concurrently")
> Two processes running concurrently. The first of these rudimentary (the right column) counts up from 0x00 to 0xFF, changing text color every number and background color every 0x10 numbers. The second (the left column) merely prints color bands along the side of the screen. \
> The terminal remains responsive as it, and the two processes trade share time on the CPU.


## The rest

The shell has the commands you'd expect: `ls`, `cd`, `cat`, `touch`, `mkdir`, `rm`, and `run`, which goes through an ELF loader to execute programs baked into the ramfs.
There's a hand-rolled freestanding libc for the string and memory routines you don't get for free without an OS under you.

