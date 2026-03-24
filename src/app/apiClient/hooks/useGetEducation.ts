import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { TEducation } from "@/server/services/education.service";
import { useAuth } from "@/providers/AuthProvider";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetEducations = () => {
  return useQuery<TEducation[]>({
    queryKey: [API_URLS.GET_ALL_EDUCATIONS],
  });
};

export const useGetPaginatedEducation = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TEducation>({
    queryKey: [API_URLS.GET_ALL_EDUCATIONS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetEducationById = ({ id }: { id: string }) => {
  const { currentUser } = useAuth();

  return useQuery<TEducation>({
    queryKey: [API_URLS.GET_EDUCATIONS, id],
    enabled: !!currentUser ? true : false,
  });
};
