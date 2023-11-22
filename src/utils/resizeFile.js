const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
class ResizeFile {
    constructor(folder) {
        this.folder = folder;
    }
    async save(buffer) {
        const filename = ResizeFile.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .toFile(filepath);

        return filename;
    }
    static filename() {
        return `${uuidv4()}.png`;
    }
    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`);
    }
}
module.exports = ResizeFile;
