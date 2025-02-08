import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import axios from "redaxios";
import { deserialise } from "kitsu-core";

type entityType = {
  canonical: string;
  type: "node";
  bundle: "page";
  id: string;
  uuid: string;
};

type jsonapiType = {
  individual: string;
  resourceName: string;
};

export type SlugApiReturnType = {
  resolved: string;
  isHomePath: boolean;
  entity: entityType;
  label: string;
  jsonapi: jsonapiType;
};

export const queryPageBySlug = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.log({ data });
    return axios
      .get<SlugApiReturnType>(
        `http://localhost:8888/router/translate-path?path=${data}`
      )
      .then((r) => r.data)
      .catch((err) => {
        console.error(err);
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });
  });

export const getNode = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.log({ data });
    return axios
      .get<any>(data)
      .then((r) => {
        console.log({r}, r.data)
        return deserialise(r.data)?.data;
      })
      .catch((err) => {
        console.error(err);
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });
  });

  
