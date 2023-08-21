import React, { createContext, useContext, useState } from 'react';
import {darkTheme, lightTheme} from "./themes";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    const toggleDarkMode = () => {
        const updatedDarkMode = !darkMode;
        localStorage.setItem('darkMode', updatedDarkMode);
        setDarkMode(updatedDarkMode);
    };

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
