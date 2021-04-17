import { Dialog, List, Divider, makeStyles, Box, IconButton, ListItem, ListItemText, ListItemSecondaryAction, Switch, Chip, Typography } from "@material-ui/core";
import { Add, Cancel, Delete, More } from "@material-ui/icons";
import React, { useContext } from "react";
import { AppStateContext } from "../AppContainer";
import { getDirectory, getAndReadYamlFile } from "../resources/misc";

const useStyles = makeStyles(theme => ({
    root: {
        width: 'calc(100% -20px)'
    },
    dialogTitle: {
        display: 'flex',
        padding: 10,
        paddingLeft: 20,
        alignItems: "center",
    },
    dialogContent: {
        padding: 20,
    },
}))


export const SettingsDialog = () => {
    const classes = useStyles();
    const {
        themeMode: [themeMode, setThemeMode],
        isSettingsDialogOpen: [isSettingsDialogOpen, setIsSettingsDialogOpen],
        imageTagConfiguration: [, setImageTagConfiguration],
        imageCollectionPaths: [imageCollectionPaths, updateImageCollectionPaths],
    } = useContext(AppStateContext);

    return <Dialog fullWidth={true} maxWidth="md" open={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)}>
        <Box>
            <Box className={classes.dialogTitle}>
                <div>Settings</div>
                <div style={{ flexGrow: 1 }} />
                <div />
                <Chip size="small" variant="outlined" style={{ marginRight: 10}} clickable onClick={() => {
                    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
                }} label={themeMode === 'light' ? 'Turn off the Lights' : 'Turn on the Lights'}/>
                <IconButton size="small" onClick={() => setIsSettingsDialogOpen(false)}><Cancel /></IconButton>
            </Box>
            <Divider />
            <Box className={classes.dialogContent}>
                <List dense>
                    {imageCollectionPaths.map(p =>
                        <ListItem divider key={p.path}>
                            <ListItemText><Typography variant="body2" color={p.enabled ? 'textPrimary' : 'textSecondary'}>{p.path}</Typography></ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => {
                                    updateImageCollectionPaths(imageCollectionPaths.filter(e => e.path !== p.path));
                                }}>
                                    <Delete />
                                </IconButton>
                                    <Switch checked={p.enabled} onChange={(e,v) => {
                                    updateImageCollectionPaths(imageCollectionPaths.map(m => {
                                        if (m.path === p.path) {
                                            m.enabled = v;
                                        }
                                        return m;
                                    }));
                                }}/>
                            </ListItemSecondaryAction>
                        </ListItem>)}


                    <ListItem divider button onClick={async () => {
                        const path = await getDirectory();
                        if (path && !imageCollectionPaths.find(v => v.path === path)) {
                            updateImageCollectionPaths([
                                ...imageCollectionPaths,
                                {
                                    path,
                                    enabled: true
                                },
                            ])
                        }
                    }}>
                        <ListItemText>Add Folder</ListItemText>
                        <ListItemSecondaryAction><Add /></ListItemSecondaryAction>
                    </ListItem>
                    <ListItem button onClick={async () => {
                        const config = await getAndReadYamlFile();
                        const tags = {};
                        const categories = {};
                        if (config) {
                            for (const categoryId of Object.keys(config)) {
                                const tagsOfThisCateogry = {}
                                for (const tagId of Object.keys(config[categoryId].tags)) {
                                    const tag = {
                                        tagId: `${categoryId}:${tagId}`,
                                        tagLabel: config[categoryId].tags[tagId],
                                        categoryLabel: config[categoryId].label, 
                                    };

                                    tags[tag.tagId] = tag;
                                    tagsOfThisCateogry[tag.tagId] = tag;
                                }
                                categories[config[categoryId].label] = {
                                    categoryLabel: config[categoryId].label,
                                    tags: tagsOfThisCateogry,
                                };
                            }
                            setImageTagConfiguration({
                                tags,
                                categories
                            });
                        }
                    }}>
                        <ListItemText>Set Tag Definition File</ListItemText>

                        <ListItemSecondaryAction><More /></ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Box>
        </Box>
    </Dialog>
}