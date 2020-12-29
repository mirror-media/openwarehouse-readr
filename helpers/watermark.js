const fs = require('fs')
const cp = require('child_process')
const execSync = cp.execSync
const path = require('path')

async function addWatermark(stream, id, filename) {
    console.log('===addWatermark===')
    const ext = path.extname(filename)
    let newLocalMarked = `./${id}_tmp_watermark${ext}`
    let image = fs.createWriteStream(`./${id}_tmp${ext}`)
    execSync(
        `composite -gravity SouthEast public/images/2020-mirror-logo.png ./images/${id}-${filename} ${newLocalMarked}`
    )

    console.log('===end addWatermark===')

    return fs.createReadStream(newLocalMarked)
    //composite -gravity SouthEast ./public/images/2020-mirror-logo.png ./fuckkmt.jpg ./watermarked.jpg
}

module.exports = { addWatermark }
// composite.stdout.pipe(path.basename(input).split('.')[0]+'watermarked'+path.basename(input).split('.')[1])
// Pipe the image magick output to a file. Could just as easily pipe it to a http response or any other stream.
// composite.stdout.pipe( fs.createWriteStream("out.jpg") );
