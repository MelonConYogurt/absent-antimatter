import type {responseClient} from "../../models/clientModel";

export default async function DeleteClient(
  id: number
): Promise<responseClient | false> {
  try {
    console.log("Eliminando cliente con ID:", id);

    const url = `http://localhost:8000/clients/toggle-active/?id=${id}`;

    const response = await fetch(url, {
      method: "PATCH",
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
    console.error("Error al eliminar cliente:", error);
    return false;
  }
}
