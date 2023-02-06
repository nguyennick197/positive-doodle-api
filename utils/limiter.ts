import rateLimit from 'express-rate-limit';

// limit api usage to 100 requests per minute, except for whitelisted IP and URL
let whitelisted_ips: (string | undefined)[] = process.env.WHITELIST_IP!.split(",");
let whitelisted_urls: (string | undefined)[] = process.env.WHITELIST_URL!.split(",");

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => {
        return (whitelisted_ips.includes(req.ip) ||
            whitelisted_urls.includes(req.headers.referer));
    }
});