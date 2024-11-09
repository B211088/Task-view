import { graphQLRequest } from "./request";

export const plansLoader = async () => {
  const query = `query Plans {
    plans {
      id
      name
      startDate
      autoPlan
      updatedAt
}
  }`;

  const data = await graphQLRequest({ query });
  return data;
};

export const addNewPlan = async (newPlan) => {
  const query = `mutation Mutation($name: String!, $autoPlan: Boolean!, $startDate: String!, $maxTasksPerDay: Int) {
    addPlan(name: $name, autoPlan: $autoPlan, startDate: $startDate, maxTasksPerDay: $maxTasksPerDay) {
      id
      name
      autoPlan
      startDate
      maxTasksPerDay
      author {
        uid  
      }
    }
  }`;

  const data = await graphQLRequest({ query, variables: newPlan });
  console.log("Tasks", data.tasks);
  return data;
};

export const deletePlan = async (planId) => {
  const query = `mutation Mutation($id: String!) {
    deletePlan(id: $id) {
      id
    }
  }`;

  try {
    const data = await graphQLRequest({ query, variables: { id: planId } });
    return data;
  } catch (error) {
    console.error("Xóa kế hoạch không thành công", error);
    throw new Error("Không thể xóa kế hoạch.");
  }
};

export const addNewPriority = async (newPriority) => {
  const query = `mutation Mutation($name: String!, $point: Int!, $planId: String!) {
    addPriority(name: $name, point: $point, planId: $planId) {
      id
      name
      point
    }
  }`;

  try {
    const data = await graphQLRequest({ query, variables: newPriority });
    return data.addPriority;
  } catch (error) {
    console.error("Failed to add new priority:", error);
    throw new Error("Could not create new priority.");
  }
};
