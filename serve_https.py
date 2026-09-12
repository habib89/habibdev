#!/usr/bin/env python3
"""
HTTPS Server untuk Portfolio Habib
Generates self-signed SSL cert and serves files over HTTPS.
Usage: python3 serve_https.py [port]
Default port: 4433
"""

import http.server
import ssl
import os
import sys
import subprocess
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4433
DIR = Path(__file__).parent
CERT_FILE = DIR / "cert.pem"
KEY_FILE = DIR / "key.pem"


def generate_cert():
    """Generate self-signed SSL certificate."""
    if CERT_FILE.exists() and KEY_FILE.exists():
        print("[*] SSL certificate already exists.")
        return

    print("[*] Generating self-signed SSL certificate...")
    subprocess.run([
        "openssl", "req", "-x509", "-newkey", "rsa:2048",
        "-keyout", str(KEY_FILE),
        "-out", str(CERT_FILE),
        "-days", "365", "-nodes",
        "-subj", "/C=ID/ST=Indonesia/L=Jakarta/O=Habib Freelancer/CN=localhost"
    ], check=True, capture_output=True)
    print("[+] SSL certificate generated successfully.")


def run_server():
    """Start HTTPS server."""
    handler = http.server.SimpleHTTPRequestHandler
    httpd = http.server.HTTPServer(("0.0.0.0", PORT), handler)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=str(CERT_FILE), keyfile=str(KEY_FILE))
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print(f"\n{'='*50}")
    print(f"  HABIB PORTFOLIO - HTTPS SERVER")
    print(f"{'='*50}")
    print(f"  URL    : https://localhost:{PORT}")
    print(f"  Network: https://{get_ip()}:{PORT}")
    print(f"  Dir    : {DIR}")
    print(f"{'='*50}")
    print(f"  Press Ctrl+C to stop the server\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
        httpd.shutdown()


def get_ip():
    """Get local IP address."""
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


if __name__ == "__main__":
    os.chdir(DIR)
    generate_cert()
    run_server()
