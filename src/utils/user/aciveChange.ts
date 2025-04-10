import type {User, responseUser} from "@/models/userModel";

export default async function ActiveChange(
  data: User
): Promise<responseUser | false> {
  try {
    const url = "http://localhost:8000/users/change/state/";
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
