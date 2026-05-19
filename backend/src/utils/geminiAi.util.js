const ai = require("../config/GeminiAI");


async function generateTextContent(query) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: query,
        });
        if (!response || !response.text) {
            throw new Error("Invalid AI response");
        }
        return response.text;
    } catch (error) {
        console.error("Error generating text content:", error);
    }
}



module.exports = { generateTextContent }