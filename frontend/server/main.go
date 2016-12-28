package main

import (
	"flag"
	"log"

	"github.com/valyala/fasthttp"
)

var (
	addr = flag.String("addr", ":8080", "address to listen")
	dir  = flag.String("dir", "./static", "directory to serve")
)

func main() {
	flag.Parse()
	log.Printf("Serving %s on %s\n", *dir, *addr)
	fasthttp.ListenAndServeTLS(*addr, "sslcert/cert.pem", "sslcert/key.pem", fasthttp.FSHandler(*dir, 0))
}
