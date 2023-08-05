import { z } from 'zod';

import {
  CreateEmissionEntryData,
  CustomEmissionFactor,
} from '@/redux/api/emission-entries/emissionEntriesApiSlice';

export const CustomEmissionFactorSchema: z.ZodType<CustomEmissionFactor> =
  z.object({
    value: z.coerce.number().nonnegative({
      message:
        'dashboard.form.emissionEntry.emissionFactors.value.error.positive',
    }),
    source: z.string().min(1, {
      message:
        'dashboard.form.emissionEntry.emissionFactors.source.error.input',
    }),
  });

export const EmissionEntrySchema: z.ZodType<CreateEmissionEntryData> = z.object(
  {
    organizationUnit: z.coerce
      .number({
        invalid_type_error:
          'dashboard.form.emissionEntry.organizationUnit.error.select',
      })
      .int()
      .positive({
        message: 'dashboard.form.emissionEntry.organizationUnit.error.select',
      }),
    reportingPeriod: z.coerce
      .number({
        invalid_type_error:
          'dashboard.form.emissionEntry.reportingPeriod.error.select',
      })
      .int()
      .positive({
        message: 'dashboard.form.emissionEntry.reportingPeriod.error.select',
      }),
    emissionSource: z.coerce
      .number({
        invalid_type_error:
          'dashboard.form.emissionEntry.emissionSource.error.select',
      })
      .int()
      .positive({
        message: 'dashboard.form.emissionEntry.emissionSource.error.select',
      }),
    quantity: z.coerce
      .number({
        invalid_type_error: 'dashboard.form.emissionEntry.quantity.error.valid',
      })
      .nonnegative({
        message: 'dashboard.form.emissionEntry.quantity.error.valid',
      }),
    tier: z.coerce
      .number({
        invalid_type_error: 'dashboard.form.emissionEntry.tier.error.select',
      })
      .int()
      .nonnegative({
        message: 'dashboard.form.emissionEntry.tier.error.select',
      }),
    quantitySource: z.string().optional(),
    customEmissionFactorDirect:
      CustomEmissionFactorSchema.optional().nullable(),
    customEmissionFactorIndirect:
      CustomEmissionFactorSchema.optional().nullable(),
    customEmissionFactorBiogenic:
      CustomEmissionFactorSchema.optional().nullable(),
  },
);
