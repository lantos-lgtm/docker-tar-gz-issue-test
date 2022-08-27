import docker from "dockerode"
import tar from "tar"

async function readStream(stream: NodeJS.ReadableStream): Promise<void> {
    return new Promise((resolve, reject) => {
        stream.on("data", (data) => {
            console.log(data.toString())
        })
        stream.on("close", () => {
            resolve()
        })
        stream.on("error", (error) => {
            reject(error)
        })
    })
}

async function main() {
    let tarTsFilePath = "example/testDocker.ts.tar.gz"    
    let tarGoFilePath = "example/testDocker.go.tar.gz"
    // create the tar file
    tar.create({
        gzip: true,
        cwd: "example",
        file: tarTsFilePath,
    }, ["testDocker"])
    
    
    let dockerClient = new docker()
    // test go tar archive
    let buildStreamGoFile = await dockerClient.buildImage(tarGoFilePath, {
        t: "test-docker:ts"
    } )

    // test ts tar archive
    await readStream(buildStreamGoFile)
    let buildStreamTsFile = await dockerClient.buildImage(tarTsFilePath, {
        t: "test-docker:ts"
    } )
    await readStream(buildStreamTsFile)
}
main()
