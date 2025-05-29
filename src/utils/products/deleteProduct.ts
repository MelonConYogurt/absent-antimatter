import {API_HOST} from "../variable"

export default async function DeleteProduct(id: number) {
  try {
    const response = await fetch(`${API_HOST}/product/delete/?id=${id}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
    });

    if (response.ok) {
      return response.json();
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
