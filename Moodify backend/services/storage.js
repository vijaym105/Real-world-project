const { default: ImageKit } = require('@imagekit/nodejs');

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function uploadFiles({ buffer, filename, folder = "" }) {
    const file = await client.files.upload({
        file: await ImageKit.toFile(buffer, filename),
        fileName: filename,
        folder
    });

    return file;
}

module.exports = { uploadFiles };