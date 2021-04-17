/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../AppContainer";
import { EffectProgress } from "../components/EffectProgress";
import { indexFolders, writeImageMeta } from "../resources/indexer";

export const ImageDBIndexer = () => {
    const {
        imageCollectionPaths: [imageCollectionPaths],
        imageDB: [, updateImageDB],
        imageDBLoadedSignal: [, publishImageDBLoadedSignal],
        persistImageDBSignal: [persistImageDBSignal],
        reindexSignal: [reindexSignal]
    } = useContext(AppStateContext);

    const [isIndexing, setIsIndexing] = useState(false);

    const folders = imageCollectionPaths.filter(m => m.enabled).map(m => m.path);

    useEffect(() => {
        (async () => {
            setIsIndexing(true);
            try {
                await updateImageDB(await indexFolders(folders));
            } catch (e) {
                console.log(e);
            }
            setIsIndexing(false);
            publishImageDBLoadedSignal();
        })();
    }, [folders.join(), reindexSignal]);

    useEffect(() => {
        (async () => {
            if (persistImageDBSignal.event?.imageMetas) {
                setIsIndexing(true);
                try {
                    for (const imgObj of persistImageDBSignal.event.imageMetas) {
                        await writeImageMeta(imgObj);
                    }
                } catch (e) {
                    console.log(e);
                    alert('Something went wrong!');
                }
                setIsIndexing(false);
            }
        })();
    }, [persistImageDBSignal]);

    return <EffectProgress message={"Indexing images..."} inProgress={isIndexing}/>
}