/** @type {import('next').NextConfig} */

// Allow next/image to optimise images served from the Supabase Storage host.
// Derived from NEXT_PUBLIC_SUPABASE_URL so there's nothing hard-coded.
const remotePatterns = [];
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const { hostname } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // ignore malformed URL — falls back to repo images
  }
}

const nextConfig = {
  images: {
    // Brand logos are local, trusted SVGs (uploaded by the project owner).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns,
  },
};

export default nextConfig;
