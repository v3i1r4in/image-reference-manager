import React, { useContext } from 'react';
import { makeStyles, Paper } from "@material-ui/core";
import { AppStateContext } from "../AppContainer";
import { DraggableCore } from 'react-draggable';
import { ToolbarHeight } from './MainToolbar';
import { TagsSelector } from './TagsSelector';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    paper: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '1 0 auto',
        zIndex: theme.zIndex.drawer,
        WebkitOverflowScrolling: 'touch',
        position: 'fixed',
        top: ToolbarHeight,
        outline: 0,
        right: 0,
        left: 'auto',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        flexShrink: 0,
    },
    sidebarHeader: {
        display: 'flex',
        height: 38
    },

    dragBar: {
        position: 'fixed',
        height: '100%',
        width: 3,
        top: ToolbarHeight,
        bottom: 0,
        '&:hover': {
            cursor: 'col-resize',
        },
    }
}));

function getNewSidebarSize(currentSize, delta) {
    if (currentSize + delta > 500) {
        return 500;
    }
    if (currentSize + delta < 150) {
        return 150;
    }
    return currentSize + delta;
}

export const Rightbar = () => {
    const classes = useStyles();
    const {
        rightbarWidth: [rightbarWidth, updateRightbarWidth],
        selectedImage: [selectedImage],
        filteredImages: [filteredImages],
        imageDB: [imageDB],
        persistImageDBSignal: [, publishPersistImageDBSignal]
    } = useContext(AppStateContext);

    let tags = [];
    let selectedImageObj = undefined;
    if (selectedImage !== undefined && filteredImages.length && imageDB[filteredImages[selectedImage]]) {
        selectedImageObj = imageDB[filteredImages[selectedImage]];
        if (!selectedImageObj.tags) {
            selectedImageObj.tags = [];
        }
        tags = selectedImageObj.tags;
    }

    return <Paper square
        variant='outlined' className={classes.paper} style={{
            width: rightbarWidth
        }}>

        <TagsSelector disabled={selectedImage === undefined} multiSelect={false} value={tags} onChange={(e, v) => {
            if (selectedImageObj) {
                selectedImageObj.tags = v;
            }
            publishPersistImageDBSignal({ imageMetas: [ selectedImageObj ] });
        }}/>

        <DraggableCore
            onStart={() => {
                document.body.style.cursor = "col-resize"
            }}
            onStop={() => {
                document.body.style.cursor = "default"
            }}
            onDrag={(e, data) => {
                updateRightbarWidth(getNewSidebarSize(rightbarWidth, -data.deltaX));
            }}>
            <div className={classes.dragBar} style={{ right: rightbarWidth }}></div>
        </DraggableCore>
    </Paper>
}
