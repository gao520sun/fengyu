
docker build . -t fengyu:web
docker save fengyu:web -o fengyu
docker ps -a|grep "fengyu-web" | awk '{print $1}' | xargs docker stop
docker ps -a|grep "fengyu-web" | awk '{print $1}' | xargs docker rm
docker run -d --name=fengyu-web -p 5000:80 fengyu:web
docker rmi $(docker images -a|grep none|awk '{print $3}')