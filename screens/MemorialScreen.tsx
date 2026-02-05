import React, { useState, useEffect } from 'react';
import AddMemorialModal from '../components/memorial/AddMemorialModal';
import { Memorial, UpcomingMemorial, MemorialFormData } from '../types/memorialTypes';
import {
    getMemorials,
    saveMemorial,
    updateMemorial,
    deleteMemorial,
    getUpcomingMemorials,
    getAllMemorialsWithDates,
    getRelationLabel,
    convertLunarToSolar
} from '../services/memorialService';

const MemorialScreen: React.FC = () => {
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [upcomingMemorials, setUpcomingMemorials] = useState<UpcomingMemorial[]>([]);
    const [allMemorialsWithDates, setAllMemorialsWithDates] = useState<UpcomingMemorial[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = () => {
        const loaded = getMemorials();
        setMemorials(loaded);
        setUpcomingMemorials(getUpcomingMemorials(30));
        setAllMemorialsWithDates(getAllMemorialsWithDates());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = (formData: MemorialFormData) => {
        if (editingMemorial) {
            updateMemorial(editingMemorial.id, formData);
        } else {
            saveMemorial(formData);
        }
        loadData();
        setEditingMemorial(null);
    };

    const handleEdit = (memorial: Memorial) => {
        setEditingMemorial(memorial);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc muốn xóa ngày giỗ này?')) {
            deleteMemorial(id);
            loadData();
        }
    };

    const handleAddNew = () => {
        setEditingMemorial(null);
        setIsModalOpen(true);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDaysUntilText = (daysUntil: number): string => {
        if (daysUntil === 0) return 'Hôm nay';
        if (daysUntil === 1) return 'Ngày mai';
        if (daysUntil < 0) return `${Math.abs(daysUntil)} ngày trước`;
        return `Còn ${daysUntil} ngày`;
    };

    const getUrgencyColor = (daysUntil: number): string => {
        if (daysUntil === 0) return 'bg-red-500';
        if (daysUntil <= 3) return 'bg-orange-500';
        if (daysUntil <= 7) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-bg-base px-6 pt-2 pb-24 md:px-8 md:pt-4 md:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-text-main dark:text-zinc-50">
                        Nhắc Ngày Giỗ
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                        Quản lý và nhắc nhớ những ngày kỷ niệm quan trọng của gia đình.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a56db] text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    <span className="material-icons-round text-lg">add</span>
                    Thêm ngày mới
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT COLUMN (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Stats */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">
                            Thống kê
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-xl border border-slate-100 dark:border-zinc-700">
                                <p className="text-slate-500 text-xs mb-1">Tổng số</p>
                                <p className="text-2xl font-bold text-text-main dark:text-zinc-50">
                                    {memorials.length.toString().padStart(2, '0')}
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-blue-600 dark:text-blue-400 text-xs mb-1">Sắp tới</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {upcomingMemorials.length.toString().padStart(2, '0')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Relations Filter */}
                    {memorials.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">
                                Quan hệ
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a56db] text-white rounded-full text-sm font-medium transition-all shadow-md shadow-blue-500/20">
                                    Tất cả
                                    <span className="bg-white/20 px-1.5 rounded text-[10px]">{memorials.length}</span>
                                </button>
                                {Array.from(new Set(memorials.map(m => m.relation))).map((relation) => {
                                    const count = memorials.filter(m => m.relation === relation).length;
                                    return (
                                        <button
                                            key={relation}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
                                        >
                                            {getRelationLabel(relation as import('../types/memorialTypes').MemorialRelation)}
                                            <span className="bg-slate-200 dark:bg-zinc-700 px-1.5 rounded text-[10px] text-slate-500 dark:text-slate-400">
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Months */}
                    {upcomingMemorials.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">
                                Theo tháng (Sắp tới)
                            </h3>
                            <div className="space-y-2">
                                {(() => {
                                    const monthGroups = upcomingMemorials.reduce((acc, upcoming) => {
                                        const month = upcoming.solarDate.getMonth();
                                        if (!acc[month]) acc[month] = 0;
                                        acc[month]++;
                                        return acc;
                                    }, {} as Record<number, number>);

                                    return Object.entries(monthGroups).slice(0, 3).map(([month, count]) => (
                                        <div key={month} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="material-icons-round text-amber-500">event_note</span>
                                                <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                                    Tháng {parseInt(month) + 1}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full">
                                                {count} ngày giỗ
                                            </span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Important Notice */}
                    <div className="bg-[#1a56db] p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-blue-100 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-lg">info</span>
                                Lưu ý quan trọng
                            </h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3">
                                    <span className="material-icons-round text-blue-200 text-lg">auto_mode</span>
                                    <span>Ngày giỗ mặc định lưu theo <strong>Âm lịch</strong>.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-icons-round text-blue-200 text-lg">sync</span>
                                    <span>Hệ thống tự động chuyển sang dương lịch mỗi năm tương ứng.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-icons-round text-blue-200 text-lg">notifications_active</span>
                                    <span>Nhắc nhở sẽ hiển thị trước 30 ngày để gia đình chuẩn bị.</span>
                                </li>
                            </ul>
                        </div>
                        <span className="material-icons-round absolute -bottom-6 -right-6 text-9xl text-white/5 rotate-12">
                            receipt_long
                        </span>
                    </div>
                </div>

                {/* RIGHT COLUMN (8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Upcoming Highlight */}
                    {upcomingMemorials.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/30">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-round text-blue-500">campaign</span>
                                    <h3 className="font-bold text-sm text-text-main dark:text-zinc-50">Sắp tới</h3>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Trong 30 ngày tới</span>
                            </div>
                            <div className="p-6">
                                <div
                                    className="group flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-zinc-800 border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => handleEdit(upcomingMemorials[0].memorial)}
                                >
                                    <div className="flex flex-col items-center justify-center w-20 h-24 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-700 overflow-hidden shrink-0">
                                        <div className="w-full bg-red-500 py-1 text-center text-[10px] text-white font-bold">
                                            THÁNG {upcomingMemorials[0].solarDate.getMonth() + 1}
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold leading-none text-text-main dark:text-zinc-50">
                                                {upcomingMemorials[0].solarDate.getDate()}
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Dương lịch</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row items-center gap-2 mb-1 justify-center md:justify-start">
                                            <span className={`px-2 py-0.5 rounded-lg text-white text-[10px] font-bold uppercase ${getUrgencyColor(upcomingMemorials[0].daysUntil)}`}>
                                                {getDaysUntilText(upcomingMemorials[0].daysUntil)}
                                            </span>
                                            <h4 className="text-lg font-bold text-text-main dark:text-zinc-50">
                                                Giỗ {upcomingMemorials[0].memorial.name}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-round text-base">person</span>
                                                {getRelationLabel(upcomingMemorials[0].memorial.relation)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-round text-base">event</span>
                                                Âm: {upcomingMemorials[0].memorial.lunarDay}/{upcomingMemorials[0].memorial.lunarMonth}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-round text-base">today</span>
                                                {upcomingMemorials[0].solarDate.getFullYear()}: {formatDate(upcomingMemorials[0].solarDate)}
                                            </span>
                                        </p>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
                                        <span className="material-icons-round">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table List */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-zinc-800/30">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-slate-400">format_list_bulleted</span>
                                <h3 className="font-bold text-sm text-text-main dark:text-zinc-50">Tất cả ngày giỗ</h3>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-none">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                    <input
                                        className="pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg w-full md:w-48 focus:ring-blue-500 focus:border-blue-500 text-text-main dark:text-zinc-50"
                                        placeholder="Tìm kiếm..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                                    {memorials.length} kết quả
                                </span>
                            </div>
                        </div>

                        {memorials.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                <span className="material-icons-round text-6xl mb-4 opacity-20">inventory_2</span>
                                <p className="text-sm">Chưa có ngày kỷ niệm nào được lưu.</p>
                                <button
                                    onClick={handleAddNew}
                                    className="mt-4 text-blue-600 font-medium text-sm hover:underline"
                                >
                                    Thêm ngày mới ngay
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 dark:bg-zinc-800/50 text-[10px] uppercase text-slate-400 font-bold tracking-wider border-b border-slate-100 dark:border-zinc-800">
                                        <tr>
                                            <th className="px-6 py-4 whitespace-nowrap">Họ tên & Quan hệ</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Ngày Âm lịch</th>
                                            <th className="px-6 py-4 whitespace-nowrap">Dương lịch {new Date().getFullYear()}</th>
                                            <th className="px-6 py-4 text-right whitespace-nowrap">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {allMemorialsWithDates
                                            .filter(item => item.memorial.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((item) => (
                                                <tr key={item.memorial.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                                                {item.memorial.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-text-main dark:text-zinc-50 truncate max-w-[120px]">
                                                                    {item.memorial.name}
                                                                </p>
                                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-slate-400 rounded text-[10px] mt-0.5 inline-block">
                                                                    {getRelationLabel(item.memorial.relation)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-text-main dark:text-zinc-50">
                                                                {item.memorial.lunarDay} tháng {item.memorial.lunarMonth}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">Âm lịch hằng năm</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm text-text-main dark:text-zinc-50">
                                                            {formatDate(item.solarDate)}
                                                        </span>
                                                        {item.daysUntil <= 30 && (
                                                            <div className={`text-[10px] font-bold mt-0.5 ${item.daysUntil <= 7 ? 'text-red-500' : 'text-orange-500'}`}>
                                                                {getDaysUntilText(item.daysUntil)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEdit(item.memorial)}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <span className="material-icons-round text-lg">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.memorial.id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                title="Xóa"
                                                            >
                                                                <span className="material-icons-round text-lg">delete_outline</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AddMemorialModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingMemorial(null);
                }}
                onSave={handleSave}
                editMemorial={editingMemorial}
            />
        </div>
    );
};

export default MemorialScreen;
