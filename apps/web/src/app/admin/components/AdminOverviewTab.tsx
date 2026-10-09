'use client';

import React from 'react';
import { IndianRupee, Ticket, Compass, Hotel as HotelIcon, Users, Activity } from 'lucide-react';

interface AdminOverviewTabProps {
  metrics: any;
  data: any;
  usersList: any[];
}

export function AdminOverviewTab({ metrics, data, usersList }: AdminOverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Real-time KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-stone-900">₹{metrics.totalRevenueInr?.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Bookings</span>
            <Ticket className="w-4 h-4 text-bharat-saffron" />
          </div>
          <p className="text-xl font-black text-stone-900">{metrics.totalBookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Attractions</span>
            <Compass className="w-4 h-4 text-bharat-indigo" />
          </div>
          <p className="text-xl font-black text-stone-900">{metrics.totalAttractions}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Hotels</span>
            <HotelIcon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-stone-900">{metrics.totalHotels}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-stone-900">{metrics.totalUsers}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase font-bold">Circuits</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-black text-stone-900">{metrics.totalCircuits}</p>
        </div>
      </div>

      {/* Bookings Ledger */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-xl font-black text-stone-900 tracking-tight">Recent Platform Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data?.recentBookings?.map((b: any) => (
                <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-bharat-saffron">{b.bookingReference}</td>
                  <td className="py-3 px-4 font-bold text-stone-800">{b.user?.name || 'Customer'}</td>
                  <td className="py-3 px-4 text-stone-600">{b.bookingType}</td>
                  <td className="py-3 px-4 text-stone-800 font-medium max-w-xs truncate">{b.title}</td>
                  <td className="py-3 px-4 text-stone-500">{b.checkInDate}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">₹{b.totalAmountInr}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Accounts Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-xl font-black text-stone-900 tracking-tight">Registered Platform Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Trips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                  <td className="py-3 px-4 text-stone-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-800">{u._count?.bookings || 0}</td>
                  <td className="py-3 px-4 font-bold text-stone-800">{u._count?.trips || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewTab;
