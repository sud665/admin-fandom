import { initializeApp } from 'firebase-admin/app'
initializeApp()

export { onUserCreate } from './on-user-create'
export { zap } from './zap'
export { dailyCheckin } from './daily-checkin'
export { syncSteps } from './sync-steps'
export { scheduleEclipse } from './schedule-eclipse'
export { resolveEclipse, checkExpiredEclipses } from './resolve-eclipse'
