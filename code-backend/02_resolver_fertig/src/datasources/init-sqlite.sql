DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS projects;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name character varying (255) NOT NULL
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  description character varying (255) NOT NULL,
  title character varying (255) NOT NULL,
  category_id bigint NOT NULL,
  owner_id VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  description text NOT NULL,
  state integer NOT NULL,
  title character varying (255) NOT NULL,
  finish_date timestamp without time zone NOT NULL,
  assignee_id varchar(255) NOT NULL,
  project_id bigint
);

INSERT INTO categories
    VALUES (8000, 'Private');
INSERT INTO categories
    VALUES (8001, 'Hobby');
INSERT INTO categories
    VALUES (8002, 'Business');
INSERT INTO projects
    VALUES (1, 'Create GraphQL Talk', 'Create GraphQL Talk', 8002, 'U1');
INSERT INTO projects
    VALUES (2, 'Organize and book a nice 4-day trip to the North Sea in April', 'Book Trip to St. Peter-Ording', 8001, 'U2');
INSERT INTO projects
    VALUES (3, 'Its spring time! Time to clean up every room', 'Clean the House', 8000, 'U3');
INSERT INTO projects
    VALUES (4, 'We have some problems in our architecture, so we need to refactor it', 'Refactor Application', 8002, 'U1');
INSERT INTO projects
    VALUES (5, 'Same procedure as every year...', 'Tax Declaration', 8002, 'U1');
INSERT INTO projects
    VALUES (6, 'Implement a small application to demonstrate GraphQL', 'Implement GraphQL Java App', 8002, 'U4');
INSERT INTO tasks
    VALUES (2000, 'duo duo leo suas possit erat senectus conubia error quaeque audire felis discere alienum elit lacus penatibus quas tale enim perpetua melius lacinia omittam esse saepe affert appareat vituperatoribus torquent epicurei', 1, 'Create a draft story', '2019-04-05 19:44:00', 'U1', 1);
INSERT INTO tasks
    VALUES (2001, 'sadipscing explicari deserunt mattis usu suas turpis congue faucibus delenit petentium ridens conceptam solum duo elaboraret veniam noluisse', 0, 'Finish Example App', '2019-06-04 15:13:00', 'U2', 1);
INSERT INTO tasks
    VALUES (2002, 'quas disputationi dicant sapien aliquip latine mollis aenean quisque quaestio ridiculus eros aenean habeo nibh', 0, 'Design Slides', '2019-05-12 07:58:00', 'U1', 1);
INSERT INTO tasks
    VALUES (2003, 'vehicula sapien porttitor habitant nascetur quaeque aliquam nominavi porta risus consetetur discere purus hinc doctus ornatus melius audire melius', 0, 'Find a train', '2019-04-30 19:07:00', 'U2', 2);
INSERT INTO tasks
    VALUES (2004, 'audire eum pellentesque placerat adolescens eleifend gubergren salutatus idque dico tristique alia an epicuri quo vituperata pellentesque consectetuer dicam percipit postea dignissim omittam dolores ponderum veniam massa salutatus eam dicam deseruisse quaestio iudicabit dictumst definitiones laoreet invenire nostrum ne aperiri singulis nostrum sea legimus', 2, 'Book a room', '2019-05-01 05:16:00', 'U1', 2);
INSERT INTO tasks
    VALUES (2005, 'has maiestatis suspendisse has menandri perpetua diam nostrum sollicitudin dictumst volutpat condimentum omittantur unum persecuti natoque petentium malesuada eloquentiam faucibus epicurei graeci indoctum efficiantur mi partiendo commodo inciderint veri ferri vim veri antiopam', 0, 'Clean dining room', '2019-07-02 20:42:00', 'U3', 3);
INSERT INTO tasks
    VALUES (2006, 'habitasse voluptatibus dissentiunt ei ignota nostrum signiferumque arcu falli causae antiopam salutatus dui sed neque vocibus lacus option interdum intellegebat viderer definiebas sit pellentesque efficiantur iudicabit discere regione sagittis nostrum dolore maluisset tacimates eu', 0, 'Clean kitchen', '2019-06-11 20:39:00', 'U1', 3);
INSERT INTO tasks
    VALUES (2007, 'quisque ceteros quaestio docendi esse hinc ea vim ponderum veritus accommodare pertinax orci wisi consul signiferumque labores regione', 2, 'Empty trash bin', '2019-05-24 16:20:00', 'U2', 3);
