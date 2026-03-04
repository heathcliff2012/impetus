import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, CreditCard, Ticket as TicketIcon, CalendarDays, RefreshCw, Trash2 } from 'lucide-react';

const API_URL = '/api/tickets';
const STATS_URL = '/api/tickets/stats';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className={`card overflow-hidden border border-base-200 bg-base-100 shadow-sm`}>
        <div className="card-body p-5 relative text-base-content">
            <div className="flex justify-between items-start z-10">
                <div>
                    <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wider">{title}</h2>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-base-200 shadow-inner`}>
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-5">
                <Icon className="w-32 h-32" />
            </div>
        </div>
    </div>
);

export default function DataPage() {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketsRes, statsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(STATS_URL)
            ]);
            setTickets(ticketsRes.data);
            setStats(statsRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load data. Make sure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                // Refresh data
                fetchData();
            } catch (err) {
                alert('Failed to delete ticket');
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && !tickets.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Daily Dashboard
                    </h1>
                    <p className="text-sm text-base-content/60 flex items-center gap-2 mt-1">
                        <CalendarDays className="w-4 h-4" />
                        {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="btn btn-circle btn-ghost"
                    disabled={loading}
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="alert alert-error text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {stats && (
                <>
                    {/* Main Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            title="Today's Revenue"
                            value={`₹${(stats.totalAmount || 0).toLocaleString('en-IN')}`}
                            icon={CreditCard}
                        />
                        <StatCard
                            title="Total Tickets"
                            value={stats.totalTickets}
                            icon={TicketIcon}
                        />
                        <StatCard
                            title="Flagship"
                            value={stats.typeBreakdown['Flagship'] || 0}
                            icon={Activity}
                        />
                        <StatCard
                            title="All-In-One"
                            value={stats.typeBreakdown['all in one'] || 0}
                            icon={Activity}
                        />
                        <StatCard
                            title="Non-Flagship"
                            value={stats.typeBreakdown['non-flagship'] || 0}
                            icon={Activity}
                        />
                        <StatCard
                            title="Lazer Tag"
                            value={stats.typeBreakdown['lazer tag'] || 0}
                            icon={Activity}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Breakdown Column */}
                        <div className="col-span-1 border border-base-200 bg-base-100 rounded-2xl shadow-sm p-5 md:p-6 transition-all hover:shadow-md">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-base-200 pb-3">
                                <TicketIcon className="w-5 h-5 text-primary" /> Ticket Breakdown
                            </h3>
                            <div className="space-y-4">
                                {Object.entries({
                                    'Flagship': stats.typeBreakdown['Flagship'] || 0,
                                    'Non-Flagship': stats.typeBreakdown['non-flagship'] || 0,
                                    'Lazer Tag': stats.typeBreakdown['lazer tag'] || 0,
                                    'All In One': stats.typeBreakdown['all in one'] || 0
                                }).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <span className="font-medium text-base-content/80">{type}</span>
                                        <div className="flex items-center gap-3 w-1/2 justify-end">
                                            <div className="w-full bg-base-200 rounded-full h-2.5 max-w-[100px]">
                                                <div
                                                    className="bg-primary h-2.5 rounded-full"
                                                    style={{ width: `${stats.totalTickets > 0 ? (count / stats.totalTickets) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold w-6 text-right">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table Column */}
                        <div className="col-span-1 md:col-span-2 border border-base-200 bg-base-100 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                            <div className="p-5 md:p-6 border-b border-base-200 flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-secondary" /> Recent Transactions
                                </h3>
                                <div className="badge badge-primary badge-outline">{tickets.length} records</div>
                            </div>
                            <div className="overflow-x-auto flex-1 p-2 md:p-4 pb-0">
                                <table className="table table-zebra w-full text-sm">
                                    <thead>
                                        <tr className="bg-base-200/50 text-base-content/70 uppercase">
                                            <th>Time</th>
                                            <th>Ticket #</th>
                                            <th>Type</th>
                                            <th>Event</th>
                                            <th>Amount</th>
                                            <th>Mode</th>
                                            <th>Collector</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? tickets.map((t) => (
                                            <tr key={t._id} className="hover">
                                                <td className="whitespace-nowrap font-medium font-mono text-xs">
                                                    {format(new Date(t.createdAt), 'h:mm a')}
                                                    <br />
                                                    <span className="text-base-content/50" style={{ fontSize: '10px' }}>
                                                        {format(new Date(t.createdAt), 'dd MMM')}
                                                    </span>
                                                </td>
                                                <td className="font-mono text-xs font-bold text-primary">{t.ticketNumber || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge badge-sm font-semibold
                            ${t.ticketType === 'Flagship' ? 'badge-warning' :
                                                            t.ticketType === 'all in one' ? 'badge-error' :
                                                                t.ticketType === 'lazer tag' ? 'badge-info' : 'badge-neutral'}`}
                                                    >
                                                        {t.ticketType}
                                                    </span>
                                                </td>
                                                <td className="max-w-[150px] truncate" title={t.eventName}>{t.eventName}</td>
                                                <td className="font-bold text-emerald-600">₹{t.amountPaid}</td>
                                                <td>
                                                    <span className={`text-xs font-bold uppercase ${t.paidThrough === 'UPI' ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                        {t.paidThrough}
                                                    </span>
                                                </td>
                                                <td className="text-sm font-medium">{t.paidTo}</td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => handleDelete(t._id)}
                                                        className="btn btn-ghost btn-xs text-error/70 hover:text-error hover:bg-error/10"
                                                        title="Delete Ticket"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-10 text-base-content/50">
                                                    No tickets collected yet today.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </motion.div>
    );
}
