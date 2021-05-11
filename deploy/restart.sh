
export PORT=80
screen -XS backend quit
screen -XS frontend quit
screen -dmS backend ./backend.sh
screen -dmS frontend ./frontend.sh
echo "restarted"
