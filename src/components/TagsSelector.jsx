import React, { useContext, useState } from 'react';
import { Button, Chip, Collapse, Divider, Typography} from "@material-ui/core";
import { AppStateContext } from "../AppContainer";

export function TagsSelector({ value = [], onChange = () => {}, multiSelect = true, disabled = false }) {
    const {
        imageTagConfiguration: [imageTagConfiguration]
    } = useContext(AppStateContext);

    const [colapsed, updateColapsed] = useState({}); 

    if (imageTagConfiguration.categories) {
        return <div style={{ paddingLeft: 10, paddingRight: 10}}>
            {Object.values(imageTagConfiguration.categories).map(category => <div key={category.categoryLabel}>
                <Button 
                disabled={disabled}
                size="small" 
                variant={colapsed[category.categoryLabel] ? 'outlined' : undefined}
                 
                style={{ 
                    marginTop: 5,
                    marginBottom: 5,
                    display: 'block', 
                    width: '100%'
                }} onClick={() => {
                    updateColapsed({
                        ...colapsed,
                        [category.categoryLabel]: !colapsed[category.categoryLabel]
                    })
                }}>
                    {category.categoryLabel}
                </Button>
                <Collapse in={!colapsed[category.categoryLabel]}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 1, 
        alignContent: 'flex-start'}}>
                        {Object.values(category.tags).map((m, index)=> <Chip
                            key={index}
                            disabled={disabled}
                            clickable
                            onClick={(e) => {
                                if (multiSelect) {
                                    if (value.includes(m.tagId)) {
                                        return onChange(e, value.filter(v => v !== m.tagId))
                                    } else {
                                        return onChange(e, [...value, m.tagId])
                                    }
                                } else {
                                    const newTags = value.filter(v => !Object.keys(category.tags).includes(v));
                                    if (!value.includes(m.tagId)) {
                                        onChange(e, [...newTags, m.tagId]);
                                    } else {
                                        onChange(e, newTags);
                                    }
                                }
                            }}
                            style={{
                                flex: '1 1',
                                marginRight: 2, 
                                marginLeft: 2, 
                                marginBottom: 4
                            }} 
                            color={value.includes(m.tagId) ? "primary" : undefined}
                            size="small"
                            label={m.tagLabel} 
                        />)}
                    </div>
                </Collapse>
                <Divider />
            </div>)}
        </div>
    } else {
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
        }}>
            <Typography variant="caption" color="textSecondary">
                <em>NO TAG DEFINITION</em>
            </Typography>
        </div>
    }
}