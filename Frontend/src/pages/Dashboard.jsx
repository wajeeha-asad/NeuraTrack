import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import Nova from "../components/dashboard/Nova";
import Hero from "../components/dashboard/Hero";
import StatsSection from "../components/dashboard/StatsSection";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import GoalCard from "../components/dashboard/GoalCard";
import RecentSessions from "../components/dashboard/RecentSessions";
import QuoteCard from "../components/dashboard/QuoteCard";

import { getDashboard } from "../services/dashboardService";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboardData = await getDashboard();

      setData(dashboardData);
    } catch (error) {
      toast.error(
        error.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
          Unable to load dashboard.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-w-0 space-y-6 sm:space-y-8">

        {/* Hero */}
        <Hero user={data.user} />

        {/* Nova */}
        <Nova
          user={data.user}
          stats={data.stats}
        />

        {/* Statistics */}
        <StatsSection stats={data.stats} />

        {/* Weekly / Goals / Recent Sessions */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-1">
            <WeeklyChart data={data.weeklyData} />
          </div>

          <GoalCard goals={data.goals} />

          <RecentSessions
            sessions={data.recentSessions}
          />

        </div>

        {/* Quote */}
        <QuoteCard />

      </div>
    </Layout>
  );
}