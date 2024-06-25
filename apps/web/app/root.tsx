import { json, type LinksFunction, type MetaFunction, type LoaderFunctionArgs } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = ({ data }) => {
  return [{ title: 'Moon PNPM Remix' }];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {children}
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <>
      <body className="relative bg-[#f2f4f9] p-6 font-sans">
        <h1>Error</h1>
        <ScrollRestoration />
        <Scripts />
      </body>
    </>
  );
}

const toColor = (s: string) => {
  const r = s.match(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
  if (!r) return s;

  let v;
  if (r[1].length === 6) {
    v = parseInt(r[1], 16);
  } else {
    v = parseInt(r[1].replace(/(.)/g, '$1$1'), 16);
  }

  return `${(v >> 16) & 255} ${(v >> 8) & 255} ${v & 255}`;
};

export async function loader({ context }: LoaderFunctionArgs) {
  return json(context);
}

export default function App() {
  return (
    <>
      <body className="relative bg-[#f2f4f9] p-6 font-sans">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </>
  );
}
