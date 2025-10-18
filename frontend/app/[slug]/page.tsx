import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

import Image from "next/image";
import Link from "next/link";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options,
  );

  const authorDocs = await client.fetch<SanityDocument>(
      `*[_id=="${post.author._ref}"]`);
  const author = await authorDocs[0];

  const authorImageUrl = author.image
    ? urlFor(author.image)?.width(100).height(100).url()
    : null;

   
  return {
    title: post.title,
    description: post.body[0].children[1].text,
    openGraph: {
        images: [authorImageUrl] 
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options,
  );
  const authorDocs = await client.fetch<SanityDocument>(
      `*[_id=="${post.author._ref}"]`);
  const author = await authorDocs[0];

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(850).height(610).url()
    : null;

  const authorImageUrl = author.image
    ? urlFor(author.image)?.width(100).height(100).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline text-sm">
        ← Back to posts
      </Link>
      {postImageUrl && (
         <div className="flex flex-col items-center">
            <Image
              src={postImageUrl}
              alt={post.title}
              className="aspect-video rounded-xl"
              width="550"
              height="310"
            />
        </div>
      )}
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-sm">{new Date(post.publishedAt).toLocaleDateString()}</p>
      <div className="flex gap-4 items-center">
          {authorImageUrl && <Image src={authorImageUrl} alt={author.name} className="rounded-4xl" width="40" height="40" />}
          <p className="text-sm">{author.name}</p>
      </div>
      <hr />
      <div className="prose">
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
