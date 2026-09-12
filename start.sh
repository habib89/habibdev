#!/bin/bash
# Portfolio HTTPS Server Launcher
# Usage: ./start.sh [port]

PORT=${1:-4433}
DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$DIR"

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "[!] openssl not found. Installing..."
    sudo apt-get update && sudo apt-get install -y openssl
fi

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "[!] python3 not found. Please install Python 3."
    exit 1
fi

echo "Starting Habib Portfolio on port $PORT..."
python3 serve_https.py "$PORT"
