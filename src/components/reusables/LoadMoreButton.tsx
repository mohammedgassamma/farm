import React from "react";
import { Button } from "../ui/button";

export const LoadMoreButton = ({
  loadMore,
  hasNextPage,
  className,
  isLoadingMore,
}: {
  loadMore: () => void;
  hasNextPage: boolean;
  className?: string;
  isLoadingMore?: boolean;
}) => {
  if (!hasNextPage) {
    return null;
  }
  return (
    <div className="mt-[1rem]">
      <Button
        variant={"default" as any}
        className={`flex items-center gap-2 !z-[40] !rounded-none h-full ${
          className || ""
        }`}
        onClick={loadMore}
        loading={isLoadingMore}
      >
        Load more
      </Button>
    </div>
  );
};
