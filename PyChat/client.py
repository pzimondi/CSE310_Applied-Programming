"""
client.py - PyChat TCP Chat Client
====================================
Author : Pastor Munashe Zimondi
Course : CSE 310 – Applied Programming
Module : Networking

This is the client side of PyChat. It connects to the server over TCP and
lets the user send three types of requests:

    JOIN    – register a username with the server
    MESSAGE – send a chat message to everyone in the room
    LIST    – see who is currently online
    quit    – close the connection and exit

The client uses a background thread to receive incoming messages from the
server continuously, while the main thread waits for the user to type.

Usage:
    python client.py
"""

import socket
import threading
import sys

# ── Configuration — must match server.py ─────────────────────────────────────
HOST = "127.0.0.1"
PORT = 54321


def receive_messages(sock):
    """
    Runs in a background thread. Waits for data from the server
    and prints it to the terminal as soon as it arrives.
    """
    while True:
        try:
            raw = sock.recv(1024)
            if not raw:
                # Server closed the connection
                print("\n[PyChat] Disconnected from server.")
                sys.exit(0)

            # Print on its own line so it doesn't interrupt the user's typing
            print(raw.decode(), end="", flush=True)

        except OSError:
            # Socket was closed from the main thread (user typed 'quit')
            break


def show_help():
    """Print a quick reference card so the user knows what to type."""
    print("\n┌─────────────────────────────────────────┐")
    print("│           PyChat – Command Guide         │")
    print("├─────────────────────────────────────────┤")
    print("│  JOIN:<your name>   – enter the chat     │")
    print("│  MESSAGE:<text>     – send a message     │")
    print("│  LIST               – who's online?      │")
    print("│  quit               – leave PyChat       │")
    print("└─────────────────────────────────────────┘\n")


def start_client():
    """Connect to the server and start the send/receive loop."""

    # Create a TCP socket (IPv4, stream-based — same as server)
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((HOST, PORT))
    except ConnectionRefusedError:
        print(f"[ERROR] Could not reach the server at {HOST}:{PORT}.")
        print("        Make sure server.py is running first.")
        sys.exit(1)

    print("╔══════════════════════════════════════════╗")
    print("║     Welcome to PyChat – TCP Edition      ║")
    print("╚══════════════════════════════════════════╝")
    print(f"Connected to server at {HOST}:{PORT}")
    show_help()
    print("Tip: start with  JOIN:<your username>  to enter the room.\n")

    # Kick off the background thread that listens for server messages
    recv_thread = threading.Thread(target=receive_messages, args=(client_socket,), daemon=True)
    recv_thread.start()

    # Main loop — read input from the user and send it straight to the server
    try:
        while True:
            user_input = input()   # blocks here until the user presses Enter

            if not user_input.strip():
                continue   # ignore blank lines

            if user_input.strip().lower() == "quit":
                print("[PyChat] Leaving the chat. See you next time!")
                break

            if user_input.strip().lower() == "help":
                show_help()
                continue

            # Send whatever the user typed to the server
            client_socket.sendall(user_input.encode())

    except KeyboardInterrupt:
        print("\n[PyChat] Caught Ctrl+C — disconnecting.")

    finally:
        client_socket.close()


if __name__ == "__main__":
    start_client()