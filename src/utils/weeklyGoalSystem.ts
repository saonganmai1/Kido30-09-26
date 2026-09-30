import { UserAccount, WeeklyGoalConfig, StudentWeeklyGoalReport, ParentEmailRecord } from '../types';

export const DEFAULT_WEEKLY_GOAL: WeeklyGoalConfig = {
  targetLessons: 6,
  targetStudyMinutes: 60,
  targetStars: 50,
  autoEmailAlerts: true,
  parentEmail: 'caoquocbaozx4@gmail.com',
  reminderFrequency: 'always',
};

const WEEKLY_GOAL_CONFIG_KEY = 'KIDO_WEEKLY_GOAL_CONFIG_V1';
const PARENT_EMAIL_HISTORY_KEY = 'KIDO_PARENT_EMAIL_HISTORY_V1';

/**
 * Retrieve weekly goal configuration from local storage
 */
export function getWeeklyGoalConfig(): WeeklyGoalConfig {
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_CONFIG_KEY) || localStorage.getItem('DINO_WEEKLY_GOAL_CONFIG_V1');
    if (raw) {
      return { ...DEFAULT_WEEKLY_GOAL, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load weekly goal config', e);
  }
  return DEFAULT_WEEKLY_GOAL;
}

/**
 * Save weekly goal configuration to local storage
 */
