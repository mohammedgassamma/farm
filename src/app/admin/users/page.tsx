"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppLoader } from "@/components/reusables/AppLoader";
import { useGetPaginatedUsers } from "@/app/apiClient/hooks";
import { UserCard } from "./_components/UserCard";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";

export default function Userpage() {
  const {
    items: users = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetPaginatedUsers();

  return (
    <>
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        hasBottomBack
        backTo={PATH_URLS.ADMIN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Admin Users</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        {/* Add Animal Button */}

        <AppLoader isLoading={isLoading}>
          <div className="w-full space-y-3">
            {!users.length ? (
              <p>No users available.</p>
            ) : (
              users.map((user) => (
                <UserCard key={user.id} user={user} refetch={refetch} />
              ))
            )}
          </div>

          <LoadMoreButton
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </AppLoader>

        {error && <p className="text-red-500">{error.message}</p>}
      </AppLayout>
    </>
  );
}
