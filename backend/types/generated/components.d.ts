import type { Schema, Attribute } from "@strapi/strapi";

export interface EmissionEntryCustomEmissionFactor extends Schema.Component {
  collectionName: "components_emission_entry_custom_emission_factors";
  info: {
    displayName: "Custom emission factor";
    description: "";
  };
  attributes: {
    value: Attribute.Decimal & Attribute.Required;
    source: Attribute.Text;
  };
}

export interface GenericLink extends Schema.Component {
  collectionName: "components_generic_links";
  info: {
    displayName: "Link";
    icon: "link";
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface OrganizationUnitDividerValue extends Schema.Component {
  collectionName: "components_organization_unit_divider_values";
  info: {
    displayName: "Divider value";
    description: "";
  };
  attributes: {
    value: Attribute.Decimal & Attribute.Required;
    organizationDivider: Attribute.Relation<
      "organization-unit.divider-value",
      "oneToOne",
      "api::organization-divider.organization-divider"
    >;
  };
}

export interface OrganizationDivider extends Schema.Component {
  collectionName: "components_organization_dividers";
  info: {
    displayName: "Divider";
    description: "";
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface Components {
      "emission-entry.custom-emission-factor": EmissionEntryCustomEmissionFactor;
      "generic.link": GenericLink;
      "organization-unit.divider-value": OrganizationUnitDividerValue;
      "organization.divider": OrganizationDivider;
    }
  }
}