INSERT INTO tasks
    VALUES (2008, 'alienum felis partiendo antiopam sapientem vocibus dolores delicata dolorum quaeque suas iaculis quaerendum moderatius ex ornare', 1, 'Clean windows', '2019-05-24 02:10:00', 'U2', 3);
INSERT INTO tasks
    VALUES (2009, 'pellentesque quis enim reprimique doming sem ignota deterruisset vis scripserit mus sodales felis tation quaeque melius aenean numquam nunc tale conubia vel id ante aperiri pro ancillae petentium recteque sumo cursus reque taciti rhoncus scripta maluisset magna delicata mi debet', 1, 'Discuss problems with all developers', '2019-06-14 18:01:00', 'U5', 4);
INSERT INTO tasks
    VALUES (2010, 'praesent inimicus alterum nec iaculis iaculis utamur tale semper ligula iusto congue augue etiam sanctus repudiandae dui sociis fames moderatius pro constituam cum porta euismod facilisi ignota latine theophrastus fringilla interesset doctus ius maximus senectus ut taciti te morbi orci novum atqui', 1, 'Evaluate GraphQL for API', '2019-05-25 17:10:00', 'U6', 4);
INSERT INTO tasks
    VALUES (2011, 'putent assueverit curabitur nostra risus prodesset tempus in principes persequeris splendide posuere condimentum necessitatibus delenit etiam te magnis nominavi tacimates', 1, 'Re-write tests in Jest', '2019-04-17 05:41:00', 'U5', 4);
INSERT INTO tasks
    VALUES (2012, 'semper pericula ridens docendi invenire assueverit invidunt quam idque ridens venenatis te verear enim graeci populo urna nisi periculis scripta viderer veniam detraxit vero faucibus te possim noluisse', 2, 'Upgrade NodeJS version', '2019-06-15 00:05:00', 'U1', 4);
INSERT INTO tasks
    VALUES (2013, 'suscipit duo suavitate mucius eam dicat postulant postulant massa voluptaria definitiones convenire appetere altera ultricies splendide possim eget semper vituperatoribus dui facilisis scripserit rhoncus', 0, 'Print invoices', '2019-05-22 11:40:00', 'U1', 5);
INSERT INTO tasks
    VALUES (2014, 'omnesque nullam noluisse pericula facilis proin suavitate scripta suscipit prodesset fabellas habitasse similique referrentur autem etiam rutrum quot vivamus cras suscipiantur reprehendunt duo fames blandit decore electram ridiculus expetenda luctus eruditi', 0, 'Collect receipts of last quarter', '2019-04-26 00:29:00', 'U1', 5);
INSERT INTO tasks
    VALUES (2015, 'duis periculis cetero tellus porta id sadipscing dictas dictas vel nisl lacus maluisset novum dicam suavitate fugit consectetuer partiendo tamquam malorum volumus erat tempor sonet facilisi congue ei tale facilis rhoncus fastidii voluptatum pretium minim posuere eros quaestio sapien praesent habemus appetere minim invidunt', 0, 'Mail to tax accountant', '2019-06-25 09:18:00', 'U1', 5);
INSERT INTO tasks
    VALUES (2016, 'sumo meliore lacinia nobis suas postulant fabulas tractatos habeo porro lorem ei ornatus qui diam maiestatis eirmod vidisse accusata', 0, 'Create sample user stories', '2019-04-27 11:34:00', 'U1', 6);
INSERT INTO tasks
    VALUES (2017, 'posuere inciderint honestatis principes viderer mattis propriae disputationi mnesarchum efficiantur iriure animal dictum putent vocent petentium dolores iusto pri fermentum sadipscing delectus', 0, 'Design user interface', '2019-05-25 17:21:00', 'U2', 6);
INSERT INTO tasks
    VALUES (2018, 'quem elitr ignota harum novum hendrerit quem deterruisset fabellas nonumy intellegebat dis solet melius pericula meliore suspendisse facilisis massa suscipit platonem sagittis purus facilis mediocritatem lacinia unum consectetuer mazim aliquet scelerisque congue', 0, 'Create initial Java Project', '2019-05-15 01:40:00', 'U3', 6);
