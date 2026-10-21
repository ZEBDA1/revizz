import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { handleAI, aiStatus } from "../../../lib/revision-ai.mjs";
export const dynamic = "force-dynamic";
function configuration() {
  const key = Reflect.get(env, "CLOUDFLARE_API_TOKEN");
  const accountId = Reflect.get(env, "CLOUDFLARE_ACCOUNT_ID");
  return { key: typeof key === "string" ? key.trim() : "", accountId: typeof accountId === "string" ? accountId.trim() : "" };
}
export async function GET() {
  return aiStatus(configuration(), Boolean(await getChatGPTUser()));
}
export async function POST(request: Request) {
  return handleAI(request, Boolean(await getChatGPTUser()), configuration());
}
