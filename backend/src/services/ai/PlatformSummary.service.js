const ai = require("../../config/GeminiAI");
const { generateTextContent } = require("../../utils/geminiAi.util");

const generateFallbackInsight = ({ totals, daily }) => {
    const getTrend = (arr) => {
        if (!arr || arr.length < 2) return "stable";

        const first = arr[0]?.count ?? arr[0];
        const last = arr[arr.length - 1]?.count ?? arr[arr.length - 1];

        if (last > first) return "growing";
        if (last < first) return "declining";
        return "stable";
    };

    const userTrend = getTrend(daily.users);
    const spaceTrend = getTrend(daily.spaces);
    const bookingTrend = getTrend(daily.bookings);

    return `Flexo Spaces currently has ${totals.users} users, ${totals.spaces} spaces, and ${totals.bookings} bookings. User growth is ${userTrend}, space growth is ${spaceTrend}, and booking activity is ${bookingTrend}. The platform appears ${
        bookingTrend === "growing"
            ? "healthy with increasing demand"
            : "stable but still building traction"
    }. The biggest opportunity is improving booking conversion by helping users discover relevant spaces faster and encouraging repeat bookings through a better user experience.`;
};

const GeneratePlatformInsight = async ({ totals, daily }) => {
    try {
        const prompt = `
You are a senior SaaS product analyst and startup growth consultant.

You are analyzing FLEXO SPACES, a workspace booking marketplace where users discover and book coworking spaces, meeting rooms, private offices, and event venues.

Your goal is to generate a concise executive-level platform insight for the founder.

---

## PLATFORM METRICS

OVERVIEW:

* Total Users: ${totals.users}
* Total Spaces: ${totals.spaces}
* Total Bookings: ${totals.bookings}

LAST 28 DAYS TRENDS:
Users: ${JSON.stringify(daily.users)}
Spaces: ${JSON.stringify(daily.spaces)}
Bookings: ${JSON.stringify(daily.bookings)}



## ANALYSIS REQUIREMENTS

Analyze:

1. Overall platform health

   * Is the marketplace growing, stable, or stagnating?

2. Supply vs Demand

   * Compare growth of spaces and owners against bookings and users.
   * Identify imbalance if supply is growing faster than demand or vice versa.

3. Growth Signals

   * Highlight positive momentum, adoption trends, or engagement patterns.

4. Risks & Concerns

   * Detect low booking activity, slow user growth, inactive supply, demand shortages, or unusual trends.

5. Founder Recommendation

   * Give ONE specific high-impact action the founder should prioritize next.

---

## WRITING STYLE

* Sound like a Head of Product, Growth Lead, or Startup Advisor
* Be data-driven
* Avoid generic statements
* Mention actual metrics when relevant
* Focus on business impact
* Maximum 180 words

---

## OUTPUT RULES

Return ONLY plain text.
No markdown.
No bullet points.
No numbering.
No JSON.
No headings.
No formatting.
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