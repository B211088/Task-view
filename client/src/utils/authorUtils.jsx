import { graphQLRequestAuthor } from "./request";

export const registerUser = async (authorInput) => {
  const query = `mutation RegisterUser($authorInput: AuthorInput!) {
        registerUser(authorInput: $authorInput) {
          uid
          name
          email
        }
      }`;

  const data = await graphQLRequestAuthor({
    query,
    variables: { authorInput },
  });

  return data;
};
