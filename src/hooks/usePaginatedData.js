import { useState, useEffect } from 'react';

export const usePaginatedData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filter, itemsPerPage, ...dependencies]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        pageNo: currentPage,
        limitNo: itemsPerPage,
        search: searchTerm,
      };

      if (filter !== 'all') {
        params.status = filter === 'active' ? true : false;
      }

      const response = await fetchFunction(params);
      const responseData = response.data.data.data;
      const metadata = response.data.data.metadata;
      
      setData(responseData);
      setTotalPages(metadata.pages);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    loading,
    refetch: fetchData,
  };
};
