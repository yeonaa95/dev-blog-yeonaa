// src/layout/MainLayout.tsx

/**
 * 공통 레이아웃 컴포넌트
 *
 * Day 1 컴포넌트 구조도: Layout (공통 레이아웃)
 * - Header
 * - Main (children)
 * - Footer
 */

import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import type { User } from "@/types";

interface LayoutProps {
    user: User | null;
}

function Layout({ user }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header user={user} />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
                    © 2025 My Dev Blog. Built with React + Firebase
                </div>
            </footer>
        </div>
    );
}

export default Layout;
