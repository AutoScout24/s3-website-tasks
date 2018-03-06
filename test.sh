set -e

NAME=s3-website-tasks
docker build --tag $NAME:latest .
docker ps -a | grep $NAME && docker rm -f $NAME
docker run --name $NAME $NAME
