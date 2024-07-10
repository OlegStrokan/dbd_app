#!/bin/bash

# Function to pause the script and wait for user input
pause(){
  read -p "$*"
}

echo "Connecting to Parcel Delivery Dev DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=user psql -h 10.32.0.18 -p 5433 -U stroka01 -d dev_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to Parcel Delivery Test DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=user psql -h 10.32.0.18 -p 8433 -U stroka01 -d test_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to Exchange DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=user psql -h 10.32.0.18 -p 8434 -U stroka01 -d exchange_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to Exchange Test DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=test psql -h 10.32.0.18 -p 5434 -U stroka01 -d exchange_test_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to Report Worker Test DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=user psql -h 10.32.0.18 -p 8436 -U stroka01 -d report_worker_test_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to IL DB..."
osascript -e 'tell application "Terminal" to do script "PGPASSWORD=user psql -h 10.32.0.18 -p 8435 -U stroka01 -d il_db"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to Redis..."
osascript -e 'tell application "Terminal" to do script "redis-cli -h 10.32.0.18 -p 6379 -a eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"'
pause 'Press [Enter] to continue to the next service...'

echo "Connecting to NATS..."
osascript -e 'tell application "Terminal" to do script "nats-server -h 10.32.0.18 -p 4222"'
pause 'Press [Enter] to continue to the next service...'

echo "Opening Jaeger Tracing in browser..."
open "http://10.32.0.18:16686"

echo "All services connected!"
