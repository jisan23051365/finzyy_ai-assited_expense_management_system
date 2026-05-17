import arcjet, { tokenBucket } from "@arcjet/next";

// this is for limitting transaction create
const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"],
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 10, // 10 collections
            interval: 3600, // per hour
            capacity: 10, // maximum
        }),
    ]
});
export default aj;