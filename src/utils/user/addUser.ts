import type {FormUser} from "../../models/userModel";
import {API_HOST} from "../variable";

export default async function AddUser(data: FormUser) {
  try {
    console.log(JSON.stringify(data));
    const url = `${API_HOST}/users`;
    const response = await fetch(url, {
      method: "POST",
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
