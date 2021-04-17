import React from 'react';
import { CssBaseline, makeStyles } from "@material-ui/core";
import { Sidebar } from "./Sidebar";
import { MainWindow } from "./MainWindow";
import { MainToolbar } from "./MainToolbar";
import { SettingsDialog } from './SettingsDialog';
import { ImageDBIndexer } from '../effects/ImageDBIndexer';
import { Rightbar } from './Rightbar';
import { ImageFilter } from '../effects/ImageFilter';
import { BatchUpdateDialog } from './BatchUpdateDialog';

const useStyles = makeStyles(_ => ({
    root: {
        display: 'flex',
        height: '100vh'
    },
}));

export const App = () => {
    const classes = useStyles();

    return <div className={classes.root}>
        <CssBaseline />
        <Sidebar />
        <Rightbar />
        <MainToolbar />
        <MainWindow />
        <SettingsDialog />
        <ImageDBIndexer />
        <ImageFilter />
        <BatchUpdateDialog />
    </div>;
}