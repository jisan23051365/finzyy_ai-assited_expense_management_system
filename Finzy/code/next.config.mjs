/** @type {import('next').NextConfig} */
// add for random user images
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'randomuser.me',
        }, ],
    },
    // this part for add receipts scanning
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
};

export default nextConfig;