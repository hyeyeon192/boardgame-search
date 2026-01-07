import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">찬준 하우스</h1>
        <p className="text-gray-600 mb-6">
          보드게임 검색 서비스에 오신 것을 환영합니다!
          현재 GitHub Pages를 통해 성공적으로 배포되었습니다.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              🚀 배포 성공!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
