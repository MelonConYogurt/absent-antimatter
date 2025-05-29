import type {ProductUpdate} from "../../models/productmodel";

export default async function UpdateProduct(data: ProductUpdate) {
  try {
    const response = await fetch("http://localhost:8000/product/update/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return response.json();
    } else {
      const errorData = await response.text();
      console.error(
        `Error al actualizar producto: ${response.status} ${response.statusText}`,
        errorData
      );
      return false;
    }
  } catch (error) {
    console.error(
      "Error en la solicitud de actualización del producto:",
      error
    );
    return false;
  }
}
