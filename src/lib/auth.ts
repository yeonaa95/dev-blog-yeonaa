// src/lib/auth.ts

/**
 * Firebase Authentication 서비스 함수 모음
 *
 * Day 1 API 명세서에서 정의한 인증 관련 함수들을 구현합니다.
 * - AUTH-001: 이메일 회원가입
 * - AUTH-002: 이메일 로그인
 * - AUTH-004: 로그아웃
 *
 * 📚 공식 문서: https://firebase.google.com/docs/auth/web/start
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import type { User } from "@/types";

/**
 * Firebase User를 우리 앱의 User 타입으로 변환
 *
 * Firebase가 제공하는 user 객체에서 필요한 정보만 추출합니다.
 * Day 1 데이터 모델의 User 인터페이스에 맞춰 변환합니다.
 */
export function formatUser(firebaseUser: FirebaseUser): User {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
    };
}

/**
 * 이메일/비밀번호로 회원가입
 *
 * Day 1 요구사항: AUTH-001
 * Day 1 기능명세서: FUNC-001 (회원가입)
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (6자 이상)
 * @returns 생성된 사용자 정보
 * @throws 이미 가입된 이메일, 약한 비밀번호 등의 에러
 */
export async function signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );
    return formatUser(userCredential.user);
}

/**
 * 이메일/비밀번호로 로그인
 *
 * Day 1 요구사항: AUTH-002
 * Day 1 기능명세서: 기본 흐름 참고
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 * @returns 로그인한 사용자 정보
 * @throws 존재하지 않는 사용자, 잘못된 비밀번호 등의 에러
 */
export async function signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
    );
    return formatUser(userCredential.user);
}

/**
 * 로그아웃
 *
 * Day 1 요구사항: AUTH-004
 */
export async function logout(): Promise<void> {
    await signOut(auth);
}

/**
 * 인증 상태 변경 감지
 *
 * Day 1 요구사항: AUTH-005 (로그인 상태 유지)
 *
 * Firebase Auth의 onAuthStateChanged를 래핑합니다.
 * 로그인/로그아웃 시, 또는 페이지 새로고침 시 호출됩니다.
 *
 * @param callback - 인증 상태 변경 시 호출될 함수
 * @returns 구독 해제 함수 (cleanup)
 */
export function subscribeToAuthState(
    callback: (user: User | null) => void,
): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            callback(formatUser(firebaseUser));
        } else {
            callback(null);
        }
    });
}

/**
 * Firebase Auth 에러 메시지를 사용자 친화적인 한글로 변환
 *
 * Day 1 기능명세서: 예외 흐름의 사용자 메시지 참고
 */
export function getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        // 회원가입 에러
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "올바른 이메일 형식을 입력해주세요.",
        "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",

        // 로그인 에러 (v9+ 부터 아래 오류 코드는 auth/invalid-credential 통합됨
        //"auth/user-not-found": "등록되지 않은 이메일입니다.",
        //"auth/wrong-password": "비밀번호가 일치하지 않습니다.",
        
        "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
        "auth/too-many-requests":
            "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",

        // 일반 에러
        "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
        "auth/internal-error":
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };

    return errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다.";
}
