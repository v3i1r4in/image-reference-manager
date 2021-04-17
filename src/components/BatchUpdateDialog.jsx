import { Dialog, Divider, makeStyles, Box, IconButton, Chip, Button } from "@material-ui/core";
import { Cancel} from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../AppContainer";
import { groupTagsToCategory } from "../effects/ImageFilter";
import { TagsSelector } from "./TagsSelector";

const useStyles = makeStyles(_ => ({
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


export const BatchUpdateDialog = () => {
    const classes = useStyles();
    const {
        isBatchUpdateDialogOpen: [isBatchUpdateDialogOpen, setIsBatchUpdateDialogOpen],
        filteredImages: [filteredImages],
        imageDB: [imageDB],
        persistImageDBSignal: [,persistImages],
        imageTagConfiguration: [imageTagConfiguration],
    } = useContext(AppStateContext);

    const [isAddingTags, updateIsAddingTags] = useState(true);
    const [selectedTags, updateSelectedTags] = useState([]);

    useEffect(() => {
        if (!imageTagConfiguration.tags) {
            setIsBatchUpdateDialogOpen(false);
        }
    }, [imageTagConfiguration.tags, setIsBatchUpdateDialogOpen, isBatchUpdateDialogOpen])

    function applyChanges() {
        const selectedTagsByGroup = groupTagsToCategory(selectedTags, imageTagConfiguration.tags);
        const tagsToRemoveForSetting = Object
                .keys(selectedTagsByGroup)
                .flatMap(cat => Object.keys(imageTagConfiguration.categories[cat].tags));
        const imageMetas = [];
        for (const img of filteredImages) {
            const imgObj = imageDB[img];
            const imgTags = imgObj.tags || [];
            if (isAddingTags) {
                imgObj.tags = [...imgTags.filter(t => !tagsToRemoveForSetting.includes(t)), ...selectedTags];
            } else {
                imgObj.tags = imgTags.filter(t => !selectedTags.includes(t));
            }
            imageMetas.push(imgObj);
        }
        persistImages({ imageMetas });
        setIsBatchUpdateDialogOpen(false);
    }

    return <Dialog fullWidth={true} maxWidth="md" open={isBatchUpdateDialogOpen} onClose={() => setIsBatchUpdateDialogOpen(false)}>
        <Box>
            <Box className={classes.dialogTitle}>
                <div>Update All Filtered Images</div>
                <div style={{ flexGrow: 1 }} />
                <div />
                <Chip  size="small" variant="outlined" style={{ marginRight: 10, width: 200}} clickable onClick={() => {
                    updateIsAddingTags(!isAddingTags);
                    updateSelectedTags([]);
                }} label={isAddingTags ? 'Clear Tags' : 'Set Tags'}/>
                <IconButton size="small" onClick={() => setIsBatchUpdateDialogOpen(false)}><Cancel /></IconButton>
            </Box>
            <Divider />
            <Box className={classes.dialogContent}>
                <TagsSelector multiSelect={!isAddingTags} value={selectedTags} onChange={(_,v) => updateSelectedTags(v)}/>
                <Box style={{padding:12, marginTop: 15, display: 'flex', justifyContent: 'center'}}>

                <Button disableElevation onClick={applyChanges} variant="contained" style={{display: 'block'}} color="primary">{
                    isAddingTags ? 'Set Selected Tags' : 'Clear Selected Tags'
                }</Button>
                </Box>
            </Box>
        </Box>
    </Dialog>
}