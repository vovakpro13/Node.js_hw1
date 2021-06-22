const fs = require('fs');
const path = require('path');

const getFolderPath = (insideFolder) => (
    path.join(folders, insideFolder)
);

const folders = path.join(__dirname, 'folders');
const f18 = getFolderPath('1800');
const f20 = getFolderPath('2000');
const men = getFolderPath('boys');
const women = getFolderPath('girls');

const {students18, students20} = require('./studentsData');
const {createEnvironment} = require('./environment');

const move = (oldPath, newPath, fileName, callback = () => {}) => {
    fs.rename(
        path.join(oldPath, fileName),
        path.join(newPath, fileName),
        err => {
            err && console.log(err)
            callback();
        })
};

const moveFiles = (from, to) => {
    fs.readdir(from, ((err, files) => {
        files?.forEach(name => move(from, to, name))
    }))
}

const sortByGender = (dirPath, menDir, womenDir) => {
    fs.readdir(dirPath, (err, files) => {
        files?.forEach(file => {
            fs.readFile(path.join(dirPath, file), (err, data) => {
                const {gender} = JSON.parse(data);
                move(dirPath, gender === 'male' ? menDir : womenDir, file);
            })
        })
    })
};

const toOneLevel = (current, root = current) => {
    fs.readdir(current, (err, data) => {
        data?.forEach(item => {
            fs.lstat(path.join(current, item), (err, stats) => {
                move(current, root, item,
                    () => {
                        stats.isDirectory() && toOneLevel(path.join(root, item), root); // if it`s a folder - then call recursive
                    });
            })
        });
    });
};

// generate all folders structure
fs.access(folders, (err) => {
    if (err) {
        createEnvironment([
            {path: f18, data: students18},
            {path: f20, data: students20},
            {path: men, data: null},
            {path: women, data: null},
        ]);
    }

})

// moveFiles(f18, f20);
// moveFiles(f20, f18);

// sortByGender(f18, men, women);
// sortByGender(f20, men, women);

// *
// toOneLevel(folders);