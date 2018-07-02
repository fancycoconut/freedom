# Docker
Course: https://app.pluralsight.com/library/courses/docker-getting-started/table-of-contents

## Windows
- Needs Hyper V using Turn on/off windows features

## Mac
- Uses HyperKit: https://github.com/docker/hyperkit
- DataKit: https://github.com/docker/datakit

# Linux


## Commands
docker version
docker info
docker run <container>
docker ps
docker images

// Pulls latet ubuntu image
docker pull ubuntu
docker pull ubunut:14.04

// Remove images
docker rmi ubuntu:14.04 

docker start <container>
docker stop <container>
docker rm <container>

exit container: Ctrl + P & Q

docker-compose up --detach

// attach to container
docker exec -it <container name> /bin/bash