export const SUBJECTS = [
  "Data Structures & Algorithms",
  "Operating Systems",
  "Database Management Systems",
  "Computer Networks",
  "Object-Oriented Programming",
  "Java",
  "JavaScript",
  "Python",
  "SQL",
  "Aptitude",
  "C++",
  "System Design (Basic)",
  "Web Development",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
];

const optionSets = {
  Easy: ["A direct definition", "A runtime error", "A network protocol", "A database index"],
  Medium: ["The most suitable choice", "A less scalable option", "An unrelated syntax rule", "A deployment setting"],
  Hard: ["The correct tradeoff", "A tempting but incomplete answer", "A low-level detail only", "An opposite design goal"],
};

const prompts = {
  "Data Structures & Algorithms": [
    ["Which structure is typically used for breadth-first traversal?", "Queue"],
    ["What does binary search require?", "Sorted input"],
    ["Which technique solves overlapping subproblems efficiently?", "Dynamic programming"],
  ],
  "Operating Systems": [
    ["What does a scheduler primarily decide?", "Which process runs next"],
    ["What problem can semaphores help prevent?", "Race conditions"],
    ["Which memory technique maps virtual addresses to physical addresses?", "Paging"],
  ],
  "Database Management Systems": [
    ["What does normalization mainly reduce?", "Data redundancy"],
    ["Which property ensures a transaction is all-or-nothing?", "Atomicity"],
    ["What speeds up reads on frequently filtered columns?", "Indexing"],
  ],
  "Computer Networks": [
    ["Which protocol provides reliable ordered delivery?", "TCP"],
    ["Which layer commonly handles routing?", "Network layer"],
    ["What does DNS resolve?", "Domain names to IP addresses"],
  ],
  "Object-Oriented Programming": [
    ["Which concept hides internal implementation details?", "Encapsulation"],
    ["Which concept lets one interface represent many forms?", "Polymorphism"],
    ["Which concept enables code reuse through parent-child classes?", "Inheritance"],
  ],
  Java: [
    ["Which keyword prevents inheritance of a class?", "final"],
    ["Which JVM area stores objects?", "Heap"],
    ["Which feature handles runtime method dispatch?", "Method overriding"],
  ],
  JavaScript: [
    ["Which declaration is block scoped?", "let"],
    ["What does a Promise represent?", "A future async result"],
    ["Which method creates a new transformed array?", "map"],
  ],
  Python: [
    ["Which type is immutable?", "tuple"],
    ["What does PEP 8 define?", "Style guidelines"],
    ["Which keyword creates a generator value?", "yield"],
  ],
  SQL: [
    ["Which clause filters grouped rows?", "HAVING"],
    ["Which join returns matching rows from both tables?", "INNER JOIN"],
    ["Which command removes all rows but keeps table structure?", "TRUNCATE"],
  ],
  Aptitude: [
    ["If speed doubles for same distance, time becomes?", "Half"],
    ["What is 20% of 250?", "50"],
    ["If ratio is 2:3 and total is 50, larger part is?", "30"],
  ],
  "C++": [
    ["Which feature releases resource automatically with object lifetime?", "RAII"],
    ["Which keyword supports runtime polymorphism?", "virtual"],
    ["Which operator allocates memory dynamically?", "new"],
  ],
  "System Design (Basic)": [
    ["Which component stores frequently accessed data?", "Cache"],
    ["Which approach distributes traffic across servers?", "Load balancing"],
    ["Which property means a system keeps working under failure?", "Availability"],
  ],
  "Web Development": [
    ["Which status code means resource was not found?", "404"],
    ["Which browser API stores key-value data persistently?", "localStorage"],
    ["Which header helps control cross-origin requests?", "CORS"],
  ],
  React: [
    ["Which hook stores component state?", "useState"],
    ["Which prop uniquely identifies list items?", "key"],
    ["Which hook runs side effects?", "useEffect"],
  ],
  "Node.js": [
    ["Which model helps Node.js handle many I/O tasks?", "Event loop"],
    ["Which object contains environment variables?", "process.env"],
    ["Which module system uses require by default?", "CommonJS"],
  ],
  Express: [
    ["Which function registers middleware?", "app.use"],
    ["Which object contains URL parameters?", "req.params"],
    ["Which method sends JSON responses?", "res.json"],
  ],
  MongoDB: [
    ["Which format does MongoDB store documents in?", "BSON"],
    ["Which field is the default primary key?", "_id"],
    ["Which operation adds a new document?", "insertOne"],
  ],
};

export const DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
export const QUESTION_COUNTS = [10, 20, 30, 40, 50];
export const DURATIONS = [10, 20, 30, 45, 60, 90];

export const QUESTION_BANK = SUBJECTS.flatMap((subject) =>
  prompts[subject].flatMap(([question, answer], promptIndex) =>
    ["Easy", "Medium", "Hard"].map((difficulty, difficultyIndex) => {
      const options = [
        answer,
        ...optionSets[difficulty].filter((option) => option !== answer).slice(0, 3),
      ];

      return {
        id: `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${promptIndex + 1}-${difficulty.toLowerCase()}`,
        subject,
        difficulty,
        question: `${question} (${difficulty})`,
        options,
        correctAnswer: answer,
        explanation: `${answer} is the best answer for this ${subject} concept.`,
      };
    })
  )
);
