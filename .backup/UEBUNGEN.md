# Übungen TEIL I - SERVER

Übung 0:

- Ausgeführt mit der fertigen Anwendung (eventuell auf meinem Mac)
- Ziel:
- Funktionsweise vom Playground verstanden,
- funktionsweise von queries und mutations verstanden

Übung 1:

- Schema definieren für Project und Task
- Resolver sind noch nicht fertig
- Man kann sich aber die Doku im Playground ansehen

Übung 2:

- Wir bauen einen Resolver für die 'projects' und 'project' Felder im Query-Resolver
- Wir bauen Resolver für 'tasks' und 'task' am Task-Resolver
- Verändern des module.exports

- (DB DataSource ist fertig. Die wird im Workshop auch nicht gezeigt)
- UserService ist noch nicht fertig
- danach können Queries ausgeführt werden, die noch nicht die User verwenden

Übung 3: (optional)

- DataSource für User implementieren

  - In UserRESTDataSource zwei Methoden implementieren
  - UserService dem Server bekannt machen (Server.js)

  - Queries ausführen (z.B. { projects { owner { id }}})
  - Anzahl requests überprüfen
  - Caching in userservice hinzufügen um Effekt zu sehen
