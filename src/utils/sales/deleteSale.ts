import {API_HOST} from "../variable";

export async function DeleteSale(id: number) {
  try {
    const response = await fetch(`${API_HOST}/sales/delete/?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      console.log(`Venta con ID ${id} eliminada exitosamente`);
      return response.json();
    } else {
      console.error(
        `Error al eliminar venta: Estado ${response.status} - ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error en la función DeleteSale:", error);
    return false;
  }
}
