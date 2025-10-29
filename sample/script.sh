#!/bin/bash
# Sample Shell script for Regex-LE testing
# Test patterns: /\$(\w+)/g, /(\w+)\(\)/g, /"\$\{(\w+)\}"/g

# Variables
APP_NAME="MyApplication"
VERSION="1.0.0"
PORT=8080
DEBUG=true

# Paths
SCRIPT_DIR=$(dirname "$0")
CONFIG_FILE="./config/app.conf"
LOG_FILE="/var/log/app.log"
DATA_DIR="../data"

# Functions
start_server() {
  echo "Starting server on port $PORT"
  ./bin/server --port=$PORT --config="$CONFIG_FILE"
}

stop_server() {
  echo "Stopping server"
  pkill -f "server"
}

check_status() {
  if pgrep -f "server" > /dev/null; then
    echo "Server is running"
    return 0
  else
    echo "Server is not running"
    return 1
  fi
}

# Variable references
echo "Application: ${APP_NAME}"
echo "Version: $VERSION"
echo "Port: ${PORT}"
echo "Debug: $DEBUG"

# Path operations
if [ -f "$CONFIG_FILE" ]; then
  echo "Config found: $CONFIG_FILE"
fi

if [ -d "$DATA_DIR" ]; then
  echo "Data directory: $DATA_DIR"
fi

# Command execution
export PATH="/usr/local/bin:$PATH"
export PYTHONPATH="/opt/python/lib:$PYTHONPATH"

# Process IDs
SERVER_PID=$(pgrep -f server)
if [ -n "$SERVER_PID" ]; then
  echo "Server PID: $SERVER_PID"
fi

# URLs
API_URL="https://api.example.com/v1"
CDN_URL="https://cdn.example.com/assets"

# Comments
# TODO: Add error handling
# FIXME: Fix path resolution
# NOTE: Update configuration

