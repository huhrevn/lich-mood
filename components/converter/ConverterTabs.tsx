
import React from 'react';
import { ConversionMode } from '../../types/converterTypes';

interface ConverterTabsProps {
    mode: ConversionMode;
    onModeChange: (mode: ConversionMode) => void;
}

const ConverterTabs: React.FC<ConverterTabsProps> = ({ mode, onModeChange }) => {
    return (
        <div className="w-full bg-gray-200/80 p-1.5 rounded-full flex relative mb-8">
            <button 
                onClick={() => onModeChange('SOLAR_TO_LUNAR')}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${mode === 'SOLAR_TO_LUNAR' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Dương → Âm
            </button>
            <button 
                onClick={() => onModeChange('LUNAR_TO_SOLAR')}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${mode === 'LUNAR_TO_SOLAR' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Âm → Dương
            </button>
            
            <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-accent-green rounded-full shadow-md transition-all duration-300 ease-in-out ${mode === 'SOLAR_TO_LUNAR' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
            ></div>
        </div>
    );
};

export default React.memo(ConverterTabs);
