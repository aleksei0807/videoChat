package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/buaazp/fasthttprouter"
	"github.com/kirillDanshin/myutils"
	"github.com/valyala/fasthttp"
)

const (
	static = "/static"
	all    = "/*route"
	index  = "/index.html"
	route  = "route"
	ise    = "Internal server error"
)

var (
	dir  = flag.String("dir", "./frontend/dist", "directory to serve")
	conf = flag.String("conf", "./config.json", "path to config file (json)")
)

func handler(ctx *fasthttp.RequestCtx) {
	myRoute := ctx.UserValue(route)
	if myRoute == nil {
		ctx.Error(ise, 500)
		return
	}
	localRoute := myRoute.(string)
	if strings.HasPrefix(localRoute, static) {
		fasthttp.ServeFile(ctx, myutils.Concat(*dir, localRoute))
		return
	}
	fasthttp.ServeFile(ctx, myutils.Concat(*dir, index))
}

func main() {
	flag.Parse()

	confFile, err := os.Open(*conf)
	if err != nil {
		log.Fatal(err)
	}

	confReader := bufio.NewReader(confFile)

	dec := json.NewDecoder(confReader)
	var c Config
	if err := dec.Decode(&c); err != nil && err != io.EOF {
		log.Fatal(err)
	}

	confFile.Close()

	host := c.Frontend.Host
	port := fmt.Sprintf("%v", c.Frontend.Port)
	addr := myutils.Concat(host, ":", port)

	r := fasthttprouter.New()
	r.GET(all, handler)

	log.Printf("Serving %s on %s\n", *dir, addr)
	fasthttp.ListenAndServeTLS(addr, "sslcert/cert.pem", "sslcert/key.pem", r.Handler)
}
