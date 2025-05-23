import type {responseUser} from "@/models/userModel";

export default async function SearchUsers(
  offset: number,
  limit: number,
  search: string | null = null
): Promise<responseUser | false> {
  try {
    console.log("Offset:", offset, "Limit:", limit, "Search:", search);
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    const url = `http://localhost:8000/users/search/?${params.toString()}`;

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
