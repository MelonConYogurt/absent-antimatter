import type {User, responseUser} from "@/models/userModel";
import {API_HOST} from "../variable";

export default async function ActiveChange(
  data: User
): Promise<responseUser | false> {
  try {
    const url = `${API_HOST}/users/toggle-active-state/`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return false;
    } else {
      return response.json() as Promise<responseUser>;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
