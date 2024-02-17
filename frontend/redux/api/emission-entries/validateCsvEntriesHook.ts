import { useEffect, useState } from 'react';

import axios from 'axios';
import { getSession } from 'next-auth/react';

export type EmissionDataItem = {
  quantitySource?: string | null;
  label?: string | null;
  tier: number;
  quantity: number;
  organizationUnit: string;
  emissionSource: number;
  reportingPeriod: number;
};

export type EmissionDataItemMapped = Omit<
  EmissionDataItem,
  'organizationUnit'
> & { organizationUnit: number };

export type EmissionDataItemsArray = {
  data: EmissionDataItemMapped;
}[];

export type ValidateCSVResponse = {
  data: EmissionDataItem[];
  organizationUnitKeys: string[];
};

export interface UseValidateCsvEntriesResult {
  data: ValidateCSVResponse | null;
  loading: boolean;
  error: string | null;
  progress: number | null;
  resetState: () => void;
}

interface UseValidateCsvEntriesProps {
  file: File;
  reportingPeriodId: number;
}

const useValidateCsvEntries = ({
  file,
  reportingPeriodId,
}: UseValidateCsvEntriesProps): [UseValidateCsvEntriesResult, () => void] => {
  const [data, setData] = useState<ValidateCSVResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const uploadFile = async () => {
    try {
      setLoading(true);

      const session = await getSession();
      const authToken = session?.user?.jwt;
      const url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/emission-entries/csv/validate`;

      if (!authToken) {
        throw new Error(`User is not authorized`);
      }

      const formData = new FormData();
      formData.set('reportingPeriod', reportingPeriodId.toString());
      formData.set('file', file);

      setProgress(0);
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!,
          );
          setProgress(percentCompleted);
        },
      });
      setData(response.data);
      setError(null);
      // eslint-disable-next-line
    } catch (error: any) {
      const reponseError = error.response?.data?.error?.message;
      setError(
        reponseError ??
          (error instanceof Error ? error.message : String(error)),
      );
      setData(null);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerUpload = () => {
    uploadFile();
  };

  const resetState = () => {
    setData(null);
    setLoading(false);
    setError(null);
    setProgress(null);
  };

  useEffect(() => {
    resetState();
  }, [file]);
  return [{ data, loading, error, progress, resetState }, triggerUpload];
};

export default useValidateCsvEntries;
