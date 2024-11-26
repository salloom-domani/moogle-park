import React, {createContext, useContext, useState} from "react";

interface ViewModeContextProps {
    viewMode: string;
    setViewMode: (mode: string) => void;
}

const ViewModeContext = createContext<ViewModeContextProps | undefined>(undefined);

export const ViewModeProvider = ({children}: { children: React.ReactNode }) => {
    const [viewMode, setViewMode] = useState("grid");
    return (
        <ViewModeContext.Provider value={{viewMode, setViewMode}}>
            {children}
        </ViewModeContext.Provider>
    );
};

export const useViewMode = () => {
    const context = useContext(ViewModeContext);
    if (!context) {
        throw new Error("useViewMode must be used within a ViewModeProvider");
    }
    return context;
};
