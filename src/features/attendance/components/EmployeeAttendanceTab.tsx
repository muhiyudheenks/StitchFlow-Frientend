'use client';

import React, { useState, useEffect } from 'react';
import {
    FiClock,
    FiCheckCircle,
    FiCalendar,
    FiPlay,
    FiSquare,
    FiTrendingUp,
    FiPlus,
    FiXCircle,
    FiX,
    FiAlertCircle,
    FiRefreshCw,
    FiChevronDown,
    FiChevronUp
} from 'react-icons/fi';
import {
    useAttendance,
    useAttendanceHistory,
    useLeaveData,
    useCheckIn,
    useCheckOut,
    useApplyLeave
} from '../hooks/useAttendanceAndLeave';

export default function AttendanceTab() {
    const [mounted, setMounted] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRowExpand = (id: string) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Queries
    const { data: todayAttendance, isLoading: isLoadingToday, isError: isErrorToday } = useAttendance();
    const { data: historyLogs = [], isLoading: isLoadingHistory, isError: isErrorHistory } = useAttendanceHistory();
    const { data: leaveData, isLoading: isLoadingLeave, isError: isErrorLeave } = useLeaveData();

    // Mutations
    const checkInMutation = useCheckIn();
    const checkOutMutation = useCheckOut();
    const applyLeaveMutation = useApplyLeave();

    // Leave Modal State
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [leaveType, setLeaveType] = useState('casual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveFormError, setLeaveFormError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const isCheckedIn = todayAttendance?.isCheckedIn ?? false;
    const checkInTime = todayAttendance?.checkIn || '—';
    const checkOutTime = todayAttendance?.checkOut || '—';
    const workingHours = todayAttendance?.workingHours || '0.0 hrs';
    const attendancePercentage = todayAttendance?.attendancePercentage ?? 100;

    const balances = leaveData?.balances || { casual: 12, sick: 10, annual: 15 };
    const leaveRequests = leaveData?.requests || [];

    const handleCheckInToggle = () => {
        setActionError(null);
        if (!isCheckedIn) {
            checkInMutation.mutate(undefined, {
                onError: (err: any) => {
                    setActionError(err.response?.data?.message || err.message || 'Check-in failed');
                },
            });
        } else {
            checkOutMutation.mutate(undefined, {
                onError: (err: any) => {
                    setActionError(err.response?.data?.message || err.message || 'Check-out failed');
                },
            });
        }
    };

    const handleStartDateChange = (val: string) => {
        setStartDate(val);
        setEndDate(val);
        setLeaveFormError(null);
    };

    const handleEndDateChange = (val: string) => {
        setEndDate(val);
        if (startDate && val && val < startDate) {
            setLeaveFormError('End Date cannot be earlier than Start Date.');
        } else {
            setLeaveFormError(null);
        }
    };

    const handleApplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate) {
            setLeaveFormError('Start Date is required.');
            return;
        }
        if (!endDate) {
            setLeaveFormError('End Date is required.');
            return;
        }
        if (endDate < startDate) {
            setLeaveFormError('End Date cannot be earlier than Start Date.');
            return;
        }

        setLeaveFormError(null);
        applyLeaveMutation.mutate(
            {
                leaveType,
                startDate,
                endDate,
                reason,
            },
            {
                onSuccess: () => {
                    setIsApplyModalOpen(false);
                    setStartDate('');
                    setEndDate('');
                    setReason('');
                },
                onError: (err: any) => {
                    setLeaveFormError(err.response?.data?.message || err.message || 'Failed to submit leave application');
                },
            }
        );
    };

    const isToggling = checkInMutation.isPending || checkOutMutation.isPending;

    return (
        <div className="space-y-6 font-sans">
            {/* Action error banner */}
            {actionError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FiAlertCircle size={16} />
                        <span>{actionError}</span>
                    </div>
                    <button onClick={() => setActionError(null)} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg">
                        <FiX size={14} />
                    </button>
                </div>
            )}

            {/* Header Box & Shift Timekeeping + Apply For Leave Actions */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiClock size={14} />
                        <span>Shift Timekeeping &amp; Leave Portal</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Today Shift Attendance &amp; Leave Portal</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Log shift check-in/out timestamps, review leave balances, and apply for leaves.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Status</div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {isLoadingToday ? 'Loading…' : isCheckedIn ? 'Checked In' : 'Checked Out'}
                            </div>
                        </div>

                        <button
                            onClick={handleCheckInToggle}
                            disabled={!mounted || isToggling || isLoadingToday}
                            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60 ${
                                isCheckedIn
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            }`}
                        >
                            {isToggling ? (
                                <span className="flex items-center gap-1.5"><FiRefreshCw className="animate-spin" size={14} /> <span>Updating…</span></span>
                            ) : isCheckedIn ? (
                                <>
                                    <FiSquare size={14} /> <span>Check Out</span>
                                </>
                            ) : (
                                <>
                                    <FiPlay size={14} /> <span>Check In</span>
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                    >
                        <FiPlus size={16} />
                        <span>Apply For Leave</span>
                    </button>
                </div>
            </div>

            {/* Attendance Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today Check In</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingToday ? '…' : checkInTime}
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Shift Attendance</span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today Working Hours</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingToday ? '…' : workingHours}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Shift A (8.0 hrs target)</span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Monthly Attendance Rate</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingToday ? '…' : `${attendancePercentage}%`}
                    </div>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                        <FiTrendingUp /> Calculated Consistency
                    </span>
                </div>
            </div>

            {/* Today's Multi-Session Timeline */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <FiClock className="text-purple-600 dark:text-purple-400" size={16} />
                        <span>Today&apos;s Check-In / Check-Out Log</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">
                        {todayAttendance?.sessions?.length || 0} Session{(todayAttendance?.sessions?.length || 0) === 1 ? '' : 's'}
                    </span>
                </div>

                {isLoadingToday ? (
                    <div className="py-6 text-center text-xs text-slate-400 font-semibold">Loading session log...</div>
                ) : !todayAttendance?.sessions || todayAttendance.sessions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        No check-in sessions recorded for today yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {todayAttendance.sessions.map((sess: any, idx: number) => {
                            const inStr = sess.checkIn || '—';
                            const outStr = sess.checkOut || 'Active (Ongoing)';
                            const isOpen = !sess.checkOut;

                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                                        isOpen
                                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                                            : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
                                    }`}
                                >
                                    <div>
                                        <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">
                                            Session #{idx + 1}
                                        </div>
                                        <div className="text-xs font-mono font-extrabold flex items-center gap-2">
                                            <span>{inStr}</span>
                                            <span className="text-slate-400">→</span>
                                            <span className={isOpen ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>{outStr}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                        isOpen
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {isOpen ? 'ACTIVE' : 'COMPLETED'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Leave Balances Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Casual Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingLeave ? '…' : balances.casual} <span className="text-xs font-normal text-slate-400">days</span>
                    </div>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">Annual Allocation (12)</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Sick Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingLeave ? '…' : balances.sick} <span className="text-xs font-normal text-slate-400">days</span>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">Annual Allocation (10)</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Annual Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {isLoadingLeave ? '…' : balances.annual} <span className="text-xs font-normal text-slate-400">days</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Annual Allocation (15)</span>
                </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Attendance Log History</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-Time MongoDB Logs</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6">Total Hours</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                            {isLoadingHistory ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading attendance logs from database…
                                    </td>
                                </tr>
                            ) : isErrorHistory ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-rose-500 font-semibold">
                                        Failed to load attendance history.
                                    </td>
                                </tr>
                            ) : historyLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        No attendance logs recorded yet. Click &quot;Check In&quot; above to log shift arrival.
                                    </td>
                                </tr>
                            ) : (
                                historyLogs.map((log: any) => {
                                    const isExpanded = Boolean(expandedRows[log.id]);
                                    const sessions = log.sessions && log.sessions.length > 0 ? log.sessions : [
                                        { checkIn: log.checkIn || '—', checkOut: log.checkOut || null }
                                    ];
                                    const firstSession = sessions[0];
                                    const lastSession = sessions[sessions.length - 1];

                                    const firstCheckInStr = firstSession?.checkIn || log.checkIn || '—';
                                    const lastCheckOutStr = lastSession?.checkOut || (sessions.length > 1 && !lastSession?.checkOut ? 'Active' : (log.checkOut || '—'));

                                    return (
                                        <React.Fragment key={log.id}>
                                            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{log.date}</td>
                                                <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300 font-bold">{firstCheckInStr}</td>
                                                <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">{lastCheckOutStr}</td>
                                                <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{log.hours}</td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${
                                                            log.status === 'present'
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                                : log.status === 'late'
                                                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                                                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
                                                        }`}
                                                    >
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => toggleRowExpand(log.id)}
                                                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                                        title={isExpanded ? 'Collapse sessions' : 'Expand session details'}
                                                    >
                                                        {isExpanded ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                                    <td colSpan={6} className="p-4 border-b border-slate-100 dark:border-slate-800">
                                                        <div className="space-y-2.5">
                                                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                                All Check In &amp; Check Out Sessions for {log.date} ({sessions.length})
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                                {sessions.map((sess: any, idx: number) => {
                                                                    const inStr = sess.checkIn || '—';
                                                                    const outStr = sess.checkOut || 'Active';
                                                                    const isOpen = !sess.checkOut || sess.checkOut === 'Active';

                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className={`p-3 rounded-2xl border text-xs flex items-center justify-between font-mono ${
                                                                                isOpen
                                                                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                                                                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[10px] font-sans font-bold text-slate-400">Session #{idx + 1}</span>
                                                                                <span className="font-bold">{inStr}</span>
                                                                                <span className="text-slate-400">→</span>
                                                                                <span className={isOpen ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}>{outStr}</span>
                                                                            </div>
                                                                            <span className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full ${
                                                                                isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                                            }`}>
                                                                                {isOpen ? 'ACTIVE' : 'COMPLETED'}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Leave Applications History & Status Section */}
            <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">My Leave Applications</h3>
                {isLoadingLeave ? (
                    <div className="p-8 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        Loading leave applications from database…
                    </div>
                ) : leaveRequests.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        No leave applications submitted yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {leaveRequests.map((req: any) => (
                            <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{req.leaveType}</h4>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                                                req.status === 'approved'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                    : req.status === 'pending'
                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                                                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
                                            }`}
                                        >
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 mb-3">
                                        <FiCalendar size={13} />
                                        <span>{req.startDate} to {req.endDate}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                                        &ldquo;{req.reason}&rdquo;
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Apply Leave Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar text-slate-900 dark:text-white font-sans">
                        <button
                            onClick={() => setIsApplyModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Apply For Leave</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select leave category, start/end date, and state your reason.</p>
                        </div>

                        {leaveFormError && (
                            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                                <FiXCircle size={16} />
                                <span>{leaveFormError}</span>
                            </div>
                        )}

                        <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Category</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
                                >
                                    <option value="casual">Casual Leave</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="annual">Annual Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => handleStartDateChange(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        min={startDate || undefined}
                                        value={endDate}
                                        onChange={(e) => handleEndDateChange(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Leave</label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Explain reason for leave application..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={applyLeaveMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {applyLeaveMutation.isPending ? 'Submitting…' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
