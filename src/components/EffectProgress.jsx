import { Dialog, makeStyles, Box, CircularProgress } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(_ => ({
    dialogTitle: {
        display: 'flex',
        padding: 20,
        alignItems: "center",
    },
    dialogContent: {
        padding: 20,
    },
}))

export const EffectProgress = ({ message, inProgress}) => {
    const classes = useStyles();
    return <Dialog fullWidth={true} maxWidth="sm" open={inProgress}>
        <Box >
            <Box className={classes.dialogTitle}>
                <div>{message}</div>
                <div style={{ flexGrow: 1 }} />
                <CircularProgress />
            </Box>
        </Box>
    </Dialog>
}