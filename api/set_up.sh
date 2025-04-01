#!/bin/bash

echo "Starting express.js..."
node /var/www/html/NewsHub/api/express.js &

echo "Waiting 5 seconds before starting main.py..."
sleep 5
echo "Starting main.py..."

python3 /var/www/html/NewsHub/api/main.py