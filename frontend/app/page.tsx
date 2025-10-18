import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <section className="min-h-[100svh] lg:flex justify-center items-center gap-2">
        <div>
          <h1 className="text-6xl font-serif">Hi, I'm Jothish</h1>
          <p>I'm really cool! and I'd love to work with you!</p>
        </div>
        <div>
          <Image
            src="/Jothish Handsome.jpg"
            alt="A handsome guy"
            height="400"
            width="400"
          />
        </div>
      </section>

      <h3 className="text-4xl font-bold mb-8">See my Blogs!</h3>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
