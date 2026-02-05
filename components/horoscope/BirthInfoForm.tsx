import React, { useState } from 'react';
import { BirthInfo, CalendarType, Gender } from '../../types/horoscopeTypes';
import { EARTHLY_BRANCHES } from '../../constants/horoscopeConstants';

interface BirthInfoFormProps {
    onSubmit: (birthInfo: BirthInfo) => void;
    initialData?: Partial<BirthInfo>;
}

const BirthInfoForm: React.FC<BirthInfoFormProps> = ({ onSubmit, initialData }) => {
    const [calendarType, setCalendarType] = useState<CalendarType>(initialData?.calendarType || 'solar');
    const [date, setDate] = useState<string>(
        initialData?.date ? initialData.date.toISOString().split('T')[0] : ''
    );
    const [hour, setHour] = useState<number>(initialData?.hour ?? -1);
    const [gender, setGender] = useState<Gender | ''>(initialData?.gender || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || hour === -1 || !gender) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const birthInfo: BirthInfo = {
            date: new Date(date),
            calendarType,
            hour,
            gender: gender as Gender
        };

        onSubmit(birthInfo);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Calendar Type Toggle */}
            <div>
                <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-3 block">
                    Loại lịch
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setCalendarType('solar')}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${calendarType === 'solar'
                                ? 'bg-accent-green text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px] mb-1">wb_sunny</span>
                        <div className="text-sm">Dương lịch</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCalendarType('lunar')}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${calendarType === 'lunar'
                                ? 'bg-accent-green text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px] mb-1">nightlight</span>
                        <div className="text-sm">Âm lịch</div>
                    </button>
                </div>
            </div>

            {/* Date Input */}
            <div>
                <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                    Ngày sinh
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                />
            </div>

            {/* Hour Selection */}
            <div>
                <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-3 block">
                    Giờ sinh
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {EARTHLY_BRANCHES.map((branch, index) => (
                        <button
                            key={branch.id}
                            type="button"
                            onClick={() => setHour(index)}
                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${hour === index
                                    ? 'bg-accent-green text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-text-main dark:text-zinc-50 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            <div className="font-bold">{branch.name}</div>
                            <div className="text-xs opacity-75 mt-0.5">{branch.hour}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Gender Selection */}
            <div>
                <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-3 block">
                    Giới tính
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${gender === 'male'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">male</span>
                        <span>Nam</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${gender === 'female'
                                ? 'bg-pink-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">female</span>
                        <span>Nữ</span>
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                <span>Xem Tử Vi</span>
            </button>
        </form>
    );
};

export default BirthInfoForm;
