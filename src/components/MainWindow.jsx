import React, { useContext, useEffect, useState } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { AppStateContext } from '../AppContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import useKeypress from 'react-use-keypress';
import classNames from 'classnames';
import { Cancel } from '@material-ui/icons';
import { ToolbarHeight } from './MainToolbar';

const batch = 50;

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    spacer: {
        height: ToolbarHeight
    },
    content: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
        alignContent: 'flex-start',
    },
    contentContainer: {
        overflow: 'scroll',
        height: `calc(100% - ${ToolbarHeight}px)`,
    },
    imageTile: {
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        zIndex: 1
    },
    imageTileSelected: {
        "boxShadow": "0 0 10px rgba(81, 203, 238, 1)",
        "border": "1px solid rgba(81, 203, 238, 1)",
        zIndex: 2
    },
    imageTileImageTag: {
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
    }
}));


const ImageContainer = React.memo(function ({ path, size, index, isSelected, onClick }) {
    const url = `file://${path}`;
    const classes = useStyles();
    return <div
        className={classNames(classes.imageTile, isSelected && classes.imageTileSelected)}
        style={{
            width: size,
            height: size,
            flex: `1 1 ${size}px`,
            backgroundImage: `url(${JSON.stringify(url)})`,
        }}>
        <img src={url}
            alt=""
            id={'image-' + index}
            onClick={onClick}
            className={classes.imageTileImageTag} />
    </div>
})

export const MainWindow = () => {
    const {
        filteredImages: [filteredImages],
        imagePreviewSize: [imagePreviewSize],
        rightbarWidth: [rightbarWidth],
        selectedImage: [selectedImage, updateSelectedImage],
    } = useContext(AppStateContext);
    const [count, updateCount] = useState(batch);
    const [showPreview, setShowPreview] = useState(false);

    const classes = useStyles();
    const displayedImages = filteredImages.slice(0, count);
    const items = displayedImages.map((p, i) => <ImageContainer
        key={p}
        size={imagePreviewSize}
        path={p}
        index={i}
        isSelected={i === selectedImage}
        onClick={() => {
            if (selectedImage === i) {
                setShowPreview(true);
            } else {
                updateSelectedImage(i);
            }
        }}
    />);
    const selectedImagePath = filteredImages[selectedImage];

    useEffect(() => {
        if (selectedImage !== undefined) {
            const selectedImageNode = document.getElementById('image-' + selectedImage);
            if (selectedImageNode) {
                selectedImageNode.scrollIntoView({
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    inline: 'nearest',
                    behavior: 'smooth',
                });
            }
        }
    }, [selectedImage]);

    useKeypress(['ArrowLeft', 'ArrowRight'], (event) => {
        if (selectedImage !== undefined) {
            if (event.key === 'ArrowLeft') {
                if (selectedImage > 0) {
                    updateSelectedImage(selectedImage - 1);
                }
            } else {
                if (selectedImage < displayedImages.length - 1) {
                    updateSelectedImage(selectedImage + 1);
                }
            }
        }
    });

    useKeypress([' '], (event) => {
        event.preventDefault();
        setShowPreview(!showPreview);
    });

    const { sidebarWidth: [sidebarWidth] } = useContext(AppStateContext);
    return <div>
        <div className={classes.spacer} />
        <div id="scrollableDiv"
            className={classes.contentContainer}
            style={{ marginLeft: sidebarWidth, marginRight: rightbarWidth }}>

            <InfiniteScroll
                dataLength={items.length}
                className={classes.content}
                hasMore={count < filteredImages.length}
                next={() => { updateCount(count + batch) }}
                scrollableTarget="scrollableDiv">
                {items}
            </InfiniteScroll>
        </div>
        {
            selectedImagePath && showPreview && <div onClick={() => setShowPreview(false)} style={{
                zIndex: 3,
                position: 'absolute',
                top: ToolbarHeight,
                left: sidebarWidth,
                right: rightbarWidth,
                bottom: 0,
                margin: 'auto',
                backdropFilter: 'blur(30px)',
                boxShadow: '0px 0px 50px 3px rgba(0, 0, 0, 0.8) inset',
            }}>
                    <img alt="" style={{
                        position: 'absolute',
                        top: '48%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        boxShadow: '0px 0px 50px 3px rgba(0, 0, 0, 0.4)',
                    }} 
                        src={`file://${selectedImagePath}`} 
                    
                    />

                    <IconButton
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                    }}>
                        <Cancel />
                    </IconButton>

                    <Button 
                    variant='outlined'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        window.electron.shell.showItemInFolder(selectedImagePath)
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 15,
                        left: 0,
                        right: 0,
                        margin: 'auto'
                    }}>
                        Open File Location
                    </Button>
            </div>
        }
        
    </div>;
}