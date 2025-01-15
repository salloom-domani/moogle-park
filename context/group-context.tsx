"use client"
import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext<{ groupId: string | null; setGroupId: (id: string) => void } | null>(null);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [groupId, setGroupId] = useState<string | null>(null);

    return (
        <GroupContext.Provider value={{ groupId, setGroupId }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroup = () => {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error('useGroup must be used within a GroupProvider');
    }
    return context;
};
