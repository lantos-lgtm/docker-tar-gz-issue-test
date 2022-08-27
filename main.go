package main

import (
	"bufio"
	"context"
	"fmt"
	"os"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
)

// This is a test program to To test whether or tar not to works properly
// 1. create a tar.gz buffer from a directory
// 2. create a file buffer and write the tar.gz buffer to it
// 3. read that file buffer and then build that file buffer

func main() {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	// creates a tar buffer from a directory
	tar, err := archive.TarWithOptions("./example/testDocker", &archive.TarOptions{
		Compression: archive.Gzip,
	})
	if err != nil {
		panic(err)
	}
	// writes the tar buffer to a file
	tempFilePath := "./example/testDocker.go.tar.gz"
	tempFile, err := os.Create(tempFilePath)
	if err != nil {
		panic(err)
	}
	defer tempFile.Close()
	tempFile.ReadFrom(tar)

	// read the file to be built
	filePath := "./example/testDocker.go.tar.gz"
	file, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	reader := bufio.NewReader(file)

	// build the image
	buildOptions := types.ImageBuildOptions{
		Tags: []string{"test-docker:go"},
	}
	buildRes, err := cli.ImageBuild(ctx, reader, buildOptions)
	if err != nil {
		panic(err)
	}
	scanner := bufio.NewScanner(buildRes.Body)
	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}
}
