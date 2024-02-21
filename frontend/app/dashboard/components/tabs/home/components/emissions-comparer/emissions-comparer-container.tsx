import { useTranslation } from 'react-i18next';

import { EmissionsComparerChartsContainer } from './emissions-comparer-charts/emissions-comparer-charts-container';
import { EmissionsComparerSelectors } from './emissions-comparer-selectors/emissions-comparer-selectors-container';

export function EmissionsComparerContainer() {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-1 gap-0 lg:grid-cols-[420px_auto]">
      <div className="bg-primary p-10 text-primary-foreground sm:p-14">
        <span className="text-3xl font-bold">
          {t('dashboard.home.compare')}
        </span>

        <div className="my-12">
          <EmissionsComparerSelectors />
        </div>
      </div>

      <div className="bg-background p-14">
        <EmissionsComparerChartsContainer />
      </div>
    </div>
  );
}
