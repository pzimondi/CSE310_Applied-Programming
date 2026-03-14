"""
server.py - PyChat TCP Chat Server
===================================
Author : Pastor Munashe Zimondi
Course : CSE 310 – Applied Programming
Module : Networking

This is the server side of PyChat. It listens for incoming TCP connections
and spins up a dedicated thread for each client that connects. It supports
three request types that clients can send:

    JOIN    – announce a username when connecting
    MESSAGE – broadcast a message to every connected user
    LIST    – ask for a list of everyone currently online

Usage:
    python server.py
    (then connect clients using client.py)
"""

import socket
import threading

# ── Configuration ────────────────────────────────────────────────────────────
HOST = "127.0.0.1"   # localhost — change to "0.0.0.0" to accept remote clients
PORT = 54321         # any unused port above 1024 is fine

# ── Shared state (protected by a lock so threads don't trip over each other) ──
clients_lock = threading.Lock()
clients = {}   # maps  socket -> username


def broadcast(message, exclude=None):
    """Send a message to every connected client except the one in 'exclude'."""
    with clients_lock:
        for client_socket in list(clients.keys()):
            if client_socket is exclude:
                continue
            try:
                client_socket.sendall(message.encode())
            except OSError:
                # The socket went away — remove it quietly
                clients.pop(client_socket, None)


def list_users():
    """Return a neat string listing everyone who is online right now."""
    with clients_lock:
        names = list(clients.values())

    if not names:
        return "  (nobody is online right now)"

    lines = [f"  • {name}" for name in names]
    return "\n".join(lines)


def handle_client(client_socket, address):
    """
    Runs in its own thread — one thread per connected client.
    Reads messages in a loop and acts on the three request types.
    """
    print(f"[SERVER] New connection from {address}")
    username = "unknown"

    try:
        while True:
            # recv() blocks here until data arrives (or the socket closes)
            raw = client_socket.recv(1024)
            if not raw:
                # Empty bytes means the client closed the connection cleanly
                break

            message = raw.decode().strip()

            # ── Request type 1: JOIN ─────────────────────────────────────────
            # Format the client sends:  JOIN:<username>
            if message.startswith("JOIN:"):
                username = message[5:].strip() or "anonymous"

                with clients_lock:
                    clients[client_socket] = username

                print(f"[SERVER] {username} joined from {address}")

                # Tell the new user they are in
                client_socket.sendall(
                    f"[PyChat] Welcome, {username}! Type MESSAGE:<text> to chat "
                    f"or LIST to see who's online.\n".encode()
                )

                # Tell everyone else
                broadcast(
                    f"[PyChat] *** {username} has joined the chat ***\n",
                    exclude=client_socket,
                )

            # ── Request type 2: MESSAGE ──────────────────────────────────────
            # Format:  MESSAGE:<text>
            elif message.startswith("MESSAGE:"):
                text = message[8:].strip()

                if not text:
                    client_socket.sendall("[PyChat] Your message was empty - try again.\n".encode())
                    continue

                print(f"[SERVER] {username}: {text}")
                broadcast(f"[{username}]: {text}\n", exclude=client_socket)

                # Confirm to the sender that their message went out
                client_socket.sendall(f"[You]: {text}\n".encode())

            # ── Request type 3: LIST ─────────────────────────────────────────
            # Format:  LIST
            elif message.strip() == "LIST":
                online = list_users()
                client_socket.sendall(
                    f"[PyChat] Users currently online:\n{online}\n".encode()
                )

            # ── Unknown command ──────────────────────────────────────────────
            else:
                client_socket.sendall(
                    b"[PyChat] Unknown command. "
                    b"Use JOIN:<name>, MESSAGE:<text>, or LIST.\n"
                )

    except (ConnectionResetError, BrokenPipeError):
        # Client disappeared without saying goodbye — that's fine
        pass

    finally:
        # Clean up: remove from the clients dict and close the socket
        with clients_lock:
            clients.pop(client_socket, None)

        client_socket.close()
        broadcast(f"[PyChat] *** {username} has left the chat ***\n")
        print(f"[SERVER] {username} disconnected from {address}")


def start_server():
    """Create the listening socket and accept connections forever."""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # SO_REUSEADDR lets us restart the server immediately without waiting
    # for the OS to release the port from the previous run
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    server_socket.bind((HOST, PORT))
    server_socket.listen(10)   # queue up to 10 pending connections

    print(f"[SERVER] PyChat server is running on {HOST}:{PORT}")
    print("[SERVER] Waiting for clients to connect ...\n")

    try:
        while True:
            client_socket, address = server_socket.accept()

            # Each client gets its own thread so they don't block each other
            thread = threading.Thread(
                target=handle_client,
                args=(client_socket, address),
                daemon=True,   # threads die automatically when main program exits
            )
            thread.start()

    except KeyboardInterrupt:
        print("\n[SERVER] Shutting down. Goodbye!")

    finally:
        server_socket.close()


if __name__ == "__main__":
    start_server()