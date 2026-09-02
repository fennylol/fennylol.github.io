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
high-level multiplayer API, just raw packets over `PacketPeerUDP`. Now used
in [Tournamancy](/projects/tournamancy).

## Connection lifecycle

Each peer moves through three states:

- **NOT_STARTED** — not yet contacted.
- **INFORMING** — actively announcing itself and waiting to hear back.
- **CONNECTED** — handshake complete; data can flow both ways.

Connected peers are kept alive with periodic keepalive packets and dropped
if they go quiet past a timeout.

## NAT traversal

The module automatically discovers its own external IP:port combination via
STUN, so two peers behind separate routers can find each other without any
port forwarding.

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
