import {API_HOST} from "../variable";

export async function getSalesThisMonth(month: string | null = null) {
  try {
    const params = new URLSearchParams();

    if (month) {
      params.append("date", month);
    }

    const response = await fetch(
      `${API_HOST}/sales/monthly/${params.toString()}`,
      {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      }
    );

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
