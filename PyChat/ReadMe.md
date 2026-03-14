# Overview

As a software engineer, I am always looking for ways to deepen my understanding of how computers communicate with each other at a low level. Most modern applications — messaging apps, multiplayer games, collaborative tools — rely on networking under the hood, and I wanted to experience that firsthand by building something from scratch rather than just reading about it.

PyChat is a real-time terminal chat application built in Python using TCP sockets and threading. A central server accepts multiple client connections simultaneously, and connected users can announce themselves, broadcast messages to the room, and check who is online — all in real time.

To use PyChat, you need to run two programs:

1. **Start the server first** — open a terminal and run `python server.py`. The server will start listening on port 54321.
2. **Connect clients** — open a second terminal (and a third for a second user) and run `python client.py` in each. Once connected, use the following commands:
   - `JOIN:<your name>` — enter the chat room and announce yourself
   - `MESSAGE:<text>` — broadcast a message to everyone online
   - `LIST` — see who is currently connected
   - `quit` — disconnect and exit

My purpose in writing this software was to move beyond theoretical knowledge of networking concepts like TCP, ports, and the client-server model and actually implement them in working code. I wanted to understand how blocking socket calls work, why threads are necessary for handling multiple clients, and how to keep shared data safe across threads using locks.

[Software Demo Video](https://drive.google.com/file/d/1sOQHxrybgLU1SMoxep3wcCU0G5k3YFu1/view?usp=sharing)

# Network Communication

PyChat uses the **Client-Server** architecture. The server (`server.py`) acts as the central hub — it accepts connections from multiple clients and is responsible for routing messages between them. Each client (`client.py`) connects to the server, sends requests, and receives responses. Clients do not communicate directly with each other.

PyChat uses **TCP** (`socket.SOCK_STREAM`) to ensure that messages are delivered reliably and in order. This is important for a chat application where lost or out-of-order messages would be confusing to users. The server listens on port **54321**.

Messages between the client and server follow a simple **prefix-based text format**:

| Message Format     | Direction       | Meaning                                         |
| ------------------ | --------------- | ----------------------------------------------- |
| `JOIN:<username>`  | Client → Server | Register a username and enter the chat room     |
| `MESSAGE:<text>`   | Client → Server | Broadcast a message to all connected users      |
| `LIST`             | Client → Server | Request a list of all currently online users    |
| `[PyChat] ...`     | Server → Client | Server system messages (welcome, announcements) |
| `[username]: text` | Server → Client | Chat message broadcast from another user        |

# Development Environment

I developed PyChat using **Visual Studio Code** as my code editor. I used three separate terminal windows within VSCode simultaneously — one for the server and two for client instances — to test multi-client communication in real time.

The project is written entirely in **Python 3**. No external packages or installations are required. The following built-in Python libraries were used:

- `socket` — for creating and managing TCP connections
- `threading` — for handling multiple clients concurrently on the server side and for the background receive loop on the client side
- `sys` — for clean program exit when the server disconnects

# Useful Websites

- [Python Official Documentation - socket](https://docs.python.org/3/library/socket.html)
- [Python Official Documentation - threading](https://docs.python.org/3/library/threading.html)
- [Real Python - Socket Programming in Python](https://realpython.com/python-sockets/)
- [Wikipedia - OSI Model](https://en.wikipedia.org/wiki/OSI_model)
- [Wikipedia - Client-Server Model](https://en.wikipedia.org/wiki/Client%E2%80%93server_model)

# Future Work

- Add a simple graphical user interface (GUI) using Tkinter so users are not limited to the terminal
- Implement private messaging so users can send a direct message to one specific person rather than broadcasting to everyone
- Add basic username authentication with a password so not just anyone can join the chat room
