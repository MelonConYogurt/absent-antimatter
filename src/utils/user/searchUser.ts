import type {responseUser, FormUser} from "@/models/userModel";

export default async function SearchUsers(
  search: string,
  offset: number | null,
  limit: number | null
): Promise<responseUser | false> {
  try {
    const url = `http://localhost:8000/users/search/?search=${search}&offset=${offset}&limit=${limit}`;
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
