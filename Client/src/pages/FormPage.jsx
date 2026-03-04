import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Ticket, DollarSign, User, Calendar, CreditCard, Send, CheckCircle2 } from 'lucide-react';

const API_URL = '/api/tickets';
const STATS_URL = '/api/tickets/stats';

const TICKET_TYPES = ['Flagship', 'non-flagship', 'lazer tag', 'all in one'];
const PAYMENT_MODES = ['cash', 'UPI'];

export default function FormPage() {
    const [formData, setFormData] = useState({
        ticketNumber: '',
        ticketType: '',
        amountPaid: '',
        paidTo: '',
        eventName: '',
        paidThrough: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const duplicate = await axios.get(API_URL + '/duplicate', {ticketNumber: formData.ticketNumber, eventName: formData.eventName});
            if(duplicate.data){
                setError('Error: This Ticket Number and Event Name combination already exists.');
                return;
            }
            await axios.post(API_URL, formData);    
            setSuccess(true);
            setFormData({
                ticketNumber: '',
                ticketType: '',
                amountPaid: '',
                paidTo: '',
                eventName: '',
                paidThrough: ''
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            if(setError){
                setError('Error: This Ticket Number and Event Name combination already exists.');
            }
            else {
                setError(err.response?.data?.message || 'Failed to submit data. Is the server running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
        >
            <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
                <div className="card-body p-6 md:p-8">
                    <h2 className="card-title text-2xl font-bold text-center mb-6 justify-center">
                        New Ticket Entry
                    </h2>

                    {success && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="alert alert-success shadow-lg mb-6 text-white"
                        >
                            <CheckCircle2 className="w-6 h-6" />
                            <span>Ticket captured successfully!</span>
                        </motion.div>
                    )}

                    {error && (
                        <div className="alert alert-error shadow-lg mb-6 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Ticket Number */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary" /> Ticket Number
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter unique ticket number"
                                className="input input-bordered input-primary w-full text-base-content"
                                name="ticketNumber"
                                value={formData.ticketNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Ticket Type */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary" /> Ticket Type
                                </span>
                            </label>
                            <select
                                className="select select-bordered select-primary w-full text-base-content"
                                name="ticketType"
                                value={formData.ticketType}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a ticket type</option>
                                {TICKET_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Amount Paid */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-primary" /> Amount Paid (₹)
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="input input-bordered input-primary w-full text-base-content"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        {/* Paid To */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Paid To (Collector)
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Name of collector"
                                className="input input-bordered input-primary w-full text-base-content"
                                name="paidTo"
                                value={formData.paidTo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Event Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Event Name
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Name of the event"
                                className="input input-bordered input-primary w-full text-base-content"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Paid Through */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" /> Payment Mode
                                </span>
                            </label>
                            <div className="flex gap-4 mt-2">
                                {PAYMENT_MODES.map(mode => (
                                    <label key={mode} className="cursor-pointer label p-0 gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="paidThrough"
                                            className="radio radio-primary text-white"
                                            value={mode}
                                            checked={formData.paidThrough === mode}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="label-text capitalize font-medium">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full mt-6 shadow-lg shadow-primary/30 ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Entry</>}
                        </button>

                    </form>
                </div>
            </div>
        </motion.div>
    );
}
