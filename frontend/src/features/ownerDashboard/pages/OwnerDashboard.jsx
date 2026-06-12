import React from "react";
import { useOwnerDashboard } from "../Hooks/useOwnerDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const OwnerDashboard = () => {
  const { stats, topPerformer, trends } = useOwnerDashboard();

  return (
    <div className="min-h-screen pt-[11vh] px-4 pb-8">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-3 py-2 rounded-2xl bg-white">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Spaces</p>
            <h2 className="text-2xl font-bold">{stats.totalSpaces}</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Bookings</p>
            <h2 className="text-2xl font-bold">{stats.totalBookings}</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold">{stats.pendingBookings}</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold">{stats.completedBookings}</h2>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Revenue</p>
            <h2 className="text-2xl font-bold">₹{stats.totalRevenue}</h2>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-2xl bg-white">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4">
              <Skeleton height={15} width={80} />
              <Skeleton height={35} className="mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Top Performer */}
      <div className="mt-8  rounded-2xl">
        <h1>Top Performer</h1>
        {topPerformer ? (
          <div className="rounded-3xl w-full lg:w-1/2 overflow-hidden bg-text-primary">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
              {/* LEFT SIDE IMAGE */}
              <div>
                <img
                  src={topPerformer.space.images?.[0]?.url}
                  alt={topPerformer.space.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* RIGHT SIDE CONTENT */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-bold">
                    TOP SPACE
                  </span>

                  <h2 className="text-4xl font-bold mt-4">
                    {topPerformer.space.title}
                  </h2>

                  <p className="mt-2 text-text-secondary">
                    {topPerformer.space.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div>
                    <p className="text-text-secondary/80">Bookings</p>

                    <h3 className="text-5xl font-bold">
                      {topPerformer.bookings}
                    </h3>
                  </div>

                  <div>
                    <p className="text-text-secondary/80">Revenue</p>

                    <h3 className="text-5xl font-bold text-green-400">
                      ₹{topPerformer.revenue}
                    </h3>
                  </div>

                  <div>
                    <p className="text-text-secondary/80">Capacity</p>

                    <h3 className="text-3xl font-bold">
                      {topPerformer.space.capacity}
                    </h3>
                  </div>

                  <div>
                    <p className="text-text-secondary/80">Type</p>

                    <h3 className="text-xl font-bold">
                      {topPerformer.space.spaceType}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-xl p-5 bg-white">
            {topPerformer !== null ? (
              <>
                <Skeleton height={30} width={220} />
                <Skeleton height={25} className="mt-4" />
                <Skeleton height={20} width={150} className="mt-2" />
                <Skeleton height={20} width={180} className="mt-2" />
              </>
            ):<>
            NO TOP PERFORMER
            </>}

          </div>
        )}
      </div>

      {/* Trends */}
      <div className="mt-8">
        {trends ? (
          <div className="border rounded-xl p-5 bg-white">
            <h2 className="text-xl font-bold mb-4">Booking & Revenue Trends</h2>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line type="monotone" dataKey="bookings" />

                  <Line type="monotone" dataKey="revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="border rounded-xl p-5 h-[350px]">
            <Skeleton height="100%" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
