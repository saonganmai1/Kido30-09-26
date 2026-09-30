import { UserRole } from '../types';

export const ALL_GRADES = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5'] as const;

export function hasGradeAccess(
  allowedGrades: string[] | undefined,
  gradeKey: 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5' | string,
  role?: UserRole | string
): boolean {
  if (role === 'admin') return true;
  if (!allowedGrades || allowedGrades.length === 0 || allowedGrades.includes('all')) return true;
  return allowedGrades.includes(gradeKey);
}

export function formatAllowedGradesText(allowedGrades: string[] | undefined, role?: string): string {
  if (role === 'admin') return 'Tất cả các lớp (Admin)';
  if (!allowedGrades || allowedGrades.length === 0 || allowedGrades.includes('all') || allowedGrades.length >= 5) {
    return 'Tất cả các lớp (Lớp 1 - 5)';
  }
  const gradeNums = allowedGrades
    .filter((g) => g.startsWith('grade-'))
    .map((g) => g.replace('grade-', 'Lớp '))
    .sort();
  return gradeNums.length > 0 ? gradeNums.join(', ') : 'Chưa phân quyền';
}
