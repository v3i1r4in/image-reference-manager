/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../AppContainer";
import { EffectProgress } from "../components/EffectProgress";

export function groupTagsToCategory(selectedTags, allTags) {
    const tagsByCategories = {};
    for (const tag of selectedTags) {
        const category = allTags[tag].categoryLabel;
        if (!tagsByCategories[category]) {
            tagsByCategories[category] = [];
        }
        tagsByCategories[category].push(tag);
    }
    return tagsByCategories;
}

export const ImageFilter = () => {
    const {
        filteredImages: [, updateFilteredImages],
        imageTagConfiguration: [imageTagConfiguration],
        selectedFilteringTags: [selectedFilteringTags],
        imageDB: [imageDB],
        imageDBLoadedSignal: [imageDBLoadedSignal],
        selectedImage: [selectedImage, updateSelectedImage],
        reverseFilter: [reverseFilter]
    } = useContext(AppStateContext);

    const [working, setIsWorking] = useState(false);

    useEffect(() => {
        setIsWorking(true);
        if (!selectedFilteringTags || !selectedFilteringTags.length || !imageTagConfiguration.tags) {
            updateFilteredImages(Object.keys(imageDB));
        } else {
            const tagsByCategories = groupTagsToCategory(selectedFilteringTags, imageTagConfiguration.tags);
            const filteredResult = Object.keys(imageDB).filter(img => {
                const imgTags = imageDB[img]?.tags || [];
                for (const tagsToCheck of Object.values(tagsByCategories)) {
                    let atLeastOneMatched = false;
                    for (const tagToCheck of tagsToCheck) {
                        atLeastOneMatched = atLeastOneMatched || imgTags.includes(tagToCheck);
                    }
                    if (reverseFilter === atLeastOneMatched) {
                        return false;
                    }
                }
                return true;
            });
            updateFilteredImages(filteredResult);
            if (selectedImage !== undefined) {
                if (filteredResult.length) {
                    updateSelectedImage(Math.min(filteredResult.length -1, selectedImage));
                } else {
                    updateSelectedImage(undefined);
                }
            }
        }
        setIsWorking(false);
    }, [imageDBLoadedSignal.signal, selectedFilteringTags.join(), reverseFilter]);

    return <EffectProgress message={"filtering images..."} inProgress={working}/>
}