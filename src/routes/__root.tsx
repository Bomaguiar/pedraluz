import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import appCss from "../styles.css?url";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-tag text-muted-foreground">404</p>
        <h1 className="font-display mt-4 text-5xl text-foreground">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-foreground px-6 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pedra & Luz — International Architecture & Construction" },
      {
        name: "description",
        content:
          "Licensed California architect with offices in Lisbon and California. Precision-engineered design for residential, commercial, and transformation projects.",
      },
      { name: "author", content: "Pedra & Luz" },
      { property: "og:title", content: "Pedra & Luz — International Architecture & Construction" },
      {
        property: "og:description",
        content: "Architecture engineered for tomorrow. Lisbon · California · International.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pedra & Luz — International Architecture & Construction" },
      { name: "description", content: "Pedra & Luz Blueprint is an AI-powered architecture and construction platform for next-gen design." },
      { property: "og:description", content: "Pedra & Luz Blueprint is an AI-powered architecture and construction platform for next-gen design." },
      { name: "twitter:description", content: "Pedra & Luz Blueprint is an AI-powered architecture and construction platform for next-gen design." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e6ef46e9-e79b-44b3-8feb-7faba48be33d/id-preview-4f7c5ddc--850ac2fc-7e82-4680-a12c-31736e31d452.lovable.app-1776850919304.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e6ef46e9-e79b-44b3-8feb-7faba48be33d/id-preview-4f7c5ddc--850ac2fc-7e82-4680-a12c-31736e31d452.lovable.app-1776850919304.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Outlet />
        <Toaster position="bottom-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
