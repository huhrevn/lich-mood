
import React from 'react';
import { DesktopContent } from './SharedComponents';
import { AppProfile } from '../settings.logic';

interface ProfileSettingsProps {
    profile: AppProfile;
    errors: { [key: string]: string };
    isLoading: boolean;
    isDirty: boolean;
    handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (field: keyof AppProfile, value: string) => void;
    saveProfile: () => void;
    startGoogleLogin: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
    profile, errors, isLoading, isDirty,
    handleAvatarChange, handleInputChange, saveProfile, startGoogleLogin
}) => {
    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <DesktopContent title="Thông tin tài khoản">
                <div className="flex items-start gap-8 mb-8">
                    {/* AVATAR SECTION */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="size-28 rounded-full overflow-hidden border-4 border-gray-50 dark:border-zinc-800 shadow-sm relative group bg-gray-100">
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-white">edit</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg shadow-sm transition-colors w-full relative overflow-hidden">
                            Tải ảnh lên
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </button>
                    </div>

                    {/* FORM SECTION */}
                    <div className="flex-1 grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Họ và tên</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-all outline-none ${errors.name ? 'border-red-300' : 'border-gray-200 dark:border-zinc-700'}`}
                            />
                            {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tên hiển thị</label>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-all outline-none"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">mail</span>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed select-none"
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Số điện thoại</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">call</span>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full bg-gray-50 dark:bg-zinc-800 border rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-all outline-none ${errors.phone ? 'border-red-300' : 'border-gray-200 dark:border-zinc-700'}`}
                                />
                            </div>
                            {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.phone}</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Giới thiệu bản thân</label>
                            <textarea
                                rows={3}
                                value={profile.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-all outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {!profile.isLoggedIn && (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-orange-800">Tài khoản chưa kết nối</h4>
                                <p className="text-xs text-orange-600">Đăng nhập để đồng bộ dữ liệu và sử dụng tính năng nâng cao.</p>
                            </div>
                        </div>
                        <button onClick={startGoogleLogin} className="px-4 py-2 bg-white border border-orange-200 text-orange-700 text-sm font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors">
                            Kết nối ngay
                        </button>
                    </div>
                )}
            </DesktopContent>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={saveProfile}
                    disabled={!isDirty || isLoading || Object.keys(errors).length > 0}
                    className="px-8 py-3 rounded-xl bg-accent-green text-white text-sm font-bold shadow-glow hover:bg-primary-dark transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    {isLoading ? (
                        <><span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Đang lưu...</span></>
                    ) : (
                        <><span className="material-symbols-outlined">save</span>Lưu thay đổi</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
