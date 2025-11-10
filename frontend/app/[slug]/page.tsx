import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };


export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(850).height(610).url()
    : null;
  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <div className="flex flex-col items-center">
          <Image
            src={postImageUrl}
            alt={post.title}
            className="aspect-video"
            width="550"
            height="310"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
      <hr className="border" />
      {Array.isArray(post.body) && <div className="prose"><PortableText value={post.body} /></div>}
    </main>
  );
}

export async function generateMetadata({ params, }: { params: Promise<{ slug: string }> }) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      images: [postImageUrl]
    }
  }
}
