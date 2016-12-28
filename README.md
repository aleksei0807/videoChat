# videoChat

Video chat based on webRTC

## Getting started

```
git clone https://github.com/aleksei0807/videoChat.git
cd videoChat
npm i
```

If you don't have Golang installed, you should install it from [here](https://golang.org/dl/).

Generate ssl certs and put it in ./sslcert. If you need self-signed certs use this command:

```
npm run cert-build
```

And run it:

```
npm start
```

If you use self-signed certs, you should add [https://127.0.0.1:9090](https://127.0.0.1:9090) in exceptions.

Then open [https://127.0.0.1:8080](https://127.0.0.1:8080) in your browser. If you use self-signed certs you should add this in exceptions too.