export function saveWeeklyGoalConfig(config: WeeklyGoalConfig): void {
  try {
    localStorage.setItem(WEEKLY_GOAL_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save weekly goal config', e);
  }
}

/**
 * Evaluate single student's weekly goal completion
 */
export function evaluateStudentWeeklyGoal(
  student: UserAccount,
  config?: WeeklyGoalConfig,
  parentAccount?: UserAccount
): StudentWeeklyGoalReport {
  const goalConfig = config || getWeeklyGoalConfig();
  
  // Calculate mock or real weekly metrics based on current progress
  const completedLessons = student.completedLessons !== undefined ? student.completedLessons : Math.min(student.level || 0, goalConfig.targetLessons);
  const studyMinutes = student.studyTimeMinutes !== undefined ? student.studyTimeMinutes : (student.streakDays || 0) * 8;
  const starsEarned = student.stars !== undefined ? student.stars : 0;

  const targetLessons = Math.max(1, goalConfig.targetLessons);
  const targetMinutes = Math.max(10, goalConfig.targetStudyMinutes);
  const targetStars = Math.max(10, goalConfig.targetStars);

  const lessonsPercent = Math.min(100, Math.round((completedLessons / targetLessons) * 100));
  const minutesPercent = Math.min(100, Math.round((studyMinutes / targetMinutes) * 100));
  const starsPercent = Math.min(100, Math.round((starsEarned / targetStars) * 100));

  // Overall combined score (weighted: lessons 50%, minutes 30%, stars 20%)
  const overallScorePercent = Math.round(
    lessonsPercent * 0.5 + minutesPercent * 0.3 + starsPercent * 0.2
  );

  let status: 'achieved' | 'needs_effort' | 'missed';
  let statusText: string;
  let kidoAdvice: string;

  if (lessonsPercent >= 100) {
    status = 'achieved';
    statusText = 'Hoàn thành xuất sắc mục tiêu tuần! 🌟';
    kidoAdvice = `Khủng Long Kido khen ngợi bé ${student.name} đã rất chăm chỉ và vượt chỉ tiêu tuần này!`;
  } else if (lessonsPercent >= 50) {
    status = 'needs_effort';
    statusText = 'Tiến độ trung bình - Cần nỗ lực thêm ⚠️';
    kidoAdvice = `Bé ${student.name} đã hoàn thành ${completedLessons}/${targetLessons} bài học. Hãy nhắc bé dành thêm 15-20 phút học cùng Kido để về đích nhé!`;
  } else {
    status = 'missed';
    statusText = 'Chưa hoàn thành mục tiêu tuần 🔴';
    kidoAdvice = `Bé ${student.name} mới chỉ hoàn thành ${completedLessons}/${targetLessons} bài học (${lessonsPercent}%). Phụ huynh nên khích lệ bé học tập đều đặn hơn.`;
  }

  const missingLessons = Math.max(0, targetLessons - completedLessons);
  const missingMinutes = Math.max(0, targetMinutes - studyMinutes);
  const missingStars = Math.max(0, targetStars - starsEarned);
  const isGoalMet = lessonsPercent >= 100;

  const parentEmail = parentAccount?.email || student.email || goalConfig.parentEmail || 'caoquocbaozx4@gmail.com';
  const parentName = parentAccount?.name || 'Quý Phụ Huynh';

  return {
    studentId: student.id,
    studentName: student.name,
    studentUsername: student.username,
    avatar: student.avatar || '🎒',
    parentEmail,
    parentName,
    targetLessons,
    completedLessons,
    lessonsProgressPercent: lessonsPercent,
    targetMinutes,
    studyMinutes,
    minutesProgressPercent: minutesPercent,
    targetStars,
    starsEarned,
    starsProgressPercent: starsPercent,
    overallScorePercent,
    status,
    statusText,
    missingLessons,
    missingMinutes,
    missingStars,
    isGoalMet,
    kidoAdvice,
  };
}

/**
 * Scan all student accounts for weekly goal progress
 */
export function scanAllStudentsWeeklyGoals(
  students: UserAccount[],
  parentAccounts?: UserAccount[],
  config?: WeeklyGoalConfig
): {
  allReports: StudentWeeklyGoalReport[];
  unmetReports: StudentWeeklyGoalReport[];
  achievedReports: StudentWeeklyGoalReport[];
} {
  const goalConfig = config || getWeeklyGoalConfig();
  const kidAccounts = students.filter((a) => a.role === 'kid');
  const parents = parentAccounts || students.filter((a) => a.role === 'parent');

  const allReports = kidAccounts.map((student) => {
    const matchedParent = parents.find(
      (p) =>
        (p.linkedKidIds || []).includes(student.id) ||
        (student.linkedParentIds || []).includes(p.id)
    );
    return evaluateStudentWeeklyGoal(student, goalConfig, matchedParent);
  });

  const unmetReports = allReports.filter((r) => !r.isGoalMet);
  const achievedReports = allReports.filter((r) => r.isGoalMet);

  return { allReports, unmetReports, achievedReports };
}

/**
 * Generate formatted Email content for parents
 */
export function generateParentEmailTemplate(
  report: StudentWeeklyGoalReport,
  parentName?: string,
  senderName: string = 'Hệ Thống KidoEnglish AI'
): { subject: string; bodyText: string; bodyHtml: string } {
  const pName = parentName || report.parentName || 'Quý Phụ Huynh';
  const advice = report.kidoAdvice;
  const subject = report.isGoalMet
    ? `🎉 [KidoEnglish] Chúc mừng bé ${report.studentName} đã hoàn thành xuất sắc mục tiêu tuần!`
    : `⚠️ [KidoEnglish] Cảnh báo tiến độ: Bé ${report.studentName} chưa hoàn thành mục tiêu học tập tuần này!`;

  const bodyText = `
Kính gửi ${pName},

KidoEnglish xin gửi tới Phụ huynh báo cáo tổng kết tiến độ học tập hàng tuần của bé: ${report.studentName} (@${report.studentUsername}).

📊 TỔNG QUAN TIẾN ĐỘ TUẦN NÀY:
- Trạng thái: ${report.statusText}
- Số bài học hoàn thành: ${report.completedLessons}/${report.targetLessons} bài (${report.lessonsProgressPercent}%) ${report.missingLessons > 0 ? `(Còn thiếu ${report.missingLessons} bài)` : '(Đạt chỉ tiêu)'}
- Thời gian học tập: ${report.studyMinutes}/${report.targetMinutes} phút (${report.minutesProgressPercent}%)
- Sao thưởng tích lũy: ⭐ ${report.starsEarned}/${report.targetStars} sao (${report.starsProgressPercent}%)
- Đánh giá tổng thể: ${report.overallScorePercent}%

🦖 LỜI NHẮN TỪ KHỦNG LONG KIDO:
"${advice}"

💡 LỜI KHUYÊN DÀNH CHO PHỤ HUYNH:
${report.missingLessons > 0 
  ? `1. Cùng bé dành ra 10-15 phút vào buổi tối ôn lại từ vựng bằng Flashcards.\n2. Khích lệ bé làm thêm ${report.missingLessons} bài học ngắn trong mục Luyện Kỹ Năng.\n3. Thưởng huy hiệu hoặc quà khi bé hoàn thành đủ mục tiêu tuần sau.`
  : `1. Khen ngợi và đập tay khích lệ tinh thần tự giác của bé!\n2. Mở khóa thêm phần thưởng hoặc sticker mới trong Tủ đồ để duy trì động lực học tập.`}

Trân trọng,
${senderName}
Website: KidoEnglish - Learn, Play & Grow
Email hỗ trợ: support@kidoenglish.edu.vn
`;

  const bodyHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <div style="background: linear-gradient(135deg, #1d50b4, #4f46e5); color: #ffffff; padding: 24px 28px; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 6px;">🦖 📚</div>
    <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">BÁO CÁO MỤC TIÊU HỌC TẬP HÀNG TUẦN</h1>
    <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Hệ Thống KidoEnglish - Học Tiếng Anh Thông Minh Cho Bé</p>
  </div>

  <div style="padding: 26px 28px;">
    <p style="font-size: 14px; color: #334155; margin-top: 0;">Kính gửi <strong>${pName}</strong>,</p>
    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
      KidoEnglish xin gửi bảng thông báo tiến độ học tập trong tuần này của học sinh <strong>${report.studentName}</strong> (Tài khoản: <code>@${report.studentUsername}</code>):
    </p>

    <!-- Status Banner -->
    <div style="background-color: ${report.isGoalMet ? '#ecfdf5' : '#fff1f2'}; border: 2px solid ${report.isGoalMet ? '#10b981' : '#f43f5e'}; border-radius: 14px; padding: 14px 18px; margin: 18px 0; text-align: center;">
      <span style="font-size: 14px; font-weight: 800; color: ${report.isGoalMet ? '#047857' : '#be123c'};">
        ${report.statusText}
      </span>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: ${report.isGoalMet ? '#065f46' : '#9f1239'};">
        ${report.isGoalMet ? 'Bé đã hoàn thành đầy đủ tất cả chỉ tiêu bài học trong tuần!' : `Bé còn thiếu ${report.missingLessons} bài học để đạt mục tiêu tuần.`}
      </p>
    </div>

    <!-- Metrics Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
      <tbody>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">📖 Số bài học hoàn thành:</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #1e293b;">
            ${report.completedLessons} / ${report.targetLessons} bài (${report.lessonsProgressPercent}%)
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">⏱️ Thời gian học tập:</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #1e293b;">
            ${report.studyMinutes} / ${report.targetMinutes} phút (${report.minutesProgressPercent}%)
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">⭐ Sao thưởng đạt được:</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #b45309;">
            ⭐ ${report.starsEarned} / ${report.targetStars} sao (${report.starsProgressPercent}%)
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">🎯 Điểm hoàn thành tổng quan:</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: ${report.overallScorePercent >= 100 ? '#059669' : '#d97706'}; font-size: 15px;">
            ${report.overallScorePercent}%
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Kido Message -->
    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 0 12px 12px 0; padding: 12px 16px; margin: 18px 0;">
      <p style="margin: 0; font-size: 12px; color: #1e40af; font-weight: 700;">🦖 Lời Nhắn Từ Khủng Long Kido:</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #334155; font-style: italic;">"${advice}"</p>
    </div>

    <!-- Parent Action -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://ais-dev-syuqwmx4td4ylexbki2kv6-441830931346.asia-southeast1.run.app" style="display: inline-block; background-color: #1d50b4; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 13px; font-weight: 800; box-shadow: 0 3px 8px rgba(29,80,180,0.3);">
        Mở KidoEnglish Cùng Bé Học Ngay 🚀
      </a>
    </div>
  </div>

  <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 28px; font-size: 11px; color: #94a3b8; text-align: center;">
    Đây là thông báo tự động từ Hệ thống Quản Trị Phụ Huynh KidoEnglish.<br />
    Người gửi: <strong>${senderName}</strong> • Email người nhận: <strong>${report.parentEmail}</strong>
  </div>
</div>
`;

  return { subject, bodyText, bodyHtml };
}

/**
 * Save parent email record to persistent history
 */
export function saveParentEmailRecord(record: ParentEmailRecord): void {
  try {
    const raw = localStorage.getItem(PARENT_EMAIL_HISTORY_KEY);
    const list: ParentEmailRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    // Keep max 50 records
    localStorage.setItem(PARENT_EMAIL_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save parent email log', e);
  }
}

/**
 * Get parent email dispatch history
 */
export function getParentEmailHistory(studentId?: string): ParentEmailRecord[] {
  try {
    const raw = localStorage.getItem(PARENT_EMAIL_HISTORY_KEY);
    if (!raw) return [];
    const list: ParentEmailRecord[] = JSON.parse(raw);
    if (studentId) {
      return list.filter((item) => item.studentId === studentId);
    }
    return list;
  } catch (e) {
    console.warn('Failed to read parent email log', e);
    return [];
  }
}
