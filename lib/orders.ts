/**
 * Lumière — server-side order persistence (placeholder).
 *
 * Vercel's serverless filesystem is read-only except for the ephemeral
 * `/tmp`, which does not survive cold starts or span instances. So this is a
 * best-effort store: an in-process Map (fast path within a warm instance) plus
 * a JSON file in the OS temp dir (survives within an instance's lifetime).
 * Good enough for a demo confirmation/track flow; a real deployment would
 * swap this for a database. Never imported by client code.
 */
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export type StoredOrder = {
  number: string;
  email: string;
  fullName: string;
  items: {
    name: string;
    descriptor: string;
    qty: number;
    unitPrice: number;
  }[];
  total: number;
  delivery: string;
  giftWrap: boolean;
  engraving: string;
  giftMessage: string;
  createdAt: string;
  paymentMode: "live" | "demo";
};

const mem = new Map<string, StoredOrder>();
const FILE = path.join(os.tmpdir(), "lumiere-orders.json");

async function readFile(): Promise<Record<string, StoredOrder>> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Record<string, StoredOrder>;
  } catch {
    return {};
  }
}

async function writeFile(map: Record<string, StoredOrder>): Promise<void> {
  try {
    await fs.writeFile(FILE, JSON.stringify(map), "utf8");
  } catch {
    /* read-only fs — in-memory copy still serves warm reads */
  }
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  mem.set(order.number, order);
  const map = await readFile();
  map[order.number] = order;
  await writeFile(map);
}

export async function getOrder(number: string): Promise<StoredOrder | null> {
  if (mem.has(number)) return mem.get(number)!;
  const map = await readFile();
  const found = map[number] ?? null;
  if (found) mem.set(number, found);
  return found;
}
