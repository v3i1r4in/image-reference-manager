import React, { useContext } from 'react';
import { makeStyles, Paper, Typography, TextField, Chip } from '@material-ui/core';
import { AppStateContext } from '../AppContainer';
import classNames from 'classnames';
import { Autocomplete } from '@material-ui/lab';

export const ToolbarHeight = 60;

const useStyles = makeStyles(_ => ({
    appBar: {
        right: 0,
        position: 'fixed',
    },
    filter: {
        verticalAlign: 'middle',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        height: ToolbarHeight,
    },
    tagsInput: {
        boxSizing: 'border-box',
        flexGrow: 1,
    },
}));

export const MainToolbar = () => {
    const classes = useStyles();
    const {
        sidebarWidth: [sidebarWidth],
        selectedFilteringTags: [selectedFilteringTags, updateSelectedFilteringTags],
        imageTagConfiguration: [imageTagConfiguration],
        reverseFilter: [reverseFilter],
    } = useContext(AppStateContext);
    const allTags = imageTagConfiguration.tags || {};
    return <Paper
        square
        elevation={2}
        className={classes.appBar}
        style={{
            width: `calc(100% - ${sidebarWidth}px)`,
        }}
    >
        <div className={classNames(classes.filter, 'app-region-drag-enable')}>
            <Autocomplete
                className={classes.tagsInput}
                multiple
                options={Object.values(allTags)}
                getOptionLabel={(option) => option.tagLabel}
                value={selectedFilteringTags.map(t => allTags[t])}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        label={reverseFilter ? 'Tags to Exclude' : 'Tags to Include'}
                    />
                )}
                renderOption={option => <span><Typography color="textSecondary" variant="caption" display="inline" gutterBottom>
                    {option.categoryLabel} -
          </Typography> {option.tagLabel}</span>}
                onChange={(e, values) => {
                    updateSelectedFilteringTags(values.map(v => v.tagId));
                }}
                renderTags={(tags, getTagProps) => tags.map((tag, index) => <Chip
                    label={tag.tagLabel}
                    size='small'
                    {...getTagProps({ index })}
                />)
                }
            />
        </div>
    </Paper>;
}