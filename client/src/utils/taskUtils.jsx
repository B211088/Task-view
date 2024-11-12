import { graphQLRequest } from "./request";

export const taskLoader = async ({ params: { taskId } }) => {
  const query = `query Task($taskId: String!) {
    task(taskId: $taskId) {
      title
      content
      estimatedCompletionTime
      timeSchedule
      startDay
      status
      priority {      
        id
        name
        point
      }
      prerequisites
      planId
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: { taskId },
  });

  if (!data || !data.task) {
    throw new Error("Task not found or error in fetching task data");
  }
  return data;
};
