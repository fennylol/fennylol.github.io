---
title: On the Pingus
summary: The reason and reasoning behind implementing custom multiplayer net-code.
date: 2026-09-01
tags: []
favorite: true
draft: false
---

In his GDC talk [I Shot You First: Networking the Gameplay of Halo: Reach](https://youtu.be/h47zZrqjgLc), David Aldridge describes multiplayer networking as: "*Technology to help multiple players sustain the belief that they are playing a fun game together.*"

<!-- If your mind's reward pathways are constructed in any way like mine are, you just received a hit of dopamine at reading those words. Programming, to me, is magic that lies somewhere between that of a stage magician and an archmage. Every project is built by the composition of a bunch of little illusions.  -->
If your mind's reward pathways are constructed in any way like mine are, you just received a hit of dopamine at reading those words.
I view programming a bit like a magic show; every time I learn a new trick, pattern, or methodology, it is like adding a new gimmick to my little bag of tricks.

Multiplayer networking was the most exciting little trick I had encountered in a while.

## What is interesting about multiplayer?
---
The unique challenge posed by managing multiple people playing a game together is that each player's game instance must be kept in sync with every other player's in order to maintain the illusion.
Any time a player makes an action, their local machine handles the player character taking that action, then asks every peer in the network to replicate that action on the local entity that represents the acting player. 
There must be some system that facilitates the communication of local actions into the network, and listens for and handles incoming remote actions from the network. 
That system is the tool in your bag of tricks that keeps the multiplayer illusion alive.

## Why make your own?
---
My initial motivation for this project was two-fold: it seemed fun, and it filled a gap my brother and I found with Godot's native multiplayer Framework, which could only ever satisfy any 2 of our 3 major requirements:
1. **Purely peer-to-peer**

    If we make a multiplayer game, we want that game to be freestanding. It should not rely on any specific servers that could shut down without warning. (*More on this later*)
2. **Works without changing router settings**

    Nothing sucks the wind out of a Discord call quite like: "Everyone has to go into their router settings and fiddle with these settings." We wanted it to be seamless, even for non-technical players. 
    This ruled out Universal Plug-N-Play (an unsafe protocol that should be avoided anyway) and Port-Forwarding.
3. **Freestanding Godot**

    While many Godot plugins amended the native multiplayer API to allow the first two points, growing comfortable with a plugin that may stop being supported or updated was something we hoped to avoid.

Rolling our own net-code seemed to provide both an engaging challenge and an exciting opportunity to custom tailor a utility to our specific needs.

## The Pingus
---
Initially, `OneTruePingus` began as an even simpler idea than a multiplayer synchronizer: a pure peer-to-peer NAT traverser; the humble `Pingus`.
The first problem any networking code needs to solve is the residential NAT: home routers only allow traffic in that is responding to traffic that originated from inside the network.
Meaning to establish a connection between two peers, both have to be the "first one to talk". 
Assuming some pre-established channel to communicate information manually (text, a voice call, carrier pigeon, etc), this would be a trivial problem to solve: both parties swap network addresses and ports, then begin sending each other packets.
Any packets arriving would be rejected until the first packet has been sent, at which point the router will assume any subsequent packets are "in response" to that initial outbound packet.
NAT traversed, connection established, easy as that! 

In reality, there is a problem that the prior example assumed had already been solved: how do players discover their own external network addresses?
Discovering network addresses is easy, there is a large variety of servers (such as [IPify](https://www.ipify.org/)) which will respond to any traffic with a simple JSON object that contains your network address.
The difficult part is discovering the external port that your router has mapped to your process.
This is where the `Pingus` comes in: there are only 65,535 ports available to be mapped... why not check all of them?
Modern computers are fast enough that spraying ~6,000 packets is trivial; given a target address, you could check every possible port in around 10 seconds.
With two peers spraying every possible port every ten seconds, a match was guaranteed within twenty seconds, or so we thought.
I tested the system locally by connecting two processes running on my computer together.
The next step was to take it to the real internet, and it worked perfectly!
My brother (who lived in Ohio) and I (in New York) could establish a connection without our computers knowing what external port our routers had mapped!

## The PingusPrime
---
It was at this point we realized the potential: if we could establish a connection, it would take only a slight bit of modification and extension to put it to use.
Thus was born the `PingusPrime`.
The user's application would provide the data encoded as raw binary and the data type as an `enum`, and the `PingusPrime` would handle sending it over the network.
At this point, we had stood up a simple test case (an early iteration of [Tournamancy](/projects/tournamancy)) which would synchronize our position and rotation.
This was a legitimate multiplayer... experience. 
It would be a bit of a stretch to call it a "game", but you and your friends could connect, move around, and see each other move; all on hand-built code!
Unfortunately, there was a fundamental issue lurking: while `Pingus` (and by extension `PingusPrime`) worked fine on local networks and on strong connections, when it came to testing in a real world environment (roping my friends into testing an executable I sent to them) we discovered that I had accidentally created a self-DDoS machine.
For slower connections, sending 6,000 packets per second would consume the entirety of their rural home network's bandwidth and disconnect every device in their house until the `PingusPrime` was killed. (Sorry, Blaine.)
Perhaps some reworking was in order.

## The OneTruePingus
---
Our first attempt to remedy the situation was to lower the spray speed, but there was a balance that must be maintained: too fast, and you overwhelm the router; too slow, and connection attempts stretch for minutes.
Either extreme is fatal.
A network with N peers is `N(N-1)/2` total connections.
Longer than a few seconds per connection is untenable.
Unfortunately, therefore, brute-force searching for the port was off the table.
This directed us to a bit of a compromise on our requirement of the project being **purely peer-to-peer**: we would implement the STUN protocol.
This protocol was very similar to IPify, in that a STUN server would reply to a properly formed STUN request with a response that contained the requester's network address and port. 
This was, in a way, frankly an improvement in terms of our first requirement.
Now instead of relying on a single service to provide our network address, we now have any valid STUN server in the world available to us.

## How it Works
---
Under normal operating conditions, `OneTruePingus` will query [a github project](https://github.com/pradt2/always-online-stun.git) that returns a random STUN server address.
The `OneTruePingus` can now be provided with an arbitrary number of address/port targets. 
The `OneTruePingus` creates a `PingusPeer` object to track each connection. 
Each `PingusPeer` begins in the `INFORMING` state and the `OneTruePingus` sends `INFORM` packets to the target.
Once one peer receives an `INFORM` packet, it becomes aware of the peer and changes that `PingusPeer`'s state to `CONNECTED` and stops sending `INFORM` packets after sending one last burst.
At this point, whenever the application using `OneTruePingus` wishes to communicate, it can use `send_data()` to send arbitrary binary data to all connected peers.
The application is responsible for both encoding and decoding the data to/from binary.


## Edge Cases
---
1. **What if the STUN server repo goes offline?**

    To ensure longevity, we offer the ability to target a specific STUN server in the event pradt2's github project goes offline.
    Beyond that, the `OneTruePingus` can also be passed a network address and port at construction time, allowing for the module to remain operational even in the unlikely event the STUN protocol is no longer usable.

2. **What if one peer changes to `CONNECTED` before its peer has a chance to change?**

    In our testing, this rarely came up.
    Often due to network round trip time, many `INFORM` packets would be sent by both peers before either had a chance to become aware of the connection and stop sending.
    However, in the rare case (often found in exceedingly fast connections, such as LANs) where it does happen, there is a special kind of packet: `TWO_GENERALS`.
    These packets will be sent in response to `INFORM` packets when a `PingusPeer` is already in the `CONNECTED` state.
    If a `PingusPeer` is `INFORMING` and receives a `TWO_GENERALS`, it knows its peer is already `CONNECTED` and it is safe to also transition to `CONNECTED`.

## Future Work
---
Although the `OneTruePingus` is fully functional in its current state, there are a few key issues I plan to address.
As it stands, each peer is connected to every other peer directly; when a new player connects to the network, all existing peers are informed of the new address and port so they may begin establishing a connection.
Unfortunately, this presents a fatal issue with networks that span both LAN and WAN. 
If two peers connect using local addresses, that local address will be shared to the network, despite being totally unusable.
Fortunately, the solution to this brings with it other benefits besides network flexibility: The Host and Client model.
The standard way to construct a multiplayer network is not a fully connected mesh.
Instead, one player in the network is designated "host", and every peer other connects only to them.
All information sent to the host is propegated to all the other clients, allowing for all players to remain in sync while reducing the total network strain. 
Additionally, this makes cheat prevention possible (currenly a low priority issue for us as this is meant to be a game played between friends).
For cheating to be detected and prevented, there must be one source of truth.
In a mesh model, a single source of truth is impossible; but in a host/client model, the host's instance of the game is considered the ground truth that is replicated to each client's instance. 

Despite those two minor limitations, `OneTruePingus` is able to maintain the illusion that we're all playing together, even Blaine on his easily DDoS-able WiFi.
