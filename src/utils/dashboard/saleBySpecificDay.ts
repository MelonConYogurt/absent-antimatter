import {API_HOST} from "../variable";

export async function getSalesByDay(date: string) {
  try {
    const response = await fetch(`${API_HOST}/sales/by-date/?date=${date}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });

    if (response.ok) {
      return response.json();
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
