import {API_HOST} from "../variable";

export default async function getTotalInventoryValue() {
  try {
    const response = await fetch(`${API_HOST}/inventory/total-value/`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });

    if (response.ok) {
      return response.json();
    } else {
      console.log(response.status);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
