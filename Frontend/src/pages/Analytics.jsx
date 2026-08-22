import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsStats from "../components/analytics/AnalyticsStats";
import WeeklyStudyChart from "../components/analytics/WeeklyStudyChart";
import MonthlyStudyChart from "../components/analytics/MonthlyStudyChart";
import SubjectDistribution from "../components/analytics/SubjectDistribution";
import StudyHeatmap from "../components/analytics/StudyHeatmap";

import { getAnalytics } from "../services/analyticsService";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        const result = await getAnalytics();

        if (mounted) {
          setData(result);
        }
      } catch (error) {
        toast.error(
          error.message || "Failed to load analytics."
        );
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-slate-400">
          Loading analytics...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden sm:space-y-8">

        {/* Header */}
        <AnalyticsHeader />

        {/* Statistics */}
        <AnalyticsStats
          sessions={data.sessions || []}
          learningPaths={data.learningPaths || []}
        />

        {/* Weekly + Monthly */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-2">

          <div className="min-w-0">
            <WeeklyStudyChart
              sessions={data.sessions || []}
            />
          </div>

          <div className="min-w-0">
            <MonthlyStudyChart
              sessions={data.sessions || []}
            />
          </div>

        </div>

        {/* Subject + Heatmap */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-2">

          <div className="min-w-0">
            <SubjectDistribution
              sessions={data.sessions || []}
            />
          </div>

          <div className="min-w-0">
            <StudyHeatmap
              sessions={data.sessions || []}
            />
          </div>

        </div>

      </div>
    </Layout>
  );
}