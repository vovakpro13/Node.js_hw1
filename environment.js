const fs = require('fs');
const path = require('path');

const createFolder = path => {
    return new Promise(resolve => {
        fs.mkdir(path, {recursive: true},err => {
            err && console.log(err);
            resolve(true);
        });
    })
}

const createFile = (path, data) => {
    fs.writeFile(path, data, err => err && console.log(err));
}

const moveDataToDir = async (dirPath, array) => {
    await createFolder(dirPath);
    array?.forEach(item => {
        createFile(path.join(dirPath, `${item.name}.json`), JSON.stringify(item));
    });
}

const createEnvironment = (folders) => {
    folders.forEach(({path, data}) => {
        moveDataToDir(path, data);
    });
};

module.exports = {createEnvironment};