import "dotenv/config";
import fs from "fs";
import path from "path";
import axios from "axios";
import OpenAI from "openai";
import { randomUUID } from "crypto";

/* =======================
   CONFIG
======================= */
const WORKFLOW_DIR = "../n8n-master-workflows";
const COLLECTION_NAME = "n8n_workflows";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

/**
 * MUST include /refs/heads/<branch>
 * Example:
 * https://raw.githubusercontent.com/djeknet/n8n-master-workflows/refs/heads/master
 */
const GITHUB_RAW_REFS_BASE = process.env.GITHUB_RAW_REFS_BASE;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const qdrantHeaders = {
  headers: {
    "api-key": QDRANT_API_KEY,
    "Content-Type": "application/json",
  },
};

/* =======================
   HELPERS
======================= */
function cleanFileName(fileName) {
  return fileName
    .replace(/\.(json|txt)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNodeTypes(jsonData) {
  if (!jsonData?.nodes || !Array.isArray(jsonData.nodes)) return [];
  return jsonData.nodes
    .map(n => n?.type)
    .filter(Boolean)
    .slice(0, 50);
}

function cleanPayload(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
}

/* =======================
   SUMMARY BUILDERS
======================= */
function buildJsonSummary(title, nodes) {
  return `
Workflow title: ${title}

This n8n workflow uses the following nodes:
${nodes.join(", ")}

This workflow is suitable for automation tasks related to:
${title}.
`.trim();
}

function buildTxtSummary(title, content) {
  return `
Document title: ${title}

This document explains:
${content.slice(0, 800)}
`.trim();
}

/* =======================
   QDRANT
======================= */
async function createCollection() {
  try {
    await axios.put(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}`,
      {
        vectors: {
          size: 3072,
          distance: "Cosine",
        },
      },
      qdrantHeaders
    );
    console.log("✅ Collection created");
  } catch (err) {
    if (err.response?.status === 409) {
      console.log("ℹ️ Collection already exists");
    } else {
      throw err;
    }
  }
}

async function embedAndStore(summary, payload) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: summary.slice(0, 2000),
  });

  await axios.put(
    `${QDRANT_URL}/collections/${COLLECTION_NAME}/points`,
    {
      points: [
        {
          id: randomUUID(), // ✅ VALID UUID
          vector: embedding.data[0].embedding,
          payload: cleanPayload(payload),
        },
      ],
    },
    qdrantHeaders
  );
}

/* =======================
   FILE WALKER
======================= */
async function walk(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    const isJson = item.toLowerCase().endsWith(".json");
    const isTxt = item.toLowerCase().endsWith(".txt");
    if (!isJson && !isTxt) continue;

    try {
      const title = cleanFileName(item);

      const relativePath = fullPath
        .replace("../n8n-master-workflows/", "")
        .replace(/\\/g, "/");

      // 🔐 URL encoding for spaces & special characters
      const fileUrl = encodeURI(
        `${GITHUB_RAW_REFS_BASE}/${relativePath}`
      );

      console.log("📦 Storing:", title);

      if (isJson) {
        const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        const nodes = extractNodeTypes(json);
        const summary = buildJsonSummary(title, nodes);

        await embedAndStore(summary, {
          title,
          file_type: "json",
          nodes,
          file_url: fileUrl,
        });
      }

      if (isTxt) {
        const content = fs.readFileSync(fullPath, "utf8");
        const summary = buildTxtSummary(title, content);

        await embedAndStore(summary, {
          title,
          file_type: "txt",
          file_url: fileUrl,
        });
      }
    } catch (err) {
      console.error("⚠️ Skipped file:", fullPath);
      console.error(err.response?.data || err.message);
    }
  }
}

/* =======================
   RUN
======================= */
(async () => {
  try {
    console.log("🚀 Starting ingestion...");
    await createCollection();
    await walk(WORKFLOW_DIR);
    console.log("🎉 Ingestion completed successfully");
  } catch (err) {
    console.error("❌ Fatal error:", err.response?.data || err.message);
  }
})();
