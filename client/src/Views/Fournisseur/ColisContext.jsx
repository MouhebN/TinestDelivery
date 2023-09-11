import React, { createContext, useState, useContext } from 'react';

const ColisContext = createContext();

const ColisProvider = ({ children }) => {
    const [colisList, setColisList] = useState([]);

    return (
        <ColisContext.Provider value={{ colisList, setColisList }}>
            {children}
        </ColisContext.Provider>
    );
};

const useColisContext = () => {
    const context = useContext(ColisContext);
    if (!context) {
        throw new Error('useColisContext must be used within a ColisProvider');
    }
    return context;
};

export { ColisProvider, useColisContext };