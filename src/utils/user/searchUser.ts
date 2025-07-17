import type {responseUser} from "../../models/userModel";
import {API_HOST} from "../variable";

export default async function SearchUsers(
  offset: number,
  limit: number,
  search: string | null = null,
  column: string | null = null,
  order_direction: string | null = null
): Promise<responseUser | false> {
  try {
    console.log("Offset:", offset, "Limit:", limit, "Search:", search);
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

    const url = `${API_HOST}/users/list-filtered/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return response.json() as Promise<responseUser>;
    } else {
      console.error("Error en la respuesta del servidor:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return false;
  }
}
