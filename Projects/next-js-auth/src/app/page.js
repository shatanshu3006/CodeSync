import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main >
      <h1 className="text-4xl mb-8">Home Page!</h1>


  <p className="mb-8">Here are some key features and aspects of Next.js:

	Server-side Rendering (SSR): Next.js allows you to render React components on the server side before sending them to the client. This improves SEO and initial load performance by providing a fully rendered page to the client.
	Static Siides automatic image optimization, including lazy loading and progressive image loading, to improve performance.
	Deployment: Next.js applications can be deployed to various hosting platforms, including Vercel (which was created by the same team behind Next.js), AWS, Netlify, and more.
  lol
</p>

<Link href='/signup' className="bg-blue-700 text-white px-5 py-3 rounded-lg mx-0">Create an Account</Link>
    </main>
  );
}
