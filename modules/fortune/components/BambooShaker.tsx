
import React from 'react';

interface BambooShakerProps {
    isShaking: boolean;
}

const BambooShaker: React.FC<BambooShakerProps> = ({ isShaking }) => {
    return (
        <div className={`relative w-48 h-80 perspective-1000 ${isShaking ? 'animate-shake' : ''}`}>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-44 h-64 z-20">
                <div className="w-full h-full bg-gradient-to-r from-[#C19A6B] via-[#E6D0A5] to-[#C19A6B] rounded-b-[2rem] shadow-2xl relative overflow-hidden flex flex-col items-center border-x border-[#A1887F]/30">
                    <div className="absolute top-0 w-full h-12 bg-[#3E2723] rounded-[50%] -translate-y-1/2 shadow-inner border-b-2 border-[#5D4037]"></div>
                    <div className="w-full h-[1px] bg-[#8D6E63]/30 shadow-sm mt-20"></div>
                    <div className="w-full h-[1px] bg-[#8D6E63]/30 shadow-sm mt-24"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 mt-6 size-20 bg-accent-red shadow-lg rotate-45 flex items-center justify-center border-2 border-[#FFD54F]">
                        <div className="w-[85%] h-[85%] border border-[#FFECB3]/50 flex items-center justify-center">
                            <span className="font-serif text-4xl font-bold text-[#FFECB3] -rotate-45 drop-shadow-md">Lộc</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-64 z-10 flex justify-center items-end pb-10">
                <div className="w-3.5 h-64 bg-gray-200 border border-gray-300 absolute -ml-10 -mt-8 -rotate-6 transform origin-bottom"><div className="w-full h-8 bg-accent-red"></div></div>
                <div className="w-3.5 h-60 bg-gray-200 border border-gray-300 absolute -ml-4 -mt-2 -rotate-3 transform origin-bottom"><div className="w-full h-8 bg-accent-red"></div></div>
                <div className="w-3.5 h-64 bg-gray-200 border border-gray-300 absolute ml-6 -mt-6 rotate-2 transform origin-bottom"><div className="w-full h-8 bg-accent-red"></div></div>
            </div>
        </div>
    );
};

export default React.memo(BambooShaker);
