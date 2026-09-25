"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
    Sprout,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    Calendar,
    Award,
    Package,
    Users,
    CreditCard,
    Clock,
    CheckCircle2,
    Truck,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import type { FarmerAnalyticsData } from "@/lib/queries/farmer";
import { formatINR } from "@/lib/utils";

const PAYMENT_COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 120, damping: 14 },
    },
};

interface Props {
    data: FarmerAnalyticsData;
}

export default function FarmerAnalyticsDashboard({ data }: Props) {
    const { summary, charts, topProducts, paymentBreakdown, activeOrderStatus, generatedAt } = data;

    const totalActiveOrders = Object.values(activeOrderStatus).reduce(
        (acc, val) => acc + Number(val || 0),
        0
    );

    const isGrowthPositive = Number(summary.monthlyGrowth || 0) >= 0;

    const statCards = [
        {
            label: "Today's Earnings",
            value: summary.todayRevenue,
            isMoney: true,
            icon: DollarSign,
            bgLight: "bg-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            label: "Today's Orders",
            value: summary.todayOrders,
            isMoney: false,
            icon: ShoppingBag,
            bgLight: "bg-blue-100",
            textColor: "text-blue-600",
        },
        {
            label: "Avg Order Value",
            value: summary.todayAOV,
            isMoney: true,
            icon: TrendingUp,
            bgLight: "bg-purple-100",
            textColor: "text-purple-600",
        },
        {
            label: "This Month",
            value: summary.monthlyRevenue,
            isMoney: true,
            icon: Calendar,
            bgLight: "bg-green-100",
            textColor: "text-green-600",
        },
        {
            label: "Growth (Month)",
            value: summary.monthlyGrowth,
            isMoney: false,
            suffix: "%",
            icon: isGrowthPositive ? ArrowUpRight : ArrowDownRight,
            bgLight: isGrowthPositive ? "bg-green-100" : "bg-red-100",
            textColor: isGrowthPositive ? "text-green-600" : "text-red-600",
            isGrowth: true,
        },
        {
            label: "90 Days Total",
            value: summary.last90DaysRevenue,
            isMoney: true,
            icon: Layers,
            bgLight: "bg-teal-100",
            textColor: "text-teal-600",
        },
        {
            label: "All Time Earnings",
            value: summary.totalRevenue,
            isMoney: true,
            icon: Award,
            bgLight: "bg-amber-100",
            textColor: "text-amber-600",
        },
        {
            label: "Total Orders",
            value: summary.totalOrders,
            isMoney: false,
            icon: Package,
            bgLight: "bg-indigo-100",
            textColor: "text-indigo-600",
        },
        {
            label: "Happy Customers",
            value: summary.uniqueCustomers,
            isMoney: false,
            icon: Users,
            bgLight: "bg-pink-100",
            textColor: "text-pink-600",
        },
    ];

    const formattedGeneratedAt = new Date(generatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="min-h-screen bg-slate-100/90 rounded-3xl py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Sprout className="w-10 h-10 sm:w-14 sm:h-14 text-green-600 shrink-0" />
                        <span>My Farm Dashboard</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 mt-2.5 font-medium">
                        See how your hard work is paying off!
                    </p>
                </motion.div>

                {/* 1. Stat Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
                    {statCards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            variants={itemVariants}
                            whileTap={{ scale: 0.96 }}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col justify-between transition-all"
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-tight line-clamp-1">
                                        {card.label}
                                    </p>
                                    <div className={`p-2 sm:p-2.5 rounded-full ${card.bgLight} shrink-0`}>
                                        <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.textColor}`} />
                                    </div>
                                </div>
                                <p
                                    className={`text-xl sm:text-2xl lg:text-3xl font-black ${
                                        card.isMoney ? "text-green-700" : "text-gray-900"
                                    }`}
                                >
                                    {card.isMoney
                                        ? formatINR(card.value)
                                        : Number(card.value).toLocaleString("en-IN")}
                                    {card.suffix && (
                                        <span className="text-base sm:text-lg font-bold ml-0.5">
                                            {card.suffix}
                                        </span>
                                    )}
                                </p>
                            </div>
                            {card.isGrowth && (
                                <div
                                    className={`h-2 w-full ${
                                        isGrowthPositive ? "bg-green-500" : "bg-red-500"
                                    }`}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Last 30 Days Line Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2.5">
                            <Sprout className="w-6 h-6 text-emerald-600" />
                            <span>Last 30 Days Performance</span>
                        </h3>
                        {charts.dailySales30Days.length > 0 ? (
                            <div className="h-72 sm:h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={charts.dailySales30Days}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip
                                            formatter={(val: any, name: any) => [
                                                name === "Earnings" ? formatINR(Number(val)) : val,
                                                name,
                                            ]}
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                borderRadius: "1rem",
                                                border: "1px solid #e5e7eb",
                                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3.5}
                                            name="Earnings"
                                            dot={{ r: 3, fill: "#10b981" }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#3b82f6"
                                            strokeWidth={2.5}
                                            name="Orders"
                                            dot={{ r: 2.5, fill: "#3b82f6" }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-72 sm:h-80 flex flex-col items-center justify-center text-gray-400">
                                <BarChart3 className="w-12 h-12 mb-2 text-gray-300" />
                                <p className="font-medium">No sales data yet</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Monthly Trend Bar Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2.5">
                            <Layers className="w-6 h-6 text-blue-600" />
                            <span>Monthly Trend</span>
                        </h3>
                        {charts.monthlyRevenueTrend.length > 0 ? (
                            <div className="h-72 sm:h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={charts.monthlyRevenueTrend}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip
                                            formatter={(val: any) => [formatINR(Number(val)), "Revenue"]}
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                borderRadius: "1rem",
                                                border: "1px solid #e5e7eb",
                                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill="#10b981"
                                            radius={[10, 10, 0, 0]}
                                            name="Revenue"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-72 sm:h-80 flex flex-col items-center justify-center text-gray-400">
                                <BarChart3 className="w-12 h-12 mb-2 text-gray-300" />
                                <p className="font-medium">No monthly data yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* 3. Best Selling Items */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 border border-gray-100">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
                        <h3 className="text-xl sm:text-2xl font-black flex items-center gap-3">
                            <Package className="w-7 h-7" />
                            <span>My Best Selling Items</span>
                        </h3>
                        <p className="text-green-100 text-xs sm:text-sm mt-1 font-medium">
                            Last 90 days performance
                        </p>
                    </div>

                    {topProducts.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {topProducts.map((p, idx) => {
                                const rankGradients = [
                                    "bg-gradient-to-br from-yellow-400 to-orange-500",
                                    "bg-gradient-to-br from-gray-400 to-gray-600",
                                    "bg-gradient-to-br from-orange-400 to-red-500",
                                ];
                                const rankBadge =
                                    rankGradients[idx] || "bg-gradient-to-br from-green-500 to-emerald-600";

                                return (
                                    <motion.div
                                        key={p.productId || idx}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-4 sm:p-5 hover:bg-green-50/70 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            {/* Rank */}
                                            <div
                                                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-white text-sm sm:text-base shadow-md shrink-0 ${rankBadge}`}
                                            >
                                                {idx + 1}
                                            </div>

                                            {/* Image */}
                                            <div className="shrink-0">
                                                {p.image ? (
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl flex items-center justify-center ring-2 ring-white shadow-sm">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                                <div className="min-w-0">
                                                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base truncate">
                                                        {p.name || "Unknown Product"}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm">
                                                        <span className="text-gray-600 font-medium">
                                                            {Number(p.totalQty).toLocaleString("en-IN")}{" "}
                                                            {p.unit || "units"}
                                                        </span>
                                                        {idx < 3 && (
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                                                                    idx === 0
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : idx === 1
                                                                        ? "bg-gray-100 text-gray-800"
                                                                        : "bg-orange-100 text-orange-800"
                                                                }`}
                                                            >
                                                                {idx === 0 ? "Top" : idx === 1 ? "2nd" : "3rd"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Earnings */}
                                                <div className="text-left sm:text-right shrink-0">
                                                    <p className="text-base sm:text-xl font-black text-green-700 leading-tight">
                                                        {formatINR(p.totalSales)}
                                                    </p>
                                                    <p className="text-[11px] sm:text-xs text-green-600 font-semibold">
                                                        Earnings
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 flex items-center justify-center shadow-inner">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-700 mb-1">No Sales Yet</h4>
                            <p className="text-gray-500 text-sm sm:text-base">
                                Your first customer is coming soon!
                            </p>
                            <p className="text-green-600 font-bold mt-3 text-base sm:text-lg">
                                Keep going!
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* 4. Bottom Row: Payment Methods & Orders in Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Payment Methods */}
                    <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 flex items-center gap-2.5">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                            <span>Payment Methods</span>
                        </h3>
                        {paymentBreakdown.length > 0 && paymentBreakdown.some((p) => p.count > 0) ? (
                            <>
                                <div className="h-56 sm:h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={paymentBreakdown}
                                                dataKey="count"
                                                nameKey="method"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={4}
                                            >
                                                {paymentBreakdown.map((_, i) => (
                                                    <Cell
                                                        key={`cell-${i}`}
                                                        fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(val: any, name: any) => [`${val} orders`, name]}
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "0.75rem",
                                                    border: "1px solid #e5e7eb",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-2.5">
                                    {paymentBreakdown.map((item, idx) => (
                                        <div key={item.method} className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-2 font-medium text-gray-700">
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            PAYMENT_COLORS[idx % PAYMENT_COLORS.length],
                                                    }}
                                                />
                                                {item.method} ({item.count})
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {formatINR(item.revenue)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-gray-400">
                                <CreditCard className="w-12 h-12 mb-2 text-gray-300" />
                                <p className="font-medium text-sm">No payment data yet</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Orders in Progress */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2.5">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                    <span>Orders in Progress</span>
                                </h3>
                                {totalActiveOrders > 0 && (
                                    <div className="text-2xl sm:text-3xl font-black text-orange-600 bg-orange-100/80 px-3.5 py-1 rounded-2xl">
                                        {totalActiveOrders}
                                    </div>
                                )}
                            </div>

                            {totalActiveOrders === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-3">🎉 All Done!</div>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-700">
                                        No pending orders right now
                                    </p>
                                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                                        Great job! Everything has been delivered.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                                    {[
                                        { key: "pending", label: "Waiting", count: activeOrderStatus.pending },
                                        { key: "confirmed", label: "Confirmed", count: activeOrderStatus.confirmed },
                                        { key: "preparing", label: "Packing", count: activeOrderStatus.preparing },
                                        { key: "out_for_delivery", label: "On Way", count: activeOrderStatus.out_for_delivery },
                                    ].map((stat) => (
                                        <div
                                            key={stat.key}
                                            className="text-center p-4 sm:p-5 bg-orange-50/80 rounded-2xl border-2 border-orange-200"
                                        >
                                            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600">
                                                {stat.count || 0}
                                            </p>
                                            <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1.5">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tip/Info bar */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>Real-time sync enabled</span>
                            <span className="font-semibold text-emerald-700">Freshique Farm System</span>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Timestamp */}
                <motion.div variants={itemVariants} className="mt-8 text-center text-gray-500 text-xs sm:text-sm pb-4">
                    <p>
                        Last updated: <span className="font-semibold text-gray-700">{formattedGeneratedAt}</span>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
