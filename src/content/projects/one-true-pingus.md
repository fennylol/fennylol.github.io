---
title: One True Pingus
summary: A custom module to facilitate multiplayer synchronization in Godot 4.x
date: 2025-04-25
tags: [Personal Project, Networking, GDScript, Godot, Open Source]
genai: some
status: completed :3
source: https://github.com/fennylol/multi-player-coupler
featured: true
---

A Godot utility for managing an arbitrary number of UDP connections as a
pure, relay-server-free peer-to-peer mesh. Built directly on
`PacketPeerUDP` rather than Godot's high-level multiplayer API. Used in
[Tournamancy](/projects/tournamancy).

## Connection lifecycle

Each peer moves through three states:

- **NOT_STARTED** — not yet contacted.
- **INFORMING** — announcing itself, awaiting a response.
- **CONNECTED** — handshake complete; data flows both ways.

Connected peers are held open with periodic keepalives and dropped on
timeout.

## NAT traversal

Discovers its own external IP:port via STUN, so peers behind separate
routers connect without port forwarding.

## Public API

**Signals**
- `received_data(sender_id, data_type, data)` — Emitted upon receipt of a
  packet. The `data_type` parameter is defined by the calling application,
  with the exception of the reserved `CONTROL` type, which is used
  internally to report status and diagnostic information.
- `connection_established(sender_id, address, port)` — Emitted when a
  peer's connection state transitions to `CONNECTED`, indicating that the
  handshake has completed successfully.

**Key methods**
- `add_peer(target_addr, target_port, target_id = 0)` — Registers a peer
  for tracking and initiates the connection handshake.
- `send_data(data_type, data)` — Transmits typed application data to all
  peers currently in the `CONNECTED` state.
- `get_addr_port(external = true)` — Returns the address and port of the
  local instance. When `external` is true, the externally-facing address
  is returned; otherwise, the local address is returned.

**Key properties**
- `Peers: Array[PingusPeer]` — Contains all known peers, regardless of
  connection state.
- `NetworkID: int` — A randomly generated identifier used to distinguish
  this instance's traffic on the network.
- `ExternAddr` / `ExternPort` — The externally-facing address and port of
  this instance, once discovered.

## To-do

- Enable simultaneous WAN and LAN connections.
- Support a host/client architecture mode as an alternative to the
  peer-to-peer mesh — still peer-to-peer, but with one peer designated as
  the dedicated host.
