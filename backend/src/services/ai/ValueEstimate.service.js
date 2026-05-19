const ai = require("../../config/GeminiAI");
const { generateTextContent } = require("../../utils/geminiAi.util");

const getFallbackValue = ({ brandName, clothingType, condition }) => {
    let base = 300;

    const brandScore = {
        "nike": 800,
        "adidas": 700,
        "zara": 600,
        "h&m": 500,
        "puma": 650,
    };

    const conditionMultiplier = {
        new: 1,
        like_new: 0.9,
        good: 0.7,
        worn: 0.5,
    };

    base = brandScore[brandName?.toLowerCase()] || base;

    return Math.round(base * (conditionMultiplier[condition] || 0.6));
};

const EstimateValue = async ({ brandName, size, clothingType, condition }) => {
    try {
        const prompt = `
You are an intelligent clothing valuation system for a resale marketplace.

Estimate a fair value for a clothing item in rupees
Use your understanding of clothing categories, brand positioning, and resale value.

-----------------------------------
GUIDELINES
-----------------------------------

- Infer the category from the clothing type automatically
  (e.g., Shirt → Tops, Jacket → Outerwear, Saree → Ethnic)

- Consider these factors:

1. Condition (MOST IMPORTANT)
   - New items should be valued significantly higher
   - Worn or poor condition should reduce value strongly

2. Type of clothing
   - Heavier or premium items (jackets, coats, ethnic wear) → higher value
   - Basic items (t-shirts, shirts) → moderate value

3. Brand influence (BUT KEEP IT FAIR)
   - Well-known brands may slightly increase value
   - Unknown or local brands should STILL receive reasonable value
   - NEVER undervalue an item just because the brand is unknown

-----------------------------------
IMPORTANT RULES
-----------------------------------

- Be realistic for a resale marketplace (not retail price)
- Avoid extremely low values unless condition is poor
- A "like new" item should NEVER have a very low value
- Maintain fairness across branded and local items

-----------------------------------
ITEM DETAILS
-----------------------------------

Brand: ${brandName}
Type: ${clothingType}
Size: ${size}
Condition: ${condition}

-----------------------------------
OUTPUT
-----------------------------------

Don't return undefined or null or any non-numeric value.
Return ONLY a number in the response.
No explanation.
No text.
`;

        const response = await generateTextContent(prompt);

        // 🔥 FIX 1: handle undefined response safely
        if (!response) {
            throw new Error("No response from AI");
        }

        // 🔥 FIX 2: normalize response
        const raw =
            typeof response === "string"
                ? response
                : response.text || response.toString();

        // 🔥 FIX 3: safe match
        const match = raw?.match(/\d+/);
        const value = match ? Number(match[0]) : null;

        // 🔥 FIX 4: fallback instead of crash
        if (!value) {
            throw new Error("Invalid AI output");
        }

        return value;

    } catch (err) {
       

        // ✅ NEVER crash your app
        return getFallbackValue({ brandName, clothingType, condition });
    }
};

const EstimateValueOld = async ({ brandName, size, clothingType, condition }) => {
    try {


        // prompt from chatgpt to estimate the value of a clothing item based on brand, size, type and condition

        const response = await generateTextContent(prompt);
        const raw = response?.toString().trim();
        const match = raw.match(/\d+/);
        const value = match ? Number(match[0]) : null;

        if (!value) {
            throw new Error("AI did not return a valid number");
        }
        return value
    } catch (err) {
        console.error("Error in EstimateValue:", err);
        throw err
    }
};

module.exports = { EstimateValue }                                  