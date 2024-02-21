import {
  OverlappingProportionalBarChart,
  OverlappingProportionalBarChartEntryData,
} from '@/components/charts/overlapping-proportional-bar-chart';
import { kgsToTons } from '@/lib/numbers.ts/conversion';

interface EmissionsBarProps {
  highestTotalEmissions: number;
  totalGHGEmissions: number;
  totalEmissionOfOrgUnit: number | null;
  totalEmissionOfEmissionCategory: number | null;
  categoryColor: string | null;
}

export function EmissionsBar({
  highestTotalEmissions,
  totalGHGEmissions,
  totalEmissionOfOrgUnit,
  totalEmissionOfEmissionCategory,
  categoryColor,
}: EmissionsBarProps) {
  const chartEntries: OverlappingProportionalBarChartEntryData[] = [];

  const totalGHGEmissionsEntry: OverlappingProportionalBarChartEntryData = {
    color: '#000',
    value: kgsToTons(totalGHGEmissions),
  };

  chartEntries.push(totalGHGEmissionsEntry);

  if (totalEmissionOfOrgUnit !== null) {
    const totalEmissionOfOrgUnitEntry: OverlappingProportionalBarChartEntryData =
      {
        color: '#9396B0',
        value: kgsToTons(totalEmissionOfOrgUnit),
      };
    chartEntries.push(totalEmissionOfOrgUnitEntry);
  }

  if (totalEmissionOfEmissionCategory !== null) {
    const totalEmissionOfEmissionCategoryEntry: OverlappingProportionalBarChartEntryData =
      {
        color: categoryColor ?? '#414546',
        value: kgsToTons(totalEmissionOfEmissionCategory),
      };
    chartEntries.push(totalEmissionOfEmissionCategoryEntry);
  }

  return (
    <div className="flex w-full flex-col">
      <OverlappingProportionalBarChart
        data={chartEntries}
        barHeight={30}
        highestTotal={kgsToTons(highestTotalEmissions)}
      />
    </div>
  );
}
