---
title: One True Pingus
summary: A custom module to facilitate multiplayer synchronization in Godot 4.x
date: 2026-05-25
tags: [Personal Project, Networking, GDScript, Godot, Open Source]
genai: some
status: completed :3
source: https://github.com/fennylol/multi-player-coupler
favorite: true
---

A Godot utility for managing an arbitrary number of UDP connections as a
pure, relay-server-free peer-to-peer mesh. Built directly on
`PacketPeerUDP` rather than Godot's high-level multiplayer API. Used in
[Tournamancy](/projects/tournamancy).

*To read about why and how this project was developed, read [this write-up](/blog/on-the-pingus).*

## Connection lifecycle

Each peer moves through three states:

- **NOT_STARTED**: not yet contacted.
- **INFORMING**: announcing itself, awaiting a response.
- **CONNECTED**: handshake complete, data flows both ways.

Connected peers are held open with periodic keepalives and dropped on
timeout.

## NAT traversal

Discovers its own external IP:port via STUN, allowing peers behind separate
routers to connect without port forwarding. The STUN client was written
with AI assistance. See the [AI policy](/ai#what-the-badges-mean) for what that means across
this site.

## Public API

**Signals**
- `received_data(sender_id, data_type, data)`: emitted when a packet arrives.
  The `data_type` parameter is defined by the calling application, except for the reserved `CONTROL` type, which is used internally to repor status and diagnostics.
- `connection_established(sender_id, address, port)`: emitted when a peer's state changes to `CONNECTED`, meaning the handshake is complete.

**Key methods**
- `add_peer(target_addr, target_port, target_id = 0)`: registers a peer for tracking and initiates the connection handshake.
- `send_data(data_type, data)`: sends typed application data to every peer currently in the `CONNECTED` state.
- `get_addr_port(external = true)`: returns the address and port of the local instance. 
  `external` controls whether the external or local address is retured.

**Key properties**
- `Peers: Array[PingusPeer]`: all known peers, regardless of connection state.
- `NetworkID: int`: a randomly generated identifier that distinguishes this instance's traffic on the network.
- `ExternAddr` / `ExternPort`: the externally-facing address and port of this instance, once discovered.

## To-do

- Enable simultaneous WAN and LAN connections.
- Support a host/client mode as an alternative to the full mesh: still peer-to-peer, but with one peer designated as the host.

