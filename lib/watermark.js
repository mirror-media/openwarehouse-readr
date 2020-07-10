const fs = require('fs')
const cp = require('child_process') 
const spawn = cp.spawn;
const path = require('path')

function addWatermark(input_path) {
    console.log("===ADD WATERMARK!===")
    const image = fs.createReadStream(input_path);
    //composite -gravity SouthEast ./public/images/20171025EA-0142.png ./fuckkmt.jpg ./watermarked.jpg
    const args = ['-gravity', 'SouthEast', './public/images/20171025EA-0142.png', input_path, `${path.basename(input_path).split('.')[0]}_watermarked.${path.basename(input_path).split('.')[1]}`];
    console.log("CWD: ", process.cwd())
    const composite = spawn('composite', args);
    image.pipe(composite.stdin);
    composite.on('close', (code) => {
        if (code !== 0) {
            console.log(`Process exited with code ${code}`);
        }
        else {
            console.log(`Process completed`);
        }
    });
}


module.exports = { addWatermark }
// composite.stdout.pipe(path.basename(input).split('.')[0]+'watermarked'+path.basename(input).split('.')[1])

// Pipe the image magick output to a file. Could just as easily pipe it to a http response or any other stream.
// composite.stdout.pipe( fs.createWriteStream("out.jpg") );