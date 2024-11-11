import { graphQLRequest } from "./request";

export const plansLoader = async () => {
  const query = `query Plans {
    plans {
      id
      name
      startDate
      endDate
      autoPlan
      updatedAt
}
  }`;

  const data = await graphQLRequest({ query });
  return data;
};

export const addNewPlan = async (newPlan) => {
  const query = `mutation Mutation($name: String!, $autoPlan: Boolean!, $startDate: String!, $endDate: String! $maxTasksPerDay: Int) {
    addPlan(name: $name, autoPlan: $autoPlan, startDate: $startDate, endDate: $endDate, maxTasksPerDay: $maxTasksPerDay) {
      id
      name
      autoPlan
      startDate
      endDate
      maxTasksPerDay
      author {
        uid  
      }
    }
  }`;

  const data = await graphQLRequest({ query, variables: newPlan });

  return data;
};

export const modifyPlan = async (updatedPlan) => {
  const query = `mutation Mutation($id: String!, $name: String!, $autoPlan: Boolean!, $startDate: String!, $endDate: String, $maxTasksPerDay: Int) {
    modifyPlan(id: $id, name: $name, autoPlan: $autoPlan, startDate: $startDate, endDate: $endDate, maxTasksPerDay: $maxTasksPerDay) {
      id
      name
      autoPlan
      startDate
      endDate
      maxTasksPerDay
    }
  }`;

  try {
    const data = await graphQLRequest({ query, variables: updatedPlan });
    console.log("Tasks", data);
    return data;
  } catch (error) {
    console.error("Failed to modify plan:", error);
    throw new Error("Could not modify the plan.");
  }
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
    return data;
  } catch (error) {
    console.error("Failed to add new priority:", error);
    throw new Error("Could not create new priority.");
  }
};

export const modifyPriority = async (updatedPriorities) => {
  const query = `mutation Mutation($priorities: [ModifyPriorityInput!]!) {
    modifyPriority(priorities: $priorities) {
      id
      name
      point
    }
  }`;

  try {
    const data = await graphQLRequest({
      query,
      variables: { priorities: updatedPriorities },
    });
    return data;
  } catch (error) {
    console.error("Failed to modify priority:", error);
    throw new Error("Không thể chỉnh sửa ưu tiên.");
  }
};

export const deletePriority = async (deletedPriorities) => {
  const priorityIds = deletedPriorities.map((priority) => priority.id);

  const query = `
    mutation Mutation($ids: [String!]!) {
      deletePriority(ids: $ids) {
        id
      }
    }
  `;

  try {
    const data = await graphQLRequest({
      query,
      variables: { ids: priorityIds },
    });
    return data;
  } catch (error) {
    console.error("Error deleting priorities:", error);
    throw new Error("Không thể xóa ưu tiên.");
  }
};
