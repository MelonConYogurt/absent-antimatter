import {API_HOST} from "../variable";

export default async function toggleActiveStateProduct(id: number) {
  try {
    const response = await fetch(
      `${API_HOST}/product/toggle-active-state/?id=${id}`,
      {
        method: "PATCH",
        headers: {},
      }
    );
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
