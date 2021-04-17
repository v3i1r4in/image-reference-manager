import { createMuiTheme } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import React, { createContext, useState, useRef } from "react";
import { App } from "./components/App";

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
}

function useSignal() {
    const [storedValue, setStoredValue] = useState({signal: 0, event: undefined});
    const setValue = (event) => {
        setStoredValue(prev => ({
            signal: prev.signal + 1,
            event
        }));
    };
    return [storedValue, setValue];
}

const useAppState = () => ({
    sidebarWidth: useState(240),
    rightbarWidth: useState(240),
    toolbarHeight: useState(80),
    themeMode: useLocalStorage('themeMode', 'dark'),
    imagePreviewSize: useState(500),
    isSettingsDialogOpen: useState(false),
    isBatchUpdateDialogOpen: useState(false),
    reverseFilter: useState(false),
    imageDB: useState({}),
    imageDBLoadedSignal: useSignal(),
    reindexSignal: useSignal(),
    persistImageDBSignal: useSignal(),
    filteredImages: useState([]),
    selectedImage: useState(),
    imageCollectionPaths: useLocalStorage('imageCollectionPaths', []),
    imageTagConfiguration: useLocalStorage('imageTagConfiguration', {}),
    refreshImageDB: useRef(() => {}),
    selectedFilteringTags: useLocalStorage('selectedFilteringTags', []),
});

export const AppStateContext = createContext();

export const AppContainer = () => {
    const appState = useAppState();

    const theme = createMuiTheme({
        palette: {
            type: appState.themeMode[0],
            primary: {
                main: red[400],
            }
        },
    });

    return <ThemeProvider theme={theme}>
        <AppStateContext.Provider value={appState}>
            <App />
        </AppStateContext.Provider>
    </ThemeProvider>
}