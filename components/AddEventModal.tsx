import React, { useState } from 'react';
import { addEventToCalendar } from '../services/googleCalendarService';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // Mặc định ngày giờ hiện tại
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16));
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await addEventToCalendar({
                summary: title,
                description: description,
                startDateTime: new Date(startDate),
                endDateTime: new Date(endDate),
            });
            
            setMessage({ type: 'success', text: 'Đã thêm vào Google Calendar thành công!' });
            
            // Reset form & Close after delay
            setTimeout(() => {
                onClose();
                setTitle('');
                setDescription('');
                setMessage(null);
            }, 1500);

        } catch (error: any) {
            let errorMsg = "Có lỗi xảy ra khi kết nối Google Calendar.";
            if (error?.result?.error?.message) {
                errorMsg = error.result.error.message;
            } else if (error?.message) {
                errorMsg = error.message;
            }
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 animate-[float_0.3s_ease-out]">
                <div className="bg-primary/5 p-6 border-b border-primary/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined filled-icon">event</span>
                        Tạo sự kiện
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="size-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {message && (
                        <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="material-symbols-outlined text-lg">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Tiêu đề</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="VD: Cúng rằm, Đi chùa..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Bắt đầu</label>
                            <input 
                                type="datetime-local" 
                                required
                                className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Kết thúc</label>
                            <input 
                                type="datetime-local" 
                                required
                                className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Ghi chú</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            placeholder="Chi tiết sự kiện..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-glow hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="GCal" className="w-5 h-5" />
                                    <span>Thêm vào Google Calendar</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;