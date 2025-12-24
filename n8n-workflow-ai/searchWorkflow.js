import "dotenv/config";
import axios from "axios";
import OpenAI from "openai";

const QDRANT_URL = "http://localhost:6333";
const COLLECTION_NAME = "n8n_workflows";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchWorkflow(userQuery) {
  // 1️⃣ Create embedding for user input
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: userQuery,
  });

  const queryVector = embeddingResponse.data[0].embedding;

  // 2️⃣ Search Qdrant
  const response = await axios.post(
    `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
    {
      vector: queryVector,
      limit: 5,
      with_payload: true,
    }
  );

  return response.data.result;
}

// TEST
(async () => {
  const results = await searchWorkflow(
    "I want a reminder workflow that notifies me via email"
  );

  console.log("Top matching workflows:\n");

  results.forEach((item, index) => {
    console.log(`#${index + 1}`);
    console.log("Title:", item.payload.title);
    console.log("Nodes:", item.payload.nodes);
    console.log("Score:", item.score);
    console.log("-------------------");
  });
})();
