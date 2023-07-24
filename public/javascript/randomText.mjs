import { TEXT_URL } from "./helpers/constants.mjs";

export const randomText = async (id) => {
  let text;
  const url = `${TEXT_URL}${id}`;
  await fetch(url, { method: "GET" })
    .then((response) =>
      response.ok ? response.json() : Promise.reject(Error("Failed to load"))
    )
    .then((data) => (text = data))
    .catch((error) => {
      throw error;
    });
  return text;
};
