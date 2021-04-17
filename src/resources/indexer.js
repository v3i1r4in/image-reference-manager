const metaStoreFolderDir = "meta_store";

function getImageFiles(path) {
    return window.fs.readdirSync(path).filter(f => /.*\.(png)|(jpg)|(jpeg)/i.test(f));
}

function getPersistedImageMeta(path, file) {
    try {
        return JSON.parse(window.fs.readFileSync(window.path.join(path, metaStoreFolderDir, `${file}.json`), 'utf8'))
    } catch (e) {
        return null;
    }
}

export function writeImageMeta(obj) {
    const metaStoreFullPath = window.path.join(obj._path, metaStoreFolderDir);
    if (!window.fs.existsSync(metaStoreFullPath)) {
        window.fs.mkdirSync(metaStoreFullPath);
    }
    window.fs.writeFileSync(
        window.path.join(
            metaStoreFullPath, 
            `${obj._filename}.json`), 
        JSON.stringify(obj, (k, v) => k.startsWith('_') ? undefined : v));
}

export function indexFolders(paths) {
    const imageDB = {};
    for (const path of paths) {
        for (const imgFile of getImageFiles(path)) {
            const key = `${path}/${imgFile}`;
            imageDB[key] = {
                _filename: imgFile,
                _path: path,
            };
            const existingMeta = getPersistedImageMeta(path, imgFile);
            if (existingMeta) {
                Object.assign(imageDB[key], existingMeta)
            }
        }
    }
    return imageDB;
}
