import tar from "tar";
import Dockerode from "dockerode";
import fs from "fs";

async function main() {
    const folderPath = "./src/dockerTest";
    const tarOutPath = "./src/dockerTest.tar.gz";
    await tar.create(
        {
            gzip: true,
            file: tarOutPath,
            cwd: folderPath,
        },
        ["."]
    );

    await tar.t({
        file: tarOutPath,
        onentry: (entry) => {
            console.log(entry.header.path);
        },

    })

    // const tfs = await fs.createReadStream(tarOutPath);
    // tfs
    //     .pipe(tar.t())
    //     .on("entry", (entry) => {
    //         console.log(entry);
    //     })
    //     .on("error", (error) => {
    //         console.log(error);
    //     });

    console.log("finished");
    const docker = new Dockerode();
    const buildStream = await docker.buildImage(tarOutPath, {
        t: "docker-test-ts",
    });
    buildStream
        .on("data", (data) => {
            console.log(data.toString());
        })
        .on("error", (err) => {
            console.log(err);
        });
}

main();
