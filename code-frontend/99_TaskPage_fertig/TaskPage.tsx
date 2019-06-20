/* eslint-disable */

import * as React from "react";
import styles from "./TaskPage.module.scss";
import { RouteComponentProps } from "react-router";
import gql from "graphql-tag";
import TaskView from "./TaskView";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { TaskPageQuery, TaskPageQueryVariables, TaskPageQuery_project_task } from "./querytypes/TaskPageQuery";
import TaskPageHeader from "./TaskPageHeader";
import { UpdateTaskStateMutation, UpdateTaskStateMutationVariables } from "./querytypes/UpdateTaskStateMutation";
import { TaskState } from "global-query-types";

// ÜBUNG 1 TODO 1 ------------------------------------------------------------------------
//
// - Definiere, die GraphQL Abfrage, mit der Du die Daten eines Tasks
// laden kannst. Der Query soll in der Konstante TASK_QUERY abgelegt werden
// - Der Query soll 'TaskPageQuery' heißen
// - Führe dann in der TaskPage-Komponente den Query aus (s.u.)
//
// Tip 1: Baue die Query zunächst im Playground zusammen, dort kannst Du sie testen
//        und dann hierher kopieren.
//
// Tip 2: Die Query benötigt zwei Variablen, für das Projekt und den
//        ausgewählten Task.
//        Beide Werte stehen unten in der Komponente bereits zur Verfügung,
//        aber wie kommen sie in deine Query?
//
// Tip 3: In Apollo Queries, für die TypeScript-Definitionen generiert werden sollen,
//        ist es *Pflicht*, dass die Query einen Operation-Namen bekommen
//        (z.B. 'query TaskPageQuery { ... }'). Wenn Du den Query hier eingefügt hast,
//        werden die zugehörigen TypeScript-Definitionen automatisch generiert
//        (vorher 'npm run codegen:watch' im workspace-Verzeichnis aufrufen)
//        Die TypeScript-Definitionen werden in das Verzeichnis 'querytypes' geschrieben,
//        dort kannst Du sie bei Interesse einsehen
//        Die generierten Types für den TaskPageQuery werden übrigens auch in
//        TaskView und TaskPageHeader verwendet. Wenn sie also fehlen oder falsch sind,
//        werden auch diese beiden Komponenten nicht compilieren...
//
const TASK_QUERY = gql`
  query TaskPageQuery($projectId: ID!, $taskId: ID!) {
    project(id: $projectId) {
      id
      title
      task(id: $taskId) {
        id
        title
        description
        assignee {
          name
        }
        toBeFinishedAt
        state
      }
    }
  }
`;

// ÜBUNG 2 -------------------------------------------------------------------------------
//
// - Definiere die Mutation zum Aktualisieren des Task-States
// - Die Mutation muss dabei zwei Parameter entgegen nehmen: welche?
//
// Auch hier die Empfehlung, die Mutation zunächst im Playground zusammenzubauen
// und dort auszuprobieren
// Nach dem Einfügen werden die TypeScript Definitionen dazu automatisch generiert
const UPDATE_TASK_STATE_MUTATION = gql`
  mutation UpdateTaskStateMutation($taskId: ID!, $newState: TaskState!) {
    updateTaskState(taskId: $taskId, newState: $newState) {
      id
      state
    }
  }
`;

