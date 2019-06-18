// TODO 1: --------------------------------------------------------------------------
//
// Füge den Type 'Project' zum Schema hinzu
//
// FELDER:
// id (ID)
// title, description: jeweils strings
// owner: Referenz auf den User-Type
// category: Referenz auf den Category-Type
// tasks: Liste mit Task-Objekten
// task: Erwartet ein Argument (id) und liefert einen optionales Task-Objekt zurück
//
// Alle Felder sind *Pflicht*-Felder, dh dürfen kein null zurückgeben (bis auf 'task' Feld)

// TODO 2: --------------------------------------------------------------------------
//
// Füge die Felder 'project' und 'projects' am Query-Type hinzu (s.u.)
// Füge das Feld 'updateTaskState' am Mutation-Type hinzu (s.u.)
// ---------------------------------------------------------------------------------
//
// Du kannst das Schema jederzeit im GraphQL Playground (http://localhost:4000)
// kontrollieren.
// HINWEIS: Das AUSFÜHREN der Queries wird noch nicht funktionieren, aber im Doc Explorer
//          des Playgrounds sollen die neuen Typen und Felder zu sehen sein.

module.exports = `
  type User {
    id: ID!
    login: String!
    name: String!
    requestId: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  enum TaskState {
    NEW
    RUNNING
    FINISHED
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    state: TaskState!
    assignee: User!
    toBeFinishedAt: String!
  }

  type Query {
    ping: String!
    users: [User!]!
    user(id: ID!): User

    # TODO 2:
    # Ergänze zwei Felder im Query-Type:
    # 'projects', der eine Liste mit Projekten zurückliefert
    # 'project', das ein einzelnes Projekt (optional) zurückliefert.
    #            Dieses Feld benötigt die id des gesuchten Projektes
    #            als (Pflicht-)Feld
  }

  input AddTaskInput {
    title: String!
    description: String!
    toBeFinishedAt: String!
    assigneeId: ID!
  }

  type Mutation {
    addTask(projectId: ID!, input: AddTaskInput!): Task!

    # TODO 3:
    # Ergänze die 'updateTaskState' Mutation
    # Sie erwartet zwei Argumente: 
    #    taskId (Pflicht)
    #    newState (Pflicht)
    # Sie liefert ein Task-Objekt zurück (Pflicht)
  }

  type Subscription {
    onNewTask: Task!
    onTaskChange(projectId: ID): Task!
  }
`;
