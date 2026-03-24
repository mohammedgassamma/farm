"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2"; // Placeholder for graph component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"; // Importing chart.js components
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDashboardData } from "../hooks/useGetDashboardData";
import { TotalPnLCard } from "./TotalPnLCard";
import { LivestockData } from "./LivestockData";
import { CropsDistribution } from "./CropsDistribution";
import { useGetProfitOverTime } from "../hooks/useGetProfitOverTime";
import { useAuth } from "@/providers/AuthProvider";
import { exportAllDataAsAdmin } from "@/utils/exportAllDataAsAdmin";   
const monthKeys = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const DashboardScreen = ({
  includeUserId,
  isAdminDashboard,
}: {
  includeUserId: boolean;
  isAdminDashboard: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState({
    crops: "",
    livestock: ""
  });
  const handleAdminDownloadAll = async () => {
    try {
      const { cropsUrl, livestockUrl } = await exportAllDataAsAdmin();

      setDownloadLinks({
        crops: cropsUrl,
        livestock: livestockUrl
      });

      setShowModal(true);
    } catch (err) {
      console.error("Admin export failed:", err);
      alert("Something went wrong while exporting data.");
    }
  };

  const t = useTranslations("dashboardScreen.main");

  const {
    totalExpenses: cTotalExpenses,
    totalProfit: cTotalProfit,
    totalRevenue: cTotalRevenue,
    cropDistribution,
    cropsDistributionLoading,
    livestockDistribution,
    livestockLoading,
    totalMeatSales,
    totalMilkProduced,
    milkLoading,
    meatLoading,
  } = useGetDashboardData({ includeUserId });
  const { isAdmin: isAdminUser } = useAuth();

  const isAdmin = isAdminDashboard ? isAdminUser : false;

  const { data: profitOverTimeData, isLoading: profitOverTimeLoading } =
    useGetProfitOverTime({ includeUserId });

  const graphData = {
    labels: profitOverTimeData.map((item) =>
      t(`totalProfit.months.${monthKeys[item.monthIndex]}`)
    ),
    datasets: [
      {
        label: t("totalProfit.totalProfitOverTime"),
        data: profitOverTimeData.map((item) => item.profit),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  return (
    <AppLayout
      hasLanguageSwitcher={false}
      hasLogo
      className="p-6"
      hasBottomBack
    >
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{t("dashboard")}</h1>
      </header>

      <div className="w-full border-b border-black mb-5"></div>
     {isAdmin && (
  <div className="mb-6 flex justify-center">
    <button
      className="btn primary px-4 py-2 rounded bg-blue-600 text-white"
      onClick={handleAdminDownloadAll}
    >
      Download All User Data
    </button>
  </div>
)}
 <TotalPnLCard
          totalProfit={cTotalProfit}
          totalRevenue={cTotalRevenue}
          totalExpenses={cTotalExpenses}
          isLoading={cropsDistributionLoading || livestockLoading}
 />
  
      <LivestockData
        {...livestockDistribution}
        totalMilkProduced={totalMilkProduced?.totalMilkProduced || 0}
        totalMeatSales={totalMeatSales?.totalMeatSales || 0}
        isLoading={milkLoading || meatLoading || livestockLoading}
      />
      <CropsDistribution
        {...(cropDistribution as any)}
        isLoading={cropsDistributionLoading}
      />

      {/* Placeholder Graph */}
      {!isAdmin ? (
        <div className="mb-6 bgcards rounded-lg p-8">
          <p className="font-semibold mb-4 text-lg">{t("totalProfit.title")}</p>
          <Line
            data={graphData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: t("totalProfit.totalProfitLast6Months"),
                },
                tooltip: {
                  mode: "nearest",
                },
              },
              scales: {
                x: {
                  grid: {
                    display: true,
                    color: "#e1e1e1",
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: "#e1e1e1",
                  },
                },
              },
            }}
          />
        </div>
      ) : null}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">All user data is ready</h2>

      <p className="mb-4">Choose the files you want to download.</p>

      <div className="flex flex-col gap-3 mb-4">
        <a
          href={downloadLinks.crops}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded text-center"
        >
          Download All Crops CSV
        </a>

        <a
          href={downloadLinks.livestock}
          download
          className="px-4 py-2 bg-green-600 text-white rounded text-center"
        >
          Download All Livestock CSV
        </a>
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="px-4 py-2 bg-gray-300 rounded w-full"
      >
        Close
      </button>
    </div>
  </div>
)}
    </AppLayout>
  );
};
