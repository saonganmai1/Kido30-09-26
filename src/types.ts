export type Language = 'vi' | 'en';

export type UserRole = 'admin' | 'parent' | 'kid';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  email?: string;
  avatar: string;
  vipExpiryDate: string;
  isVip: boolean;
  createdAt: string;
  stars?: number;
  level?: number;
  xp?: number;
  completedLessons?: number;
  trialTimeSeconds?: number;
  allowedGrades?: string[];
  checkedInToday?: boolean;
  streakDays?: number;
  streak?: number;
  studyTimeMinutes?: number;
  learnedVocabCount?: number;
  activeTheme?: string;
  linkedKidIds?: string[];
  linkedParentIds?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  isLocked?: boolean;
  status?: string;
  adminNote?: string;
  pendingParentRequests?: {
    parentId: string;
    parentName: string;
    parentEmail?: string;
    requestedAt: string;
  }[];
  pendingKidRequests?: {
    kidId: string;
    kidName: string;
    kidUsername: string;
    requestedAt: string;
  }[];
}

export interface AdminErrorReport {
  id: string;
  timestamp: string;
  userRole?: string;
  userName?: string;
  userId?: string;
  activeTab?: string;
  errorMessage: string;
  errorStack?: string;
  componentStack?: string;
}

export type ActiveTab = 
  | 'home'
  | 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5'
  | 'roadmap' | 'listening-speaking-img' | 'reading-writing-img' | 'speaking-topic-ai' | 'writing-topic-ai' | 'practice-ex' | 'sample-exams' | 'reports'
  | 'vocab' | 'flashcards' | 'quiz' | 'listening' | 'speaking' | 'story' | 'reading' | 'daily-quotes' | 'grammar-tenses'
  | 'mind-thinking' | 'shadowing' | 'storyboard-shadowing' | 'dictation' | 'task-station' | 'video-lectures'
  | 'games' | 'rewards'
  | 'parent-corner' | 'journal' | 'theme-settings' | 'settings' | 'admin-panel';

export interface UserProfile {
  id?: string;
  name: string;
  role: UserRole;
  level: number;
  xp?: number;
  maxXp?: number;
  stars: number;
  streakDays: number;
  avatar: string;
  completedLessonsCount: number;
  totalLessonsCount?: number;
  learnedVocabCount?: number;
  totalVocabCount?: number;
  studyTimeMinutes?: number;
  checkedInToday: boolean;
  trialTimeSeconds: number; // e.g. 390m 46s = 23446s
  isVip?: boolean;
  vipExpiryDate?: string;
  username?: string;
  allowedGrades?: string[];
  linkedKidIds?: string[];
  linkedParentIds?: string[];
  pendingParentRequests?: {
    parentId: string;
    parentName: string;
    parentEmail?: string;
    requestedAt: string;
  }[];
}

export interface UnitLesson {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  tagColor: 'blue' | 'green' | 'purple' | 'pink';
  iconType: 'pin' | 'star' | 'crown' | 'ribbon';
}

export interface DailyTask {
  id: string;
  title: string;
  icon: string;
  current: number;
  target: number;
  rewardStars: number;
  claimed: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  meaningVi: string;
  meaningEn: string;
  example: string;
  category: string;
  imageUrl: string;
  audioUrl?: string;
  mastered: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  icon: string;
  category: 'avatar' | 'sticker' | 'badge' | 'toy';
  unlocked: boolean;
}

export interface ParentNote {
  id: string;
  date: string;
  content: string;
  from: string;
}

export interface VipTransaction {
  id: string;
  timestamp: string;
  adminName: string;
  adminUsername?: string;
  targetAccountId: string;
  targetAccountName: string;
  action: 'add' | 'subtract' | 'cancel';
  amountText: string;
  previousExpiry?: string;
  newExpiry: string;
  note?: string;
  isArchived?: boolean;
  affectedAccountsDetails?: {
    id: string;
    name: string;
    username?: string;
    role?: string;
    previousExpiry?: string;
    newExpiry?: string;
    relationship?: string;
  }[];
}

export interface LearningReport {
  date: string;
  minutesSpent: number;
  lessonsDone: number;
  accuracyScore: number;
}

export interface AccountAuditLog {
  id: string;
  timestamp: string;
  timestampMs: number;
  actorName: string;
  targetAccountId?: string;
  targetAccountName: string;
  targetAccountRole?: UserRole;
  actionType:
    | 'create'
    | 'edit'
    | 'delete'
    | 'stars_level'
    | 'vip'
    | 'permission'
    | 'link'
    | 'unlink'
    | 'reset'
    | 'undo'
    | 'other';
  actionTitle: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  adminNote?: string;
  isUndone?: boolean;
  previousAccount?: UserAccount;
  affectedAccountsDetails?: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    oldValue?: string;
    newValue?: string;
    details?: string;
    avatar?: string;
    email?: string;
    isUndone?: boolean;
    previousAccount?: UserAccount;
  }[];
}

export interface UserLoginSession {
  id: string;
  userId: string;
  username: string;
  userName: string;
  userRole: UserRole;
  loginTime: string;
  loginTimestampMs: number;
  logoutTime?: string;
  logoutTimestampMs?: number;
  ipAddress: string;
  status: 'active' | 'logged_out';
  deviceInfo?: string;
}

export interface UndoItem {
  id: string;
  timestamp: number;
  description: string;
  previousAccounts: UserAccount[];
  updatedAccounts?: UserAccount[];
  changedDetails?: string;
  isRestored?: boolean;
}

