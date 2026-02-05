import React, { useState, useEffect } from 'react';
import { Memorial, MemorialFormData, MemorialRelation } from '../../types/memorialTypes';
import { getRelationLabel } from '../../services/memorialService';

interface AddMemorialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: MemorialFormData) => void;
    editMemorial?: Memorial | null;
}

const RELATIONS: { value: MemorialRelation; label: string }[] = [
    { value: 'ong-noi', label: 'Ông nội' },
    { value: 'ba-noi', label: 'Bà nội' },
    { value: 'ong-ngoai', label: 'Ông ngoại' },
    { value: 'ba-ngoai', label: 'Bà ngoại' },
    { value: 'cha', label: 'Cha' },
    { value: 'me', label: 'Mẹ' },
    { value: 'vo', label: 'Vợ' },
    { value: 'chong', label: 'Chồng' },
    { value: 'anh', label: 'Anh' },
    { value: 'chi', label: 'Chị' },
    { value: 'em', label: 'Em' },
    { value: 'bac', label: 'Bác' },
    { value: 'chu', label: 'Chú' },
    { value: 'co', label: 'Cô' },
    { value: 'di', label: 'Dì' },
    { value: 'khac', label: 'Khác' }
];

const AddMemorialModal: React.FC<AddMemorialModalProps> = ({ isOpen, onClose, onSave, editMemorial }) => {
    const [formData, setFormData] = useState<MemorialFormData>({
        name: '',
        relation: 'cha',
        lunarDay: 1,
        lunarMonth: 1,
        note: ''
    });

    useEffect(() => {
        if (editMemorial) {
            setFormData({
                name: editMemorial.name,
                relation: editMemorial.relation,
                lunarDay: editMemorial.lunarDay,
                lunarMonth: editMemorial.lunarMonth,
                note: editMemorial.note || ''
            });
        } else {
            setFormData({
                name: '',
                relation: 'cha',
                lunarDay: 1,
                lunarMonth: 1,
                note: ''
            });
        }
    }, [editMemorial, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên');
            return;
        }

        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full shadow-2xl">
                {/* Header */}
                <div className="bg-accent-green p-6 rounded-t-3xl">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1">
                                {editMemorial ? 'Sửa ngày giỗ' : 'Thêm ngày giỗ'}
                            </h2>
                            <p className="text-white/80 text-sm">
                                Nhập thông tin ngày giỗ theo âm lịch
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white">close</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                            Tên người quá cố *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Nguyễn Văn A"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                        />
                    </div>

                    {/* Relation */}
                    <div>
                        <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                            Quan hệ *
                        </label>
                        <select
                            value={formData.relation}
                            onChange={(e) => setFormData({ ...formData, relation: e.target.value as MemorialRelation })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                        >
                            {RELATIONS.map(rel => (
                                <option key={rel.value} value={rel.value}>
                                    {rel.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lunar Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                                Ngày âm lịch *
                            </label>
                            <select
                                value={formData.lunarDay}
                                onChange={(e) => setFormData({ ...formData, lunarDay: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                            >
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>
                                        Ngày {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                                Tháng âm lịch *
                            </label>
                            <select
                                value={formData.lunarMonth}
                                onChange={(e) => setFormData({ ...formData, lunarMonth: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <option key={month} value={month}>
                                        Tháng {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-sm font-medium text-text-main dark:text-zinc-50 mb-2 block">
                            Ghi chú (tùy chọn)
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="Thêm ghi chú nếu cần..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-text-main dark:text-zinc-50 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-green/30 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-accent-green text-white hover:bg-accent-green/90 transition-all font-medium"
                        >
                            {editMemorial ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemorialModal;
