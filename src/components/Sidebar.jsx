import React, { useContext } from 'react';
import { Divider, IconButton, makeStyles, Paper, Slider, Chip } from "@material-ui/core";
import { AppStateContext } from "../AppContainer";
import { BurstMode, Refresh, Settings } from '@material-ui/icons';
import classNames from 'classnames';
import { DraggableCore } from 'react-draggable';
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
        top: 0,
        outline: 0,
        left: 0,
        right: 'auto',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        flexShrink: 0,
    },
    sidebarHeader: {
        display: 'flex',
        height: 42
    },

    dragBar: {
        position: 'fixed',
        height: '100%',
        width: 3,
        top: 0,
        bottom: 0,
        '&:hover': {
            cursor: 'col-resize',
        },
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 72 - 38,
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

export const Sidebar = () => {
    const classes = useStyles();
    const {
        sidebarWidth: [sidebarWdith, updateSidebarWidth],
        isSettingsDialogOpen: [, updateIsSettingsDialogOpen],
        imagePreviewSize: [imagePreviewSize, updateImagePreviewSize],
        selectedFilteringTags: [selectedFilteringTags, updateSelectedFilteringTags],
        reverseFilter: [reverseFilter, updateReverseFilter],
        reindexSignal: [, sendReindexSignal],
        isBatchUpdateDialogOpen: [, setIsBatchUpdateDialogOpen],
    } = useContext(AppStateContext);

    return <Paper square
        variant='outlined' className={classes.paper} style={{
            width: sidebarWdith
        }}>
        <div className={classNames(classes.sidebarHeader, 'app-region-drag-enable')}>
            <div style={{ flexGrow: 1 }} />
            <IconButton 
                size="small"
                style={{ margin: 'auto', marginRight: 5}}
                onClick={() => sendReindexSignal()}>
                    <Refresh />
            </IconButton>
            <IconButton 
                size="small"
                style={{ margin: 'auto', marginRight: 5}}
                onClick={() => setIsBatchUpdateDialogOpen(true)}>
                    <BurstMode />
            </IconButton>
            <IconButton 
                size="small"
                style={{ margin: 'auto', marginRight: 5}}
                onClick={() => updateIsSettingsDialogOpen(true)}>
                    <Settings />
            </IconButton>
        </div>
        <div className={classes.sliderContainer}>
            <Slider value={imagePreviewSize} onChange={(_, v) => updateImagePreviewSize(v)} min={300} max={1000} />
        </div>
        <Divider />
        <Chip 
            style={{ margin: 12}} 
            clickable
            color={reverseFilter ? 'primary' : undefined}
            onClick={() => updateReverseFilter(!reverseFilter)}
            label="Reverse Filter" 
            size="small"
        />
        <Divider />
        <TagsSelector value={selectedFilteringTags} onChange={(e, v) => updateSelectedFilteringTags(v)}/>
        <DraggableCore
            onStart={() => {
                document.body.style.cursor = "col-resize"
            }}
            onStop={() => {
                document.body.style.cursor = "default"
            }}
            onDrag={(e, data) => {
                updateSidebarWidth(getNewSidebarSize(sidebarWdith, data.deltaX));
            }}>
            <div className={classes.dragBar} style={{ left: sidebarWdith }}></div>
        </DraggableCore>
    </Paper>
}
