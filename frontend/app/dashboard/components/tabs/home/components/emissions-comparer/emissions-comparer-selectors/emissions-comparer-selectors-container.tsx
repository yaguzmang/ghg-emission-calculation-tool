import { EmissionCategorySelector } from './emission-category';
import { OrganizationSelector } from './organization';
import { OrganizationUnitSelector } from './organization-unit';

export function EmissionsComparerSelectors() {
  return (
    <div className="flex w-full flex-col gap-8">
      <OrganizationSelector />
      <OrganizationUnitSelector />
      <EmissionCategorySelector />
    </div>
  );
}
