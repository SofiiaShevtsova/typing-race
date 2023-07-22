import { TEXT_URL } from "./helpers/constants.mjs";

export const randomText = async () => {
let text
await fetch(TEXT_URL, { method: "GET" })
    .then((response) =>
      response.ok ? response.json() : Promise.reject(Error("Failed to load"))
    )
    .then((data) => text = data)
    .catch((error) => {
      throw error;
    });
return text
};
