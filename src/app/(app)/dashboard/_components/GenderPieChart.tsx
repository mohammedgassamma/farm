import React, { useEffect } from "react";
import { StatsCard } from "./StatsCard";
import { Pie } from "react-chartjs-2";

export const GenderPieChart = ({
  maleCount,
  femaleCount,
}: {
  maleCount: number;
  femaleCount: number;
}) => {
  const pieChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  return (
    <StatsCard title="Male and Female Distribution">
      <Pie data={pieChartData} />
    </StatsCard>
  );
};