type TaskPageProps = RouteComponentProps<{ projectId: string; taskId: string }>;
export default function TaskPage(props: TaskPageProps) {
  const projectId = props.match.params.projectId;
  const taskId = props.match.params.taskId;

  // ÜBUNG 1, TODO 2:
  // Führe hier den TASK_QUERY aus und gibt - abhängig vom Zustand der Verarbeitung - folgendes
  // aus der TaskPage: Komponente zurück
  //  - Während die Query ausgeführt wird, sollte die Komponente einen Hinweis ausgeben
  //    ("Daten werden geladen" o.ä.)
  //  - Im Fehlerfall soll eine allgemeine Fehlermeldung zurückgegeben werden
  //  - Wenn die Daten erfolgreich geladen worden sind, sollen die Daten an die TaskView-
  //    Komponente übergeben weden. Die TaskView Komponente wir dann aus TaskPage
  //    zurückgeliefert (s.u.)
  //
  // Tip: Verwende den 'useQuery'-Hook (nicht die Query-Komponente).
  //      Denk dran, dass die TypeScript Definitionen generiert werden (s.o. TODO 1)
  //      const { loading, error, data} = useQuery<???, ???>(...);
  const { loading, error, data } = useQuery<TaskPageQuery, TaskPageQueryVariables>(TASK_QUERY, {
    variables: { projectId, taskId }
  });

  // ÜBUNG 2, TODO 2: ---------------------------------------------------
  // Hier soll die Mutation definiert werden ('useMutation'). Die zurückgelieferte
  // Funktion zum AUSFÜHREN der Mutation musst Du in einer Konstante ablegen,
  // damit Du in changeTaskState beim AUSFÜHREN daraufzugreifen kannst (s.u. TODO 3)
  const [runChangeTaskState] = useMutation<UpdateTaskStateMutation, UpdateTaskStateMutationVariables>(UPDATE_TASK_STATE_MUTATION);

  function changeTaskState(task: TaskPageQuery_project_task, newState: TaskState) {
    // ÜBUNG 2, TODO 3: ---------------------------
    // Hier soll die Mutation zum Aktualisieren des Tasks AUSGEFÜHRT werden.
    // Die Methode wird aufgerufen, wenn der Benutzer auf einen Button klickt (Start, Finish)
    // - Du musst useMutation verwenden, um die Mutation auszuführen
    // - Der Funktion wird ein Task übergeben (darüber bekommst Du die TaskId) sowie der
    //   neue Zustand, den Du unverändert an die Mutation weitergeben kannst.
    // - Den Rückgabewert der Mutation benötigst Du nicht; ausführen der Mutation
    //   ist ausreichend (fire and forget)
    //
    // - Bonus: Pass' die Funktionssignatur von 'changeTaskState' an. Ersetze 'any' durch
    //   die jeweils korrekten, generierten, TypeScript Typen.
    runChangeTaskState({
      variables: {
        taskId: task.id,
        newState
      }
    });
  }

  // ÜBUNG 1, TODO 3:
  // Verarbeite hier die unterschiedlichen Ergebnisse aus dem Task-Query
  // (error, loading, data):
  //  - Während die Query ausgeführt wird, soll die Komponente einen Hinweis ausgeben
  //    ("Daten werden geladen" o.ä.)
  //  - Im Fehlerfall soll eine allgemeine Fehlermeldung zurückgegeben werden
  //    (Welche Fehlerfälle gibt es?)
  //
  //  - Wenn die Daten erfolgreich geladen worden sind, sollen die Daten an die TaskView-
  //    Komponente übergeben weden. (s.u. TODO 4)
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error || !data) {
    return <h2>Sorry... Something failed while loading data </h2>;
  }

  if (!data.project) {
    return <h2>Project not found!</h2>;
  }

  if (!data.project.task) {
    return <h2>Task not found!</h2>;
  }

  return (
    <div className={styles.TaskPage}>
      {
        // ÜBUNG 1, TODO 4:
        // Wenn du oben (TODO 3) alle Konstellationen korrekt behandelt hast,
        // wird dieser Code nur ausgeführt, wenn Daten samt Projekt und Task geladen
        // worden sind.
        //
        // Füge hier die TaskPageHeader- und die TaskView-Komponente ein:
        // <TaskPageHeader project={?????} />
        // <TaskView task={???????} onTaskStateChange={changeTaskState} />
        //
        // Achtung! Die beiden Komponenten HINTER die folgende Zeile mit dem '}' schreiben!
      }
      <TaskPageHeader project={data.project} />
      <TaskView task={data.project.task} onTaskStateChange={changeTaskState} />
    </div>
  );
}
