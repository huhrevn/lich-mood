import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase'; 
import { signInWithPopup, signOut, onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';

const UserAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Nếu user thoát, xóa luôn token cho sạch
      if (!currentUser) {
        localStorage.removeItem('google_calendar_token');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      // Xin quyền đọc lịch
      googleProvider.addScope('https://www.googleapis.com/auth/calendar.events.readonly'); 
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // LẤY CHÌA KHÓA (TOKEN)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        // Lưu chìa khóa vào túi (LocalStorage) để lát dùng
        localStorage.setItem('google_calendar_token', token);
        console.log("Đã lấy được token:", token);
      }

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Lỗi đăng nhập, xem console.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('google_calendar_token'); // Xóa token khi đăng xuất
    window.location.reload(); // Tải lại trang cho sạch sẽ
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-lg px-4 py-2 rounded-full border border-gray-200">
          <img 
            src={user.photoURL || ''} 
            alt="Avt" 
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-gray-700">{user.displayName}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
          >
            Thoát
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Kết nối Lịch
        </button>
      )}
    </div>
  );
};

export default UserAuth;