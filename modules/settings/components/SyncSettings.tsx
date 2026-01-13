
import React from 'react';
import { DesktopCard } from './SharedComponents';
import { SyncConfig } from '../settings.logic';

interface SyncSettingsProps {
    syncConfig: SyncConfig;
    setSyncConfig: React.Dispatch<React.SetStateAction<SyncConfig>>;
    availableCalendars: Array<{id: string, summary: string, color: string}>;
    isSyncing: boolean;
    connectCalendar: () => void;
    disconnectCalendar: () => void;
    simulateSync: () => void;
    toggleCalendarSelection: (id: string) => void;
}

const SyncSettings: React.FC<SyncSettingsProps> = ({
    syncConfig, setSyncConfig, availableCalendars, isSyncing,
    connectCalendar, disconnectCalendar, simulateSync, toggleCalendarSelection
}) => {
    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <DesktopCard title="Đồng bộ Google Calendar">
                {!syncConfig.isConnected ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="GCal" className="size-16 mb-4" />
                        <h3 className="text-lg font-bold text-text-main">Chưa kết nối Google Calendar</h3>
                        <p className="text-sm text-gray-500 max-w-md text-center mt-2 mb-6">
                            Đồng bộ hóa các sự kiện, ngày lễ và lời nhắc của bạn. Chúng tôi chỉ truy cập vào các lịch bạn cho phép.
                        </p>
                        <button onClick={connectCalendar} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:shadow-md flex items-center gap-2 transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="size-5" />
                            Kết nối với Google
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-green-800">Đang đồng bộ hóa</h3>
                                    <p className="text-xs text-green-600">
                                        Lần cuối: {syncConfig.lastSyncAt || 'Chưa đồng bộ'} • <span className="underline cursor-pointer" onClick={simulateSync}>Đồng bộ ngay</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={disconnectCalendar} className="text-xs font-bold text-red-500 hover:bg-white hover:shadow-sm px-3 py-1.5 rounded-lg transition-all">
                                Ngắt kết nối
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quyền truy cập</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="scope" checked={syncConfig.scopes === 'readonly'} onChange={() => setSyncConfig({...syncConfig, scopes: 'readonly'})} className="text-accent-green focus:ring-accent-green" />
                                            <span className="text-sm font-medium">Chỉ xem (Read-only)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="scope" checked={syncConfig.scopes === 'events'} onChange={() => setSyncConfig({...syncConfig, scopes: 'events'})} className="text-accent-green focus:ring-accent-green" />
                                            <span className="text-sm font-medium">Toàn quyền (Events)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Chiều đồng bộ</label>
                                    <select value={syncConfig.direction} onChange={(e) => setSyncConfig({...syncConfig, direction: e.target.value as any})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-accent-green">
                                        <option value="import">Chỉ nhập (Google → App)</option>
                                        <option value="export">Chỉ xuất (App → Google)</option>
                                        <option value="bidirectional">Hai chiều (2-way Sync)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Xử lý xung đột</label>
                                    <select value={syncConfig.conflictPolicy} onChange={(e) => setSyncConfig({...syncConfig, conflictPolicy: e.target.value as any})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-accent-green">
                                        <option value="app">Ưu tiên App</option>
                                        <option value="google">Ưu tiên Google</option>
                                        <option value="ask">Hỏi tôi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Lịch được chọn</label>
                                    <button onClick={() => setSyncConfig({...syncConfig, selectedCalendars: availableCalendars.map(c => c.id)})} className="text-[10px] font-bold text-accent-green hover:underline">
                                        Chọn tất cả
                                    </button>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-2 max-h-[250px] overflow-y-auto">
                                    {availableCalendars.length === 0 ? (
                                        <div className="text-center py-4 text-xs text-gray-400">Đang tải danh sách lịch...</div>
                                    ) : (
                                        availableCalendars.map(cal => (
                                            <label key={cal.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors">
                                                <input type="checkbox" checked={syncConfig.selectedCalendars.includes(cal.id)} onChange={() => toggleCalendarSelection(cal.id)} className="rounded border-gray-300 text-accent-green focus:ring-accent-green" />
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="size-2.5 rounded-full" style={{ backgroundColor: cal.color }}></span>
                                                    <span className="text-sm font-medium text-text-main truncate">{cal.summary}</span>
                                                </div>
                                                {cal.id === 'primary' && <span className="text-[10px] bg-gray-200 px-1.5 rounded text-gray-600 font-bold">Main</span>}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button onClick={simulateSync} disabled={isSyncing} className="px-6 py-2.5 bg-accent-green hover:bg-primary-dark text-white font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 disabled:opacity-70">
                                {isSyncing ? (
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">sync</span>
                                )}
                                {isSyncing ? 'Đang đồng bộ...' : 'Lưu & Đồng bộ ngay'}
                            </button>
                        </div>
                    </div>
                )}
            </DesktopCard>
        </div>
    );
};

export default SyncSettings;