export interface StarTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentUsername?: string;
  amount: number;
  type: 'earned_lesson' | 'daily_checkin' | 'reward_redeem' | 'admin_adjust' | 'quiz_bonus' | 'streak_bonus' | 'other';
  source: string;
  timestamp: string;
  timestampMs: number;
  balanceAfter: number;
  note?: string;
  actorName?: string;
}

export type BroadcastCategory = 'urgent' | 'event' | 'info' | 'warning' | 'success';
export type BroadcastPriority = 'urgent' | 'normal' | 'joy';
export type BroadcastTargetAudience = 'all_students' | 'online_students' | 'all_accounts' | 'specific_user';

export interface BroadcastReadReceipt {
  accountId: string;
  accountName: string;
  readAt: string;
}

export interface SystemBackupRecord {
  id: string;
  timestamp: string;
  timestampMs: number;
  backupType: 'manual' | 'auto_periodic';
  triggeredBy: string;
  summary: {
    totalAuditLogs: number;
    totalAccounts: number;
    totalLoginSessions?: number;
    totalStarTransactions?: number;
  };
  exportSizeKb?: number;
  status: 'success' | 'failed';
  notes?: string;
  dataSnapshot?: {
    auditLogs: AccountAuditLog[];
    accounts?: UserAccount[];
  };
}

export interface AutoBackupConfig {
  enabled: boolean;
  intervalMinutes: number; // 60, 360, 720, 1440 (1 day)
  lastBackupMs: number;
  nextBackupMs: number;
  autoDownloadJson: boolean;
}

export interface SystemBroadcastNotification {
  id: string;
  title: string;
  message: string;
  senderName?: string;
  timestamp: string;
  timestampMs: number;
  category: BroadcastCategory;
  priority?: BroadcastPriority;
  targetAudience: BroadcastTargetAudience;
  targetAccountId?: string;
  isActive: boolean;
  kidoEmoji?: string;
  dinoEmoji?: string;
  imageUrl?: string;
  readByAccountIds?: string[];
  readReceipts?: BroadcastReadReceipt[];
  expiryMinutes?: number;
  playAlertSound?: boolean;
  toastType?: string;
  actionTab?: string;
  actionLabel?: string;
  isProcessed?: boolean;
  processedAt?: string;
}

export type ToastType =
  | 'default'
  | 'warning'
  | 'success'
  | 'error'
  | 'email'
  | 'goal'
  | 'urgent'
  | 'vip'
  | 'stars'
  | 'streak'
  | 'level'
  | 'broadcast'
  | 'info';

export type ToastCategory =
  | 'all'
  | 'account'
  | 'learning'
  | 'vip'
  | 'parent'
  | 'system'
  | 'security'
  | 'gamification';

export type ToastSoundEffect =
  | 'success'
  | 'error'
  | 'click'
  | 'fanfare'
  | 'coin'
  | 'streak'
  | 'none';

export interface ManagedToastItem {
  id: string;
  code: string;
  title: string;
  message: string;
  type: ToastType;
  category: 'account' | 'learning' | 'vip' | 'parent' | 'system' | 'security' | 'gamification';
  badgeText?: string;
  iconEmoji?: string;
  actionLabel?: string;
  actionTab?: string;
  soundEffect?: ToastSoundEffect;
  durationMs?: number;
  isSystemPreset: boolean;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  triggerCount?: number;
  lastTriggeredAt?: string;
  description?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  timestamp?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type?: ToastType | string;
  createdAt: string;
  read: boolean;
  userId?: string;
  targetUserId?: string;
  actionTab?: string;
}

export interface WeeklyGoalConfig {
  targetLessons: number;
  targetStudyMinutes: number;
  targetStars: number;
  autoEmailAlerts: boolean;
  parentEmail?: string;
  reminderFrequency: 'always' | 'weekend_only' | 'daily';
}

export interface StudentWeeklyGoalReport {
  studentId: string;
  studentName: string;
  studentUsername: string;
  avatar: string;
  parentEmail?: string;
  parentName?: string;
  targetLessons: number;
  completedLessons: number;
  lessonsProgressPercent: number;
  targetMinutes: number;
  studyMinutes: number;
  minutesProgressPercent: number;
  targetStars: number;
  starsEarned: number;
  starsProgressPercent: number;
  overallScorePercent: number;
  status: 'achieved' | 'needs_effort' | 'missed';
  statusText: string;
  missingLessons: number;
  missingMinutes: number;
  missingStars: number;
  isGoalMet: boolean;
  kidoAdvice: string;
  dinoAdvice?: string;
  lastReminderSentAt?: string;
}

export interface ParentEmailRecord {
  id: string;
  studentId: string;
  studentName: string;
  parentEmail: string;
  parentName?: string;
  subject: string;
  content: string;
  htmlContent?: string;
  sentAt: string;
  sentAtMs: number;
  reason: 'weekly_goal_unmet' | 'weekly_summary' | 'manual_reminder';
  status: 'sent' | 'delivered' | 'simulated';
  weeklyMetrics?: {
    completedLessons: number;
    targetLessons: number;
    studyMinutes: number;
    targetMinutes: number;
    stars: number;
    targetStars: number;
  };
}

export interface VipPromotionConfig {
  id: string;
  title: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  bannerText: string;
  ctaText: string;
  isEnabled: boolean;
  bgGradient: string;
  targetAudience: 'non_vip' | 'all';
  featuresList: string[];
  updatedAt?: string;
  updatedBy?: string;
}




