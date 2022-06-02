/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'links.papareact.com',
      'www.publicbooks.org',
      'cloudflare-ipfs.com',
      'klike.net',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com'
    ]
  },
}

module.exports = nextConfig