INSERT INTO tasks
    VALUES (2019, 'vivendo invenire no ius petentium adipiscing labores persequeris interdum epicuri affert contentiones doctus ferri parturient ut litora vivamus postea qualisque ei felis rutrum movet doming mus malorum primis ridiculus nunc nunc autem ligula nunc scripta volumus epicuri posidonium maximus consetetur', 0, 'Add GraphQL libs', '2019-04-25 08:15:00', 'U4', 6);
INSERT INTO tasks
    VALUES (2020, 'maximus suavitate leo libris legere viverra populo quaerendum splendide ultricies te malesuada discere maximus possim graecis elit pertinax sanctus tamquam invidunt wisi ornare expetenda minim duis nulla fermentum tristique lobortis ne invenire eum fermentum saperet fabellas magna phasellus proin viderer agam vis ancillae reformidans vim latine graece facilisi', 0, 'Implement Domain model', '2019-06-19 02:04:00', 'U7', 6);
INSERT INTO tasks
    VALUES (2021, 'reprimique luctus salutatus voluptatum quas quaeque cubilia novum inceptos constituto dolorum', 0, 'Add persistence', '2019-06-03 04:52:00', 'U8', 6);
INSERT INTO tasks
    VALUES (2022, 'errem inimicus iudicabit porro ferri maximus repudiare porttitor sed tortor mel alia tacimates eleifend molestie mei tamquam equidem sanctus populo sonet vulputate reprimique maecenas expetendis magnis solum voluptaria definitiones sociis inceptos tincidunt', 0, 'Write some test', '2019-05-22 00:13:00', 'U3', 6);
INSERT INTO tasks
    VALUES (2023, 'usu semper magna appetere ullamcorper dolor taciti option quot ubique persecuti tamquam mnesarchum neglegentur numquam adipiscing legere tale ludus morbi tempor pharetra persequeris cras adhuc agam potenti causae dissentiunt eros persecuti aperiri reprehendunt persequeris definitiones utroque varius vidisse pertinacia docendi idque', 0, 'Define GraphQL Schema', '2019-05-02 06:51:00', 'U2', 6);
INSERT INTO tasks
    VALUES (2024, 'idque litora aliquid expetenda vivendo populo liber turpis alienum voluptaria doming intellegebat aliquid faucibus maluisset mucius veniam habemus detraxit fabulas tristique porttitor urna montes habitasse', 0, 'Implement DataLoader', '2019-05-19 19:09:00', 'U3', 6);
INSERT INTO tasks
    VALUES (2025, 'fabulas dolorem utroque inciderint vocent postea sententiae natum imperdiet percipit pericula tibique hendrerit his adolescens necessitatibus tortor', 0, 'Add pagination support', '2019-04-24 18:52:00', 'U5', 6);
INSERT INTO tasks
    VALUES (2026, 'erat egestas tempor signiferumque ponderum ornare taciti viris eam voluptaria periculis inceptos molestie ceteros te atqui reque fugit eloquentiam verear nostrum nulla maiestatis scripta odio semper nostra porttitor detraxit eirmod lorem maximus semper unum atqui dico dolorum bibendum curabitur no audire', 0, 'Add login mutation', '2019-06-30 06:00:00', 'U6', 6);
INSERT INTO tasks
    VALUES (2027, 'possim pellentesque pertinax enim vis meliore ponderum vis fabellas quaerendum iuvaret quisque vulputate nulla dicant ancillae turpis scripserit duo volumus elaboraret neque sententiae posse suavitate nonumes percipit maiestatis', 0, 'Write documentation', '2019-05-17 03:11:00', 'U7', 6);
INSERT INTO tasks
    VALUES (2028, 'alterum corrumpit montes error dolor at mediocritatem tempus adipiscing contentiones utamur pertinacia melius gubergren et option tantas veri honestatis sonet alia splendide repudiandae dicta habitasse eum mandamus dolorem nostra etiam ei mea conclusionemque sed porttitor ornatus justo tritani maiestatis qui posse dicant appareat graeco possit vituperata conclusionemque viderer adipiscing', 0, 'Setup testdata', '2019-05-19 19:09:00', 'U7', 6);
INSERT INTO tasks
    VALUES (2029, 'dicat in intellegebat conceptam quas tritani porro idque evertitur eros audire deseruisse ultricies', 0, 'Optimize data loaders', '2019-05-23 07:41:00', 'U8', 6);
