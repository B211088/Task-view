import { graphQLRequest } from "./request";

export const tasksLoader = async ({ params: { planId } }) => {
  const query = `query Plan($planId: String!) {
    plan(planId: $planId) {
      id
      name
      maxTasksPerDay
      autoPlan
      startDate
      endDate
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
        timeIsPlay
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
    $startDay: String,
    $timeSchedule: Float,
    $timeIsPlay: Float,
    $planId: String!,
    $priorityId: String,
    $prerequisites: [String],
    $estimatedCompletionTime: Int
  ) {
    addTask(
      title: $title,
      content: $content,
      status: $status,
      startDay: $startDay,
      timeSchedule: $timeSchedule,
      timeIsPlay: $timeIsPlay,
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
      timeIsPlay
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
    $timeSchedule: Float,
    $timeIsPlay: Float,
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
      timeIsPlay: $timeIsPlay,
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
      timeIsPlay
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
