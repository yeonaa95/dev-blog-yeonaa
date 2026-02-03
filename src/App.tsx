// src/App.tsx

/**
 * 블로그 앱 메인 컴포넌트
 *
 * React Router를 사용하여 페이지 라우팅을 설정합니다.
 * 인증 상태 감지를 통해 로그인 상태를 관리합니다.
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";
import type { User } from "./types";

// 레이아웃
import MainLayout from "@/layout/MainLayout";

// 페이지
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";

function App() {
    // 인증 상태
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    /**
     * 인증 상태 감지
     *
     * Day 1 요구사항: AUTH-005 (로그인 상태 유지)
     *
     * onAuthStateChanged를 통해:
     * - 앱 시작 시 기존 로그인 상태 복원
     * - 로그인/로그아웃 시 상태 업데이트
     */
    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setIsAuthLoading(false);
        });

        // 클린업: 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, []);

    // 인증 상태 로딩 중
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-8 h-8 border-4 border-blue-600 border-t-transparent 
                        rounded-full animate-spin mx-auto"
                    ></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 레이아웃이 적용되는 라우트 */}
                <Route element={<MainLayout user={user} />}>
                    <Route path="/" element={<HomePage />} />
                    {/* Day 6에서 추가될 라우트들 */}
                    {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
                    {/* <Route path="/write" element={<PostWritePage />} /> */}
                </Route>

                {/* 레이아웃 없이 표시되는 인증 페이지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
