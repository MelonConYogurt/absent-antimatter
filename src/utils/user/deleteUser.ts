import type {FormUser} from "../../models/userModel";
import {API_HOST} from "../variable";

export default async function DeleteUser(data: FormUser) {
  try {
    if (!data.id) {
      console.error("No se proporcionó ID para eliminar usuario");
      return false;
    }

    const url = `${API_HOST}/users/delete-by-id/?user_id=${data.id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      console.error("Error al eliminar usuario:", response.statusText);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
