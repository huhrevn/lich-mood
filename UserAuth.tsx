import React from 'react';
import { useAuth } from './contexts/AuthContext'; // Updated import

const UserAuth = () => {
  const { user, loading, login, logout } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 hidden md:block">
      {user ? (
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-lg px-4 py-2 rounded-full border border-gray-200">
          <img
            src={user.avatar || ''}
            alt="Avt"
            className="w-8 h-8 rounded-full border border-gray-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
            }}
          />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-gray-700">{user.name}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
          >
            Thoát
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          disabled={loading}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
          )}
          Kết nối Lịch
        </button>
      )}
    </div>
  );
};

export default UserAuth;