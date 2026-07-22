// "use client";

// import {
//   LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
//   XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from "recharts";
// import {
//   ArrowUpRight, Plus, ChevronRight, ClipboardList, UserCheck, FileText,
//   Factory, Target, CheckCircle2, Package, Clock, Users, Star,
// } from "lucide-react";
// import DashboardShell from "@/components/layout/DashboardShell";
// import WelcomeCard from "@/components/ui/WelcomeCard";
// import StatGrid from "@/components/ui/StatGrid";
// import ChartCard from "@/components/ui/ChartCard";
// import CardSkeleton from "@/components/ui/CardSkeleton";
// import { PriorityBadge, StatusBadge } from "@/components/ui/Badges";
// import ProgressRing from "@/components/ui/ProgressRing";
// import { managerNav } from "@/config/nav";
// import { COLORS, chartTooltipStyle } from "@/lib/theme";
// import {
//   useManagerStats, useManagerProgress, useManagerWeeklyOutput, useManagerEfficiency,
//   useManagerAttendanceTrend, useManagerTasks, useManagerTeamPerformance,
//   useManagerAttendanceOverview, useManagerActivities,
// } from "@/hooks/useManagerDashboard";

// const quickActions = [
//   { label: "Assign Task", icon: ClipboardList },
//   { label: "Approve Leave", icon: UserCheck },
//   { label: "Generate Report", icon: FileText },
//   { label: "View Production", icon: Factory },
// ];

// export default function ManagerDashboard() {
//   const stats = useManagerStats();
//   const progress = useManagerProgress();
//   const weeklyOutput = useManagerWeeklyOutput();
//   const efficiency = useManagerEfficiency();
//   const attendanceTrend = useManagerAttendanceTrend();
//   const tasks = useManagerTasks();
//   const teamPerformance = useManagerTeamPerformance();
//   const attendanceOverview = useManagerAttendanceOverview();
//   const activities = useManagerActivities();

// return (
//     <DashboardShell
//         navItems={managerNav}
//         portalLabel="Manager Console"
//         searchPlaceholder="Search tasks, employees, orders..."
//         notificationCount={5}
//     >
//         <WelcomeCard
//             greeting="Welcome back, Manager 👋"
//             subtitle="Monitor your team's production and performance."
//             primaryAction={{ label: "View Production", icon: ArrowUpRight }}
//             secondaryAction={{ label: "Assign Task", icon: Plus }}
//         />

//         <StatGrid stats={stats.data} isLoading={stats.isLoading} />

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//             <ChartCard title="Production Progress" subtitle="Units produced today, by hour">
//                 {progress.isLoading || !progress.data ? (
//                     <CardSkeleton height={220} />
//                 ) : (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={progress.data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
//                             <CartesianGrid stroke={COLORS.border} vertical={false} />
//                             <XAxis dataKey="hr" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <Tooltip {...chartTooltipStyle} />
//                             <Line type="monotone" dataKey="units" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4, fill: COLORS.primary }} activeDot={{ r: 6 }} />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 )}
//             </ChartCard>

//             <ChartCard title="Weekly Output" subtitle="Units produced by day">
//                 {weeklyOutput.isLoading || !weeklyOutput.data ? (
//                     <CardSkeleton height={220} />
//                 ) : (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={weeklyOutput.data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
//                             <CartesianGrid stroke={COLORS.border} vertical={false} />
//                             <XAxis dataKey="day" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <Tooltip {...chartTooltipStyle} />
//                             <Bar dataKey="units" radius={[8, 8, 0, 0]} fill={COLORS.primary} maxBarSize={34} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 )}
//             </ChartCard>

//             <ChartCard title="Team Efficiency" subtitle="Workers grouped by efficiency band">
//                 {efficiency.isLoading || !efficiency.data ? (
//                     <CardSkeleton height={220} />
//                 ) : (
//                     <div className="flex items-center h-full">
//                         <ResponsiveContainer width="55%" height="100%">
//                             <PieChart>
//                                 <Pie data={efficiency.data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none">
//                                     {efficiency.data.map((d, i) => <Cell key={i} fill={d.color} />)}
//                                 </Pie>
//                                 <Tooltip {...chartTooltipStyle} />
//                             </PieChart>
//                         </ResponsiveContainer>
//                         <div className="flex-1 space-y-2.5">
//                             {efficiency.data.map((d, i) => (
//                                 <div key={i} className="flex items-center justify-between text-xs">
//                                     <div className="flex items-center gap-2">
//                                         <span className="rounded-full w-2 h-2" style={{ background: d.color }} />
//                                         <span className="text-textSecondary">{d.name}</span>
//                                     </div>
//                                     <span className="font-bold text-textPrimary">{d.value}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </ChartCard>

//             <ChartCard title="Attendance Trend" subtitle="Attendance rate (%) this week">
//                 {attendanceTrend.isLoading || !attendanceTrend.data ? (
//                     <CardSkeleton height={220} />
//                 ) : (
//                     <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={attendanceTrend.data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
//                             <defs>
//                                 <linearGradient id="attGradMgr" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
//                                     <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
//                                 </linearGradient>
//                             </defs>
//                             <CartesianGrid stroke={COLORS.border} vertical={false} />
//                             <XAxis dataKey="day" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
//                             <Tooltip {...chartTooltipStyle} />
//                             <Area type="monotone" dataKey="rate" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#attGradMgr)" />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 )}
//             </ChartCard>
//         </div>

//         {/* Production Progress ring section */}
//         <div className="bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-[26px] grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
//             <div className="flex justify-center">
//                 <ProgressRing percent={86} />
//             </div>
//             <div>
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Today&apos;s Production Progress</h3>
//                 <p className="text-[12.5px] text-textSecondary mt-0.5">Live status against today&apos;s assigned target</p>
//                 <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
//                     {[
//                         { label: "Target", value: "2,500 pcs", icon: Target, tint: "#7C3AED" },
//                         { label: "Completed", value: "2,140 pcs", icon: CheckCircle2, tint: COLORS.success },
//                         { label: "Remaining", value: "360 pcs", icon: Package, tint: COLORS.warning },
//                     ].map((m, i) => {
//                         const Icon = m.icon;
//                         return (
//                             <div key={i} className="p-4 rounded-2xl border border-border bg-[#FBFCFE]">
//                                 <div className="flex items-center justify-center rounded-xl mb-3 w-9 h-9" style={{ background: `${m.tint}14` }}>
//                                     <Icon size={17} style={{ color: m.tint }} />
//                                 </div>
//                                 <div className="text-[17px] font-bold text-textPrimary">{m.value}</div>
//                                 <div className="text-[12px] text-textSecondary">{m.label}</div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>

//         {/* Assigned Tasks */}
//         <div className="bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-6">
//             <div className="flex items-center justify-between">
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Assigned Tasks</h3>
//                 <button className="flex items-center gap-1 text-primary text-[12.5px] font-semibold">
//                     View all <ChevronRight size={14} />
//                 </button>
//             </div>
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {(tasks.data ?? []).map((t, i) => (
//                     <div key={i} className="p-4 rounded-2xl border border-border bg-[#FBFCFE] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
//                         <div className="flex items-start justify-between gap-3">
//                             <span className="text-[13.5px] font-semibold text-textPrimary leading-snug">{t.name}</span>
//                             <PriorityBadge level={t.priority} />
//                         </div>
//                         <div className="mt-3 flex items-center gap-2 text-[12px] text-textSecondary">
//                             <Clock size={13} /> {t.deadline}
//                         </div>
//                         <div className="mt-3 flex items-center justify-between">
//                             <div className="flex items-center gap-1.5 text-[12px] text-textSecondary">
//                                 <Users size={13} /> {t.workers} workers assigned
//                             </div>
//                             <StatusBadge status={t.status} />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//             <div className="lg:col-span-2 bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-6">
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Team Performance</h3>
//                 <div className="mt-4 space-y-1">
//                     {(teamPerformance.data ?? []).map((e, i, arr) => (
//                         <div
//                             key={i}
//                             className="flex items-center justify-between py-3 px-2 rounded-2xl transition-colors hover:bg-background gap-3"
//                             style={{ borderBottom: i !== arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}
//                         >
//                             <div className="flex items-center gap-3 min-w-0">
//                                 <div className="flex items-center justify-center rounded-xl text-xs font-bold text-white shrink-0 w-[38px] h-[38px] bg-gradient-to-br from-primary to-[#60A5FA]">
//                                     {e.initials}
//                                 </div>
//                                 <div className="min-w-0">
//                                     <div className="text-[13.5px] font-semibold text-textPrimary">{e.name}</div>
//                                     <div className="text-[12px] text-textSecondary">Today&apos;s output: {e.output}</div>
//                                 </div>
//                             </div>
//                             <div className="hidden sm:flex items-center gap-2 text-[12px] text-textSecondary">
//                                 <Star size={13} className="text-warning fill-warning" /> {e.quality}%
//                             </div>
//                             <div className="flex items-center gap-2 shrink-0">
//                                 <div className="w-20 h-1.5 rounded-full overflow-hidden bg-border">
//                                     <div className="h-full rounded-full bg-primary" style={{ width: `${e.efficiency}%` }} />
//                                 </div>
//                                 <span className="text-[12.5px] font-bold text-textPrimary w-9">{e.efficiency}%</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-6">
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Attendance Overview</h3>
//                 <div className="mt-4 space-y-3">
//                     {(attendanceOverview.data ?? []).map((a, i) => {
//                         const Icon = a.icon;
//                         return (
//                             <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-[#FBFCFE]">
//                                 <div className="flex items-center gap-2.5">
//                                     <div className="flex items-center justify-center rounded-xl w-8 h-8" style={{ background: `${a.color}14` }}>
//                                         <Icon size={15} style={{ color: a.color }} />
//                                     </div>
//                                     <span className="text-[13px] font-medium text-textPrimary">{a.label}</span>
//                                 </div>
//                                 <span className="text-[15px] font-bold text-textPrimary">{a.value}</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//             <div className="lg:col-span-2 bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-6">
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Recent Activity</h3>
//                 <div className="mt-5 relative">
//                     <div className="absolute left-[15px] top-1 bottom-1 w-px bg-border" />
//                     <div className="space-y-5">
//                         {(activities.data ?? []).map((a, i) => {
//                             const Icon = a.icon;
//                             return (
//                                 <div key={i} className="relative flex gap-4">
//                                     <div
//                                         className="flex items-center justify-center rounded-full shrink-0 z-10 w-8 h-8 border border-card"
//                                         style={{ background: `${a.color}14` }}
//                                     >
//                                         <Icon size={15} style={{ color: a.color }} />
//                                     </div>
//                                     <div>
//                                         <p className="text-[13px] text-textPrimary font-medium leading-snug">{a.text}</p>
//                                         <span className="text-[11.5px] text-textSecondary">{a.time}</span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-white/85 backdrop-blur-xl border border-border rounded-card shadow-card p-6">
//                 <h3 className="text-[15.5px] font-bold text-textPrimary">Quick Actions</h3>
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                     {quickActions.map((q, i) => {
//                         const Icon = q.icon;
//                         return (
//                             <button
//                                 key={i}
//                                 className="qa-btn flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all duration-300 bg-gradient-to-br from-primary to-[#3B82F6] shadow-cta"
//                             >
//                                 <Icon size={18} className="text-white" />
//                                 <span className="text-white text-[12.5px] font-semibold leading-snug">{q.label}</span>
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     </DashboardShell>
// );
// }