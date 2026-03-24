export const AppLoader = ({
  children,
  loadingText = "Fetching...",
  isLoading = true,
}: {
  children: React.ReactNode;
  loadingText?: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="min-h-[50vh] h-full">
      {!isLoading ? (
        <>{children}</>
      ) : (
        <div className="w-full flex justify-center items-center flex-col gap-[1rem] h-[400px] ">
          <div className="w-12 h-12 border-4 border-white border-b-transparent rounded-full inline-block box-border animate-rotation"></div>
          <p className="text-white">{loadingText}</p>
        </div>
      )}
    </div>
  );
};
