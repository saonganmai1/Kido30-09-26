import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { AdminErrorReport } from '../types';

interface Props {
  children: ReactNode;
  userRole?: string;
  userName?: string;
  userId?: string;
  activeTab?: string;
  onGoHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class StudentErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('StudentErrorBoundary caught an error:', error, errorInfo);

    try {
      const existingRaw = localStorage.getItem('KIDO_ADMIN_ERROR_REPORTS') || localStorage.getItem('DINO_ADMIN_ERROR_REPORTS');
      const existing: AdminErrorReport[] = existingRaw ? JSON.parse(existingRaw) : [];

      const newReport: AdminErrorReport = {
        id: 'err_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toLocaleString('vi-VN'),
        userRole: this.props.userRole || 'kid',
        userName: this.props.userName || 'Học sinh',
        userId: this.props.userId,
        activeTab: this.props.activeTab || 'student_view',
        errorMessage: error.message || 'Uncaught Error in Student Component',
        errorStack: error.stack,
        componentStack: errorInfo.componentStack || '',
      };

      const updated = [newReport, ...existing].slice(0, 50);
      localStorage.setItem('KIDO_ADMIN_ERROR_REPORTS', JSON.stringify(updated));

      // Notify window listeners
      window.dispatchEvent(new CustomEvent('kido_error_report_added', { detail: newReport }));
      window.dispatchEvent(new CustomEvent('dino_error_report_added', { detail: newReport }));
    } catch (e) {
      console.warn('Failed to save error report to localStorage', e);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onGoHome) {
      this.props.onGoHome();
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 my-4">
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg text-center space-y-4 font-sans">
            <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center mx-auto text-rose-600 animate-bounce">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Rất tiếc! Đã xảy ra sự cố nhỏ 🎒
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Chi tiết sự cố đã được tự động ghi nhận và gửi đến trang <span className="font-bold text-indigo-600">Admin Error Report</span> để quản trị viên kiểm tra & sửa chữa.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-left overflow-x-auto max-h-32 text-[11px] font-mono text-rose-800">
                <span className="font-bold">Error:</span> {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer"
              >
                <Home size={16} />
                <span>Quay về trang chủ</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 active:scale-95 transition cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Tải lại trang</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
