import React, { useState, useEffect } from 'react';
import { 
    rollOracle, 
    loadHistory, 
    saveHistory, 
    pinHistory, 
    deleteHistory, 
    clearHistory, 
    FortuneEntry, 
    HistoryEntry 
} from '../../services/fortuneService';

export const useFortuneLogic = () => {
    const [isShaking, setIsShaking] = useState(false);
    const [result, setResult] = useState<FortuneEntry | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    const handleShake = () => {
        if (isShaking) return;
        setIsShaking(true);
        setResult(null);
        
        setTimeout(() => {
            const newFortune = rollOracle();
            saveHistory(newFortune);
            setHistory(loadHistory());
            setResult(newFortune);
            setIsShaking(false);
        }, 1500);
    };

    const resetFortune = () => setResult(null);

    const handlePin = (uuid: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory(pinHistory(uuid));
    };

    const handleDelete = (uuid: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc muốn xóa kết quả này?")) {
            setHistory(deleteHistory(uuid));
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Xóa toàn bộ lịch sử xin xăm?")) {
            setHistory(clearHistory());
        }
    };

    return {
        isShaking,
        result,
        history,
        handleShake,
        resetFortune,
        handlePin,
        handleDelete,
        handleClearAll,
        setResult // Exposed for history click
    };
};