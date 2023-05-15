import { useAppSelector } from '@/redux/store';

export const useSelectedOrganizationId = (): number | undefined =>
  useAppSelector((state) => state.ui?.shared.selectedOrganizationId);

export const useSelectedReportingPeriodId = (): number | undefined =>
  useAppSelector((state) => state.ui?.shared.selectedReportingPeriodId);