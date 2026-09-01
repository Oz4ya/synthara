import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// __dirname = src/utils -> on remonte 2 fois pour arriver à la racine du projet,
// puis on descend dans data/blacklist.json
const DATA_PATH = path.join(__dirname, "..", "..", "data", "blacklist.json");

function ensureFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

function readData() {
  ensureFile();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function addUser(userId, reason = "Aucune raison fournie") {
  const data = readData();
  if (data.users.some((u) => u.id === userId)) return false;

  data.users.push({
    id: userId,
    reason,
    date: new Date().toISOString(),
  });
  writeData(data);
  return true;
}

export function removeUser(userId) {
  const data = readData();
  const initialLength = data.users.length;
  data.users = data.users.filter((u) => u.id !== userId);

  if (data.users.length === initialLength) return false;
  writeData(data);
  return true;
}

export function isBlacklisted(userId) {
  const data = readData();
  return data.users.find((u) => u.id === userId) || null;
}

export function getAll() {
  return readData().users;
}
