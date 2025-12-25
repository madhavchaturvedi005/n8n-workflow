import "dotenv/config";
import axios from "axios";
import OpenAI from "openai";

/* =======================
   CONFIG
======================= */
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const COLLECTION_NAME = "n8n_workflows";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =======================
   SEARCH FUNCTION
======================= */
async function searchWorkflows(query) {
  console.log("🔍 User query:", query);

  // 1️⃣ Create embedding
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  // 2️⃣ Search Qdrant
  const response = await axios.post(
    `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
    {
      vector,
      limit: 5,
      with_payload: true,
    },
    {
      headers: {
        "api-key": QDRANT_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  // 🔴 THIS WAS MISSING
  return response.data.result;
}

/* =======================
   RUN TEST
======================= */
(async () => {
  try {
    const query =
      "I want an AI workflow that scrapes Google Maps businesses and saves data to Google Sheets";

    const results = await searchWorkflows(query);

    console.log("\n✅ TOP MATCHES:\n");

    results.forEach((item, index) => {
      console.log(`🔹 Result ${index + 1}`);
      console.log("Title:", item.payload.title);
      console.log("Type:", item.payload.file_type);
      console.log("Score:", item.score.toFixed(4));
      console.log("Open Link:", item.payload.file_url);
      console.log("----------");
    });
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
})();
