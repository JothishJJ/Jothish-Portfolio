import Link from "next/link";
import Image from "next/image";

export default async function IndexPage() {

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <section className="min-h-[100svh] lg:flex justify-center items-center gap-2">
        <div>
          <h1 className="text-6xl font-serif">Hi, I&apos;m Jothish</h1>
          <p>I&apos;m really cool! and I&apos;d love to work with you!</p>
        </div>
        <div>
          <Image
            src="/Jothish Handsome.jpg"
            alt="A handsome guy"
            className="rounded-xl"
            height="400"
            width="400"
          />
        </div>
      </section>

      <iframe
        src="https://jothishjj.substack.com/embed"
        width="480"
        height="320"
      >
      </iframe>

      <h3 className="text-4xl font-bold mb-8">See my Blogs!</h3>
    </main>
  );
}
