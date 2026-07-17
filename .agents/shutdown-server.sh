#!/bin/bash
set -e

echo "Running post-session cleanup..."

# Find and kill any Python HTTP server running on port 8000 or 8001
for port in 8000 8001; do
  PID=$(lsof -t -i:$port || true)
  if [ -n "$PID" ]; then
    echo "Shutting down development server on port $port (PID: $PID)..."
    kill $PID || kill -9 $PID
  fi
done

echo "Cleanup completed successfully."
exit 0
