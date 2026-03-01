import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // GSAP ScrollTrigger pin:true physically moves DOM nodes.
  // React 18 Strict Mode double-invokes effects in dev, which puts React's
  // virtual DOM out of sync with GSAP's pin spacer, causing removeChild errors.
  // Strict Mode is dev-only; disabling it has zero effect in production.
  reactStrictMode: false,

  // Assignment-friendly build artifact: `next build` generates a static export in `out/`.
  // (Note: `next start` is not used with static exports.)
  output: "export",
  trailingSlash: true,

  // Optional: set for GitHub Pages (e.g. "/<repo>")
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
