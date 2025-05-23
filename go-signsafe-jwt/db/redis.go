package db

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	err := RedisClient.Ping(context.Background()).Err()
	if err != nil {
		fmt.Println(err.Error())
		panic("failed to connect to Redis")
	}
}
