import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserAuth from './UserAuth'; // <-- 1. Import cái nút vừa làm

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 2. Đặt nút đăng nhập vào đây, nó sẽ nằm đè lên trên App */}
    <UserAuth />
    <App />
  </React.StrictMode>
);