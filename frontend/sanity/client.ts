import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "jpb8gxd3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
