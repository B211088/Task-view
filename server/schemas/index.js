export const typeDefs = `#graphql

type Priority {
  id: String!,
  name: String,
  point: Int,
}

type Plan {
  id: String!,
  name: String,
  autoPlan: Boolean,
  startDate: String,
  endDate: String
  maxTasksPerDay: Int,
  author: Author,
  tasks: [Task],
  priorities: [Priority]
  updatedAt: String
}

type Task {
  id: String!
  title: String!
  content: String
  status: String!
  timeSchedule: String
  prerequisites: [String]
  estimatedCompletionTime: Int
  startDay: String
  dueDate: String
  priorityId: String
  priority: Priority
  planId: String!
}




type Author {
  uid: String!,
  name: String
  gmail: String
}

type Query {
  plans: [Plan],
  plan(planId: String!): Plan,
  tasks: [Task],
  task(taskId: String!): Task,
  authors: [Author],
  author(authorId: String!): Author,
  priorities: [Priority],
}

type Mutation {
  addPlan(name: String!, autoPlan: Boolean!, startDate: String, endDate: String,  maxTasksPerDay: Int): Plan,
  deletePlan(id: String!): Plan,
  addPriority(name: String!, point: Int!, planId: String!): Priority,
  register(uid: String!, name: String!, gmail: String): Author
 addTask(
    title: String!,
    content: String,
    status: String!,
    timeSchedule: String,
    startDay: String,
    planId: String!,
    priorityId: String,
    prerequisites: [String],
    estimatedCompletionTime: Int
  ): Task
   updateTask(
    id: String!,             
    title: String!,
    content: String,
    status: String!,
    timeSchedule: String,
    startDay: String,
    priorityId: String,
    prerequisites: [String],
    estimatedCompletionTime: Int
  ): Task,
  deleteTask(taskId: String!): Task
}
`;
