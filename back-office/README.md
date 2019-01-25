# Chimp Assist Back Office

This is the web app used by the attendants

## Getting Started

Just run `docker-compose up`:

```yaml
version: '3.7'

services:

  backend:
    image: tiagostutz/chimpassist-server:0.1.5-alpine
    ports:
      - 3000:3000
    environment:
      - MONGO_CONNECTION_URL=mongodb://root:root@mongo:27017/?authMechanism=SCRAM-SHA-1
      - MQTT_BROKER_HOST=mqtt://mqtt:1883
    networks:
      - chimpassist-demo        

  back-office:
    image: tiagostutz/chimpassist-back-office-ui:0.1.5-alpine
    ports:
      - 3210:80
    environment:  
      - LOGO_SMALL_URL=https://res.cloudinary.com/stutzsolucoes/image/upload/c_crop,h_326/c_scale,h_176/v1539906576/noun_Cabin_Monkey_774328_yxidcr.png
      - DEFAULT_ATTENDANT_AVATAR_URL=https://res.cloudinary.com/stutzsolucoes/image/upload/v1530069234/pseudo-avatar_ghrnlu.jpg
      - BACKEND_ENDPOINT=http://localhost:3000
      - MQTT_BROKER_HOST=http://localhost:8080/mqtt
    networks:
      - chimpassist-demo

  mqtt:
    image: erlio/docker-vernemq
    restart: always
    ports:
      - 1883:1883
      - 8080:8080
    environment:
      - DOCKER_VERNEMQ_ALLOW_ANONYMOUS=on
      - DOCKER_VERNEMQ_LOG__CONSOLE__LEVEL=info
    networks:
      - chimpassist-demo        

  mongo:
    image: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
    networks:
      - chimpassist-demo        

networks:
  chimpassist-demo:
    name: chimpassist-demo      
```

-----------

## Didn't use but may be useful

### Trying to get IP from another container

Idea: you pass the container name in brackets `<container_name>` and this expression replaces it

```sh
cat dummy | grep -E -o "<.*>" | sed "s|[<|>]||g" | awk '{system("getent hosts " $0)}' | awk '{system(
"sed \"s|<.*>|"$1"|g\" -i dummy")}' | awk '{print $1}'
```