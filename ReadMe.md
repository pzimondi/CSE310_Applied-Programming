# PyChat – Real-Time TCP Chat Application

A Python client-server chat application built from scratch using TCP sockets and threading. Multiple clients can connect to a central server simultaneously, announce themselves, broadcast messages to the room, and check who is online — all in real time from the terminal.

---

## 🎥 Demo Video

> [Click here to watch the demo video](#) ← _(replace this link with your video URL before submitting)_

---

## Overview

| Field         | Details                                                          |
| ------------- | ---------------------------------------------------------------- |
| **Course**    | CSE 310 – Applied Programming                                    |
| **Module**    | Networking                                                       |
| **Author**    | Pastor Munashe Zimondi                                           |
| **Language**  | Python 3                                                         |
| **Protocol**  | TCP (socket.SOCK_STREAM)                                         |
| **Libraries** | `socket`, `threading`, `sys` (all built-in — no installs needed) |

---

## Features

- **Multi-client support** — the server handles as many clients as connect, each in its own thread
- **Three request types:**
  - `JOIN:<username>` — enter the chat room and announce yourself to everyone
  - `MESSAGE:<text>` — broadcast a message to all connected users
  - `LIST` — see a live list of who is currently online
- **Real-time receiving** — a background thread on the client side means incoming messages appear instantly without interrupting your typing
- **Graceful disconnection** — the server detects when a client leaves (cleanly or abruptly) and notifies the room

---

## Repository Structure

```
PyChat/
├── server.py      # TCP server — run this first
├── client.py      # TCP client — run one per user
└── README.md      # This file
```

---

## How to Run

### Prerequisites

- Python 3.7 or higher
- No external packages required

### Step 1 — Start the server

Open a terminal and run:

```bash
python server.py
```

You should see:

```
[SERVER] PyChat server is running on 127.0.0.1:54321
[SERVER] Waiting for clients to connect ...
```

### Step 2 — Connect a client

Open a **second terminal** and run:

```bash
python client.py
```

### Step 3 — Connect a second client (to test broadcasting)

Open a **third terminal** and run:

```bash
python client.py
```

### Step 4 — Start chatting

In each client terminal, type commands and press Enter:

```
JOIN:Munashe
MESSAGE:Hello everyone!
LIST
quit
```

---

## Example Session

**Client 1 terminal:**

```
> JOIN:Munashe
[PyChat] Welcome, Munashe! Type MESSAGE:<text> to chat or LIST to see who's online.
> LIST
[PyChat] Users currently online:
  • Munashe
  • Alice
> MESSAGE:Hey Alice!
[You]: Hey Alice!
[Alice]: Hey Munashe, what's up!
> quit
[PyChat] Leaving the chat. See you next time!
```

**Client 2 terminal (Alice):**

```
> JOIN:Alice
[PyChat] Welcome, Alice!
[PyChat] *** Munashe has joined the chat ***
[Munashe]: Hey Alice!
> MESSAGE:Hey Munashe, what's up!
```

---

## Networking Concepts Demonstrated

| Concept                            | Where Used                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------- |
| TCP (SOCK_STREAM)                  | `socket.socket(AF_INET, SOCK_STREAM)` in both files                        |
| `bind()` / `listen()` / `accept()` | `server.py` — `start_server()`                                             |
| `connect()` / `send()` / `recv()`  | `client.py` — `start_client()`                                             |
| Multi-threading                    | One thread per client on the server; one receive thread on the client      |
| Client-Server model                | server.py is the hub; client.py instances are the spokes                   |
| Graceful error handling            | `ConnectionResetError`, `BrokenPipeError`, `KeyboardInterrupt` all handled |
| Thread safety                      | `threading.Lock()` protects the shared `clients` dictionary                |

---

## Module Requirements Checklist

### Common Requirements

- [x] Software written from scratch (not a tutorial copy)
- [x] All code documented with comments
- [x] README.md fully filled out
- [x] 4–5 minute demo video with talking head _(link above)_
- [x] Published in a public GitHub repository

### Unique Networking Requirements

- [x] Client sends a request; server sends a response back
- [x] Uses TCP
- [x] **Additional:** Supports at least 3 different request types (JOIN, MESSAGE, LIST)
- [x] Two separate programs: `server.py` and `client.py`

---

## What I Learned

Building PyChat taught me how TCP sockets actually work at the code level — not just as a concept. The trickiest part was managing shared state (the `clients` dictionary) safely across multiple threads using a `Lock`. I also learned that `recv()` is a blocking call, which is why a background thread on the client is necessary to keep the UI responsive while waiting for incoming messages. The project gave me a genuine appreciation for what chat apps like Slack or Discord are doing under the hood.

---

## License

This project was created for educational purposes as part of CSE 310 at BYU-Idaho.
