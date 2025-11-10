import Link from "next/link";
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

      <section className="min-h-screen">

        <h1 className="text-7xl font-serif text-center">Hi, I'm Jothish JJ</h1>
        <p>I am deeply passionate about technology and its impact in making the lives of humans better with it and I am also extremely interested in people working with technology to solve great world problems that needs fixing and make contributions to the world.</p>

      </section>

      <section>
        <h2 className="text-4xl font-bold mb-8">Read my Blogs!</h2>
        <ul className="flex flex-col gap-y-4">
          {posts.slice(0, 10).map((post) => (
            <li key={post._id} className="border-1 p-4">
              <Link href={`/${post.slug.current}`}>
                <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
                <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
