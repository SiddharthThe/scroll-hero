import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GSAP ScrollTrigger pin:true physically moves DOM nodes.
  // React 18 Strict Mode double-invokes effects in dev, which puts React's
  // virtual DOM out of sync with GSAP's pin spacer, causing removeChild errors.
  // Strict Mode is dev-only; disabling it has zero effect in production.
  reactStrictMode: false,
};

export default nextConfig;
