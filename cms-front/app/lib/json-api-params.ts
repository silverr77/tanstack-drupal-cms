import { DrupalJsonApiParams } from "drupal-jsonapi-params";

export type ResourceType = "node--page";

export function getNodePageJsonApiParams(resourceType: ResourceType) {
  const apiParams = new DrupalJsonApiParams();
  if (resourceType === "node--page") {
    apiParams
      .addInclude([
        "field_paragraphs",
        "field_paragraphs.field_image.field_media_image",
      ])
      .addFields("node--page", ["title", "field_paragraphs", "path", "status"]);
  }
  return apiParams.getQueryString();
}
