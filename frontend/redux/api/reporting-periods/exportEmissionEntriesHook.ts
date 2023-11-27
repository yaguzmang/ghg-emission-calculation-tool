import { useState } from 'react';

import { getSession } from 'next-auth/react';

interface useExportEmissionDataResult {
  data: string | null;
  loading: boolean;
  error: string | null;
}

const useExportEmissionData = (
  reportingPeriodId: number,
): [useExportEmissionDataResult, () => void] => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const session = await getSession();
      const authToken = session?.user?.jwt;
      const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/reporting-periods/${reportingPeriodId}/emission-entries/export?as=csv`;

      if (!authToken) {
        throw new Error(`User is not authorized`);
      }

      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const csvData = await response.text();

      setData(csvData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerFetch = () => {
    fetchData();
  };

  return [{ data, loading, error }, triggerFetch];
};

export default useExportEmissionData;
