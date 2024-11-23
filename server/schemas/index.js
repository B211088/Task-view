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
  endDate: String,
  maxTasksPerDay: Int,
  author: Author,
  tasks: [Task],
  priorities: [Priority],
  updatedAt: String
  createdAt: String
}

type Task {
  id: String!
  title: String!
  content: String
  status: String!
  timeSchedule: Float
  timeIsPlay: Float
  prerequisites: [String]
  estimatedCompletionTime: Int
  startDay: String
  priorityId: String
  priority: Priority
  planId: String!
}

type Author {
  uid: String!,
  name: String,
  gmail: String!,
  password: String
}

input AuthorInput {
  name: String!,
  gmail: String!,
  password: String
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
  addPlan(name: String!, autoPlan: Boolean!, startDate: String!, endDate: String, maxTasksPerDay: Int): Plan,
  
  modifyPlan(id: String!, name: String!, autoPlan: Boolean!, startDate: String!, endDate: String, maxTasksPerDay: Int): Plan,
  
  deletePlan(id: String!): Plan,

  addPriority(name: String!, point: Int!, planId: String!): Priority,

  modifyPriority(priorities: [ModifyPriorityInput!]!): [Priority]
  
  deletePriority(ids: [String!]!): [Priority]
  
  register(uid: String!, name: String!, gmail: String!): Author,

  registerUser(authorInput: AuthorInput!): Author
 
  addTask(
    title: String!,
    content: String,
    status: String!,
    startDay: String,
    timeSchedule: Float
    timeIsPlay: Float
    planId: String!,
    priorityId: String,
    prerequisites: [String],
    estimatedCompletionTime: Int
  ): Task,
  
  updateTask(
    id: String!,             
    title: String!,
    content: String,
    status: String!,
    timeSchedule: Float,
    timeIsPlay: Float,
    startDay: String,
    priorityId: String,
    prerequisites: [String],
    estimatedCompletionTime: Int
  ): Task,

  deleteTask(taskId: String!): Task
}

input ModifyPriorityInput {
  id: String!
  name: String
  point: Int
}
`;
