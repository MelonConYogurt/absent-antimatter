import type {FormUser} from "../../models/userModel";
import {API_HOST} from "../variable";

export default async function UpdateUser(data: FormUser) {
  try {
    const url = `${API_HOST}/users/update-info/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
