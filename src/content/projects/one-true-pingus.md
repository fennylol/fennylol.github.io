---
title: One True Pingus
summary: A custom module to fascilitate multi-player syncronization in Godot 4.x
date: 2025-04-25
tags: [Personal Project, Networking, GDScript, Godot, Open Source]
status: completed :3
source: https://github.com/fennylol/multi-player-coupler
featured: true
---

A lightweight, dependency-free Godot utility for managing an arbitrary
number of peer-to-peer UDP connections — no relay server, no Godot
high-level multiplayer API, just raw packets over `PacketPeerUDP`. Built
for and used in [Tournamancy](/projects/tournamancy).

## Connection lifecycle

Each peer moves through three states:

- **NOT_STARTED** — not yet contacted.
- **INFORMING** — actively announcing itself and waiting to hear back.
- **CONNECTED** — handshake complete; data can flow both ways.

Connected peers are kept alive with periodic keepalive packets and dropped
if they go quiet past a timeout.

## NAT traversal

A companion `AddressGopher` class discovers your external IP:port by
querying a random STUN server pulled from
[pradt2's always-online-stun list](https://github.com/pradt2/always-online-stun),
so two peers behind separate routers can find each other without any port
forwarding.

## Public API

**Signals**
- `received_data(sender_id, data_type, data)` — a packet arrived.
  `data_type` is caller-defined (your own enum), except the reserved
  internal `CONTROL` type used for status/debug messages.
- `connection_established(sender_id, address, port)` — a peer finished the
  handshake and is now `CONNECTED`.

**Key methods**
- `add_peer(target_addr, target_port, target_id = 0)` — start tracking a
  peer and begin the handshake.
- `send_data(data_type, data)` — send typed application data to every
  connected peer.
- `get_addr_port(external = true)` — this instance's own address, external
  (WAN, post-STUN) or local.

**Key properties**
- `Peers: Array[PingusPeer]` — every peer, connected or not.
- `NetworkID: int` — a random ID that disambiguates this instance's traffic
  on the wire.
- `ExternAddr` / `ExternPort` — this instance's external-facing address,
  once discovered.

## Known limitations

Straight from the source's own to-do list: LAN/WAN cross-connections
aren't supported yet — peers need to already be reachable at a known
address:port.
