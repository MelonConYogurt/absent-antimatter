import type {responseSales} from "../../models/saleModel";
import {API_HOST} from "../variable";

export default async function SearchSales(
  offset: number,
  limit: number,
  search: string | null = null,
  column: string | null = null,
  order_direction: string | null = null
): Promise<responseSales | false> {
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

    const url = `${API_HOST}/sales/?${params.toString()}`;
    console.log("Consultando API en:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Datos recibidos:", data);
      return data as responseSales;
    } else {
      console.error(
        "Error en la respuesta del servidor:",
        response.status,
        await response.text()
      );
      return false;
    }
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return false;
  }
}
