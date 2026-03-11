// Firebase 연결은 @fandom/firebase 패키지를 통해 관리
// Expo에서는 환경변수를 app.config.ts의 extra로 전달
// 현재는 mock 데이터로 동작하므로 실제 Firebase 연결 불필요
export { getApp, getDb, getAuthInstance } from '@fandom/firebase'
