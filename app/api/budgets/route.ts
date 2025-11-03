import { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

type CompanyData = {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
};

type ClientData = {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
};

type Item = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  displayPrice: string;
};

type Budget = {
  number: string;
  date: string; // ISO
  company: CompanyData;
  client: ClientData;
  items: Item[];
  total: number;
};

export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      {
        error:
          "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local",
      },
      { status: 500 }
    );
  }

  let body: Budget;
  try {
    body = (await req.json()) as Budget;
  } catch (e) {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Validação mínima
  if (!body?.number || !body?.client?.name || !Array.isArray(body?.items)) {
    return Response.json(
      { error: "Dados obrigatórios ausentes: number, client.name, items" },
      { status: 400 }
    );
  }

  // Persistir como JSONB para flexibilidade
  const payload = {
    number: body.number,
    date: body.date,
    company: body.company,
    client: body.client,
    items: body.items,
    total: body.total,
  };

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("budgets")
    .upsert(payload, { onConflict: "number" })
    .select("number")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, id: data.number });
}

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      {
        error:
          "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local",
      },
      { status: 500 }
    );
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}
