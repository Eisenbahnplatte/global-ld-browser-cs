# Global-Linked Data-Browser (Full Client Side)

## 1) Groundwork (Clone Repository & Checkout correct Branch)

```
git clone https://github.com/Eisenbahnplatte/global-ld-browser-cs.git
cd global-ld-browser-cs && git checkout cs-global-ld-browser
```

## 2.a) Dockerized Project setup

### Requirements:
```
docker: ^20.10.12
docker-compose: ^1.29.2
```

### Setup:
```
docker-compose up
```
Docker-Image runs on Port 8895 per default. (see docker-compose.yml)


## 2.b) Project setup (without Docker)
### Requirements:
```
node: ^v18.7.0
npm: ^8.15.1
```

### Setup:
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


