import yaml from 'js-yaml';

export async function getDirectory() {
    const dialogResponse = await window.electron.dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (!dialogResponse.canceled) {
        return dialogResponse.filePaths[0];
    }
}

export async function getAndReadYamlFile() {
    const dialogResponse = await window.electron.dialog.showOpenDialog({
        filters: [
            {
                name: 'Yaml Configuration',
                extensions: ['yaml', 'yml']
            }
        ],
        properties: [
            'openFile',
            'showHiddenFiles'
        ]
    });

    if (!dialogResponse.canceled) {
        try {
            return yaml.load(window.fs.readFileSync(dialogResponse.filePaths[0], 'utf8'));
        } catch (e) {
            alert('Unexpected Error!: ' + e.message);
        }
    }
}