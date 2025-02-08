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
import { deserialise } from "kitsu-core";

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

    // Get blocks related to the page.
    const blocks: any = await fetch(
      "http://localhost:8888/api/tanstack/blocks"
    );

    let blocksResponse: any = await blocks.json();

    let nodeBlocks = blocksResponse?.blocks ?? {};
    if (nodeBlocks) {
      Object.keys(nodeBlocks).forEach((key) => {
        const deserialisedBlock = deserialise(nodeBlocks[key]?.data?.data);
        blocksResponse["blocks"][key]["data"] = deserialisedBlock.data;
        //console.log({ deserialisedBlock }, nodeBlocks[key]?.data?.data);
      });
    }

    return {
      node: node,
      blocks: blocksResponse,
    };
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
  const { node, blocks } = Route.useLoaderData();

  return (
    <PageHtmlRender blocks={blocks}>
      <ParagraphWrapper node={node} />
    </PageHtmlRender>
  );
}

export const PageHtmlRender = ({ blocks, children }: any) => {
  // Extract blocks by region
  const getBlocksByRegion = (region: string) => {
    return Object.entries(blocks?.blocks)
      .filter(([_, block]: [string, any]) => block?.region === region)
      .map(([_, block]) => block); // Just return the block values as array
  };

  // Get blocks for specific regions
  const headerBlocks = getBlocksByRegion("header");
  const footerBlocks = getBlocksByRegion("footer_bottom");
  const heroBlocks = getBlocksByRegion("hero");

  return (
    <div>
      <div>
        header blocks
        {headerBlocks.map((block: any) => (
          <img
            height={150}
            width={150}
            src={`http://localhost:8888/${block.data.field_logo.data.thumbnail.data.uri.url}`}
          />
        ))}
      </div>
      <div>
        Hero blocks
        {heroBlocks.map((block: any) => (
          <div
            dangerouslySetInnerHTML={{
              __html: block.data.field_description.value,
            }}
          ></div>
        ))}
      </div>
      {children}
      <div>
        footer blocks
        {footerBlocks.map((block: any) => (
          <img
            height={150}
            width={150}
            src={`http://localhost:8888/${block.data.field_logo.data.thumbnail.data.uri.url}`}
          />
        ))}
      </div>
    </div>
  );
};
