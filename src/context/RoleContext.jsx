import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState('Dosen'); // Default to Dosen

    const toggleRole = () => {
        setRole((prev) => (prev === 'Dosen' ? 'Admin' : 'Dosen'));
    };

    return (
        <RoleContext.Provider value={{ role, toggleRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
