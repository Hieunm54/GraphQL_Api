import fs from 'fs';

const imgClearer = (filePath)=>{
    fs.unlink(filePath, (err)=>{
        if(err) throw err;
    })
}

export {imgClearer};