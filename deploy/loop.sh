eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519
while true
do
	./auto.sh
	sleep 100
done
