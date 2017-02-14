package main

type Settings struct {
	Host string
	Port int
}

type Config struct {
	Frontend, Backend Settings
}
