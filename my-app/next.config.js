/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
          port: "",
          pathname: "/**",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Content-Security-Policy",
              value: "frame-src 'self' https://open.spotify.com;",
            },
          ],
        },
      ]
    },
  }
  
  module.exports = nextConfig
  
  