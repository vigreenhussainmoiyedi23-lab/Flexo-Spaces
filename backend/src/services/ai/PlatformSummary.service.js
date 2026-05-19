const ai = require("../../config/GeminiAI");
const { generateTextContent } = require("../../utils/geminiAi.util");

const generateFallbackInsight = ({ totals, daily }) => {
    const getTrend = (arr) => {
        if (!arr || arr.length < 2) return "stable";
        const diff = arr[arr.length - 1] - arr[0];
        if (diff > 0) return "growing";
        if (diff < 0) return "declining";
        return "stable";
    };

    const userTrend = getTrend(daily.users);
    const listingTrend = getTrend(daily.listings);
    const swapTrend = getTrend(daily.swaps);
    const disputeTrend = getTrend(daily.disputes);

    const disputeRate = totals.swaps > 0
        ? (totals.disputes / totals.swaps) * 100
        : 0;

    return `The platform shows ${userTrend} user activity with ${listingTrend} listings and ${swapTrend} swaps, indicating overall ${swapTrend === "growing" ? "positive momentum" : "moderate engagement"}. However, dispute levels are ${disputeTrend} with a dispute rate of ${disputeRate.toFixed(1)}%, suggesting ${disputeRate > 10 ? "potential trust or transaction issues" : "manageable operational risk"}. To improve platform performance, focus on increasing successful swaps through better matching, clearer listing quality, and improved user trust mechanisms such as ratings and verification.`;
};

const GeneratePlatformInsight = async ({ totals, daily }) => {
    try {
        const prompt = `
You are a senior SaaS analytics expert.

You are analyzing a clothing exchange marketplace platform called SWAPSTYLE.

Your job is to generate a HIGH LEVEL BUSINESS INSIGHT based on platform metrics.

-----------------------------------
DATA
-----------------------------------

TOTAL METRICS:
- Users: ${totals.users}
- Listings: ${totals.listings}
- Swaps: ${totals.swaps}
- Disputes: ${totals.disputes}

DAILY TREND SUMMARY (last 28 days):
Users: ${JSON.stringify(daily.users)}
Listings: ${JSON.stringify(daily.listings)}
Swaps: ${JSON.stringify(daily.swaps)}
Disputes: ${JSON.stringify(daily.disputes)}

-----------------------------------
YOUR TASK
-----------------------------------

Analyze this platform and return:

1. Overall platform health (1–2 lines)
2. Growth insight (users/listings/swaps trend)
3. Risk insight (disputes, drop-offs, or anomalies)
4. One actionable recommendation for improvement

-----------------------------------
RULES
-----------------------------------

- Be concise (max 120–160 words)
- No markdown
- No bullet points
- No JSON
- No formatting
- Only plain text
- Think like a startup CTO or product analyst

-----------------------------------
OUTPUT
-----------------------------------

Return ONLY the insight text.
`;

        const response = await generateTextContent(prompt);

        if (!response || typeof response !== "string") {
            throw new Error("Invalid AI response");
        }

        return {
            success: true,
            value: response.trim(),
        };

    } catch (err) {
        console.error("AI failed, using fallback:", err.message);

        const fallback = generateFallbackInsight({ totals, daily });

        return {
            success: true,
            value: fallback,
            fallback: true, // optional flag for debugging
        };
    }
};

module.exports = { GeneratePlatformInsight };