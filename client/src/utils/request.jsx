import { GRAPHQL_SERVER } from "./constants";

export const graphQLRequest = async (payload, options = {}) => {
  if (localStorage.getItem("accessToken")) {
    try {
      const res = await fetch(`${GRAPHQL_SERVER}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          ...options,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 403) {
          return null;
        }

        throw new Error(`Request failed with status ${res.status}`);
      }

      const { data, errors } = await res.json();

      if (errors) {
        console.error("GraphQL errors:", errors);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error during GraphQL request:", error);
      return null;
    }
  }

  console.warn("No access token found.");
  return null;
};
