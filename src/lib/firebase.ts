// src/lib/firebase.ts

/**
 * Firebase 초기화 및 서비스 인스턴스 내보내기
 * 
 * 이 파일에서 Firebase 앱을 초기화하고,
 * 앱 전체에서 사용할 Firebase 서비스 인스턴스를 export합니다.
 * 
 * 📚 공식 문서: https://firebase.google.com/docs/web/setup
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 추가

/**
 * Firebase 설정 객체
 * 
 * 환경 변수에서 값을 가져옵니다.
 * import.meta.env는 Vite에서 환경 변수에 접근하는 방식입니다.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Firebase Storage 인스턴스
 *
 * 파일 저장 기능을 제공합니다.
 * - 이미지, 문서 등 파일 업로드/다운로드
 * - 파일 URL 생성
 *
 * 📚 Storage 문서: https://firebase.google.com/docs/storage/web/start
 */
export const storage = getStorage(app);

export default app;
