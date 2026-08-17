import { NextResponse } from "next/server";
import { analyzeUserActivities } from "@/services/ecotrack-service";

const MAX_BODY_SIZE = 2048;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("text" in body) ||
      typeof (body as { text: unknown }).text !== "string"
    ) {
      return NextResponse.json(
        { error: "Se requiere un campo 'text' de tipo string." },
        { status: 400 },
      );
    }

    const text = (body as { text: string }).text;

    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "La descripción es demasiado larga." },
        { status: 400 },
      );
    }

    const result = analyzeUserActivities({ text });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud." },
      { status: 500 },
    );
  }
}
