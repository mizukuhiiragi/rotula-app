import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { groupsService } from "@/services/api/groups";
import type { Group } from "@/types/group";

/**
 * @deprecated Use Group from "@/types/group" directly. Kept for backwards compatibility.
 */
export type SavingsGroup = Group;

export const useGroups = () => {
  const [data, setData] = useState<Group[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(timer);
    }

    let mounted = true;
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const groups = await groupsService.getSavingsGroups();
        if (mounted) {
          setData(groups);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch groups data"),
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchGroups();
    return () => {
      mounted = false;
    };
  }, [user]);

  return { data, isLoading, error };
};
