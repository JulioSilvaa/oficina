import { NextRequest } from "next/server";

// Redireciona chamadas antigas de /api/budget para /api/budgets
function redirectToBudgets(req: NextRequest) {
  const url = new URL("/api/budgets", req.url);
  return Response.redirect(url, 308);
}

export function GET(req: NextRequest) {
  return redirectToBudgets(req);
}

export function POST(req: NextRequest) {
  return redirectToBudgets(req);
}
