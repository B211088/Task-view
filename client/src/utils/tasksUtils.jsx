import { graphQLRequest } from "./request";

export const tasksLoader = async ({ params: { planId } }) => {
  const query = `query Plan($planId: String!) {
    plan(planId: $planId) {
      id
      name
      maxTasksPerDay
      autoPlan
      startDate
      author {
        uid  
        name
      }
      tasks {
        id
        title
        content
        status
        startDay
        timeSchedule
        priority {
          id
          name
          point
        }
        prerequisites
        estimatedCompletionTime
      }
      priorities {
        id
        name
        point
      }
    }
  }`;

  const data = await graphQLRequest({ query, variables: { planId } });
  return data;
};

export const addTask = async (taskData) => {
  const mutation = `mutation AddTask(
    $title: String!,
    $content: String,
    $status: String!,
    $timeSchedule: String,
    $startDay: String,
    $planId: String!,
    $priorityId: String,
    $prerequisites: [String],
    $estimatedCompletionTime: Int
  ) {
    addTask(
      title: $title,
      content: $content,
      status: $status,
      timeSchedule: $timeSchedule,
      startDay: $startDay,
      planId: $planId,
      priorityId: $priorityId,
      prerequisites: $prerequisites,
      estimatedCompletionTime: $estimatedCompletionTime
    ) {
      id
      title
      content
      status
      timeSchedule
      startDay
      priority {
        id
        name
        point
      }
      prerequisites
      estimatedCompletionTime
    }
  }`;

  const data = await graphQLRequest({
    query: mutation,
    variables: taskData,
  });

  return data;
};

export const updateTask = async (taskData) => {
  const mutation = `mutation Mutation(
    $id: String!,
    $title: String!,
    $content: String,
    $status: String!,
    $timeSchedule: String,
    $startDay: String,
    $priorityId: String,
    $prerequisites: [String],
    $estimatedCompletionTime: Int
  ) {
    updateTask(
      id: $id,
      title: $title,
      content: $content,
      status: $status,
      timeSchedule: $timeSchedule,
      startDay: $startDay,
      priorityId: $priorityId,
      prerequisites: $prerequisites,
      estimatedCompletionTime: $estimatedCompletionTime
    ) {
      id
      title
      content
      status
      timeSchedule
      startDay
      priority {
        id
        name
        point
      }
      prerequisites
      estimatedCompletionTime
    }
  }`;

  const data = await graphQLRequest({
    query: mutation,
    variables: taskData,
  });

  return data;
};

export const deleteTask = async (taskId) => {
  const mutation = `mutation DeleteTask($taskId: String!) {
    deleteTask(taskId: $taskId) {
      id
      title
      status
    }
  }`;

  const data = await graphQLRequest({
    query: mutation,
    variables: { taskId },
  });

  return data;
};
