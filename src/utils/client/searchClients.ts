import type {responseClient} from "../../models/clientModel";

export default async function SearchClients(
  offset: number,
  limit: number,
  search: string | null = null,
  column: string | null = null,
  order_direction: string | null = null
): Promise<responseClient | false> {
  try {
    const params = new URLSearchParams();

    if (search) {
      params.append("search_value", search);
    }
    if (column) {
      params.append("column", column);
    }
    if (order_direction) {
      params.append("order_direction", order_direction);
    }

    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    const url = `http://localhost:8000/clients/search/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return response.json() as Promise<responseClient>;
    } else {
      console.error("Error en la respuesta del servidor:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return false;
  }
}
