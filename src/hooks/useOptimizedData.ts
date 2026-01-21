// hooks/useOptimizedData.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface DataItem {
  id: string;
  title: string;
  category: string;
  timestamp: Date;
}

export const useOptimizedData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: 'all' });

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useMemo(
    () => debounce((searchTerm: string) => {
      fetchData({ ...filters, search: searchTerm });
    }, 300),
    [filters]
  );

  const fetchData = useCallback(async (filterParams: typeof filters) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data?${new URLSearchParams(filterParams)}`);
      const result = await response.json();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => 
      filters.category === 'all' || item.category === filters.category
    );
  }, [data, filters.category]);

  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    debouncedSearch(search);
  }, [debouncedSearch]);

  return {
    data: filteredData,
    loading,
    filters,
    updateSearch,
    setFilters
  };
};
