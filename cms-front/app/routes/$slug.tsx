import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  notFound,
} from "@tanstack/react-router";
import { cache } from "react";
import { getNode, queryPageBySlug, SlugApiReturnType } from "~/utils/drupal";
import { NotFound } from "~/components/NotFound";
import { getNodePageJsonApiParams } from "~/lib/json-api-params";
import { ParagraphWrapper } from "~/components/paragraphs/ParagraphWrapper";

export const Route = createFileRoute("/$slug")({
  component: RouteComponent,
  loader: async ({ params: { slug } }) => {
    slug = "/" + slug;

    const slugPage = cache(async ({ slug }: { slug: string }) => {
      return await queryPageBySlug({ data: slug });
    });

    const url: SlugApiReturnType = await slugPage({ slug });

    const urlencodedQueryString = getNodePageJsonApiParams("node--page");

    const node: any = await getNode({
      data: `${url.jsonapi.individual}?${urlencodedQueryString}`,
    });

    if (!node.status) {
      notFound();
    }

    return node;
  },
  errorComponent: NodeErrorComponent,

  notFoundComponent: () => {
    return <NotFound>Page Node not found</NotFound>;
  },
});

export function NodeErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function RouteComponent() {
  const node = Route.useLoaderData();

  return <ParagraphWrapper node={node} />;
}
