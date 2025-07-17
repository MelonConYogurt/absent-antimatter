import {API_HOST} from "../variable";

export default async function getToken(email: string, password: string) {
  try {
    const response = await fetch(`${API_HOST}/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch token");
    }
  } catch (error) {
    console.log(error);
    return;
  }
}
