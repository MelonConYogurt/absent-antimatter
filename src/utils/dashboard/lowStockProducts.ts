import {API_HOST} from "../variable";

export default async function getLowStockProduts() {
  try {
    const response = await fetch(`${API_HOST}/products/low-stock/`, {
      method: "GET",
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
