import type {responseUser} from "@/models/userModel";

export default async function GetUsers(
  offset: number,
  limit: number
): Promise<responseUser | false> {
  const url = `http://localhost:8000/users/?offset=${offset}&limit=${limit}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {},
    });
    if (response.ok) {
      return response.json() as Promise<responseUser>;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
