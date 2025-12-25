import "dotenv/config";
const fs = require("fs");
const path = require("path");


const WORKFLOW_DIR = "../n8n-master-workflows";

function cleanFileName(fileName) {
  return fileName
    .replace(".json", "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNodeTypes(jsonData) {
  if (!jsonData.nodes) return [];
  return jsonData.nodes.map(node => node.type);
}

function generateSummary(title, nodeTypes) {
  return `
Workflow title: ${title}

This n8n workflow uses the following nodes:
${nodeTypes.join(", ")}

This workflow is suitable for automation tasks related to:
${title}.
`.trim();
}

function readFolder(folderPath) {
  const items = fs.readdirSync(folderPath);

  items.forEach(item => {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readFolder(fullPath);
    } else if (item.endsWith(".json")) {
      const title = cleanFileName(item);

      const rawData = fs.readFileSync(fullPath, "utf8");
      const jsonData = JSON.parse(rawData);

      const nodeTypes = extractNodeTypes(jsonData);
      const summaryText = generateSummary(title, nodeTypes);

      console.log("Workflow title:", title);
      console.log("AI-friendly summary:");
      console.log(summaryText);
      console.log("------------------------");
    }
  });
}

readFolder(WORKFLOW_DIR);
