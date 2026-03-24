import React, { ReactNode } from "react";

export const StatsCard = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className="mb-3 bgcards rounded-lg p-6 border-2 border-gray-300 shadow-lg">
      <p className="font-semibold text-lg text-center border-b border-gray-400 pb-2">
        {title}
      </p>
      <div className="w-full justify-items-center"></div>
      {children}
    </div>
  );
};
