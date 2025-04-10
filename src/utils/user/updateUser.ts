import type {FormUser} from "../../models/userModel";

export default async function UpdateUser(data: FormUser) {
  try {
    const url = "http://localhost:8000/users/update/";
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
