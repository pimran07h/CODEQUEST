import { QuizQuestion } from '../types.js';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "In a balanced BST (like AVL or Red-Black tree), the height of the tree is bounded by O(log N), so search operations take logarithmic time.",
    category: "Data Structures",
    difficulty: "Easy"
  },
  {
    id: "q2",
    question: "What will be printed by this C snippet: printf(\"%d\", 5 >> 1);",
    options: ["10", "2", "2.5", "5"],
    correctAnswer: 1,
    explanation: "Right bit-shift by 1 performs integer division by 2. 5 >> 1 = floor(5/2) = 2.",
    category: "C Programming",
    difficulty: "Easy",
    codeSnippet: "printf(\"%d\", 5 >> 1);"
  },
  {
    id: "q3",
    question: "In Python, which built-in data type is immutable?",
    options: ["list", "dict", "tuple", "set"],
    correctAnswer: 2,
    explanation: "Tuples in Python are immutable sequences. Once initialized, their elements cannot be reassigned or modified.",
    category: "Python",
    difficulty: "Easy"
  },
  {
    id: "q4",
    question: "Which OOP principle is demonstrated when a child class provides a specific implementation of a method defined in its parent class?",
    options: ["Encapsulation", "Method Overloading", "Method Overriding (Polymorphism)", "Data Hiding"],
    correctAnswer: 2,
    explanation: "Method Overriding is dynamic polymorphism where a subclass overrides a superclass method signature to provide specialized behavior.",
    category: "OOP",
    difficulty: "Medium"
  },
  {
    id: "q5",
    question: "What does the 'typeof NaN' expression evaluate to in JavaScript?",
    options: ["'number'", "'nan'", "'undefined'", "'object'"],
    correctAnswer: 0,
    explanation: "In JavaScript, NaN stands for 'Not-a-Number', but its primitive type according to IEEE 754 standard is 'number'.",
    category: "JavaScript",
    difficulty: "Medium",
    codeSnippet: "typeof NaN;"
  },
  {
    id: "q6",
    question: "In Java, what happens when you attempt to modify a final variable?",
    options: ["It reallocates memory", "Compilation error", "Runtime NullPointerException", "It is silently ignored"],
    correctAnswer: 1,
    explanation: "Variables marked with the 'final' keyword in Java cannot be reassigned once initialized, causing a compile-time error.",
    category: "Java",
    difficulty: "Easy"
  },
  {
    id: "q7",
    question: "Which of the following sorting algorithms has the best worst-case time complexity?",
    options: ["Quicksort (O(N^2))", "Bubble Sort (O(N^2))", "Merge Sort (O(N log N))", "Selection Sort (O(N^2))"],
    correctAnswer: 2,
    explanation: "Merge Sort consistently guarantees O(N log N) time complexity in all cases (best, average, and worst) due to its divide-and-conquer strategy.",
    category: "Algorithms",
    difficulty: "Medium"
  },
  {
    id: "q8",
    question: "In C++, what is a virtual destructor used for?",
    options: ["To prevent memory leaks when deleting a derived object through a base pointer", "To allocate dynamic heap memory", "To speed up constructor calls", "To make private fields public"],
    correctAnswer: 0,
    explanation: "Declaring a base class destructor virtual ensures that the derived class destructor is called when deleting an object through a base pointer.",
    category: "C++",
    difficulty: "Hard"
  },
  {
    id: "q9",
    question: "Which data structure follows the First-In-First-Out (FIFO) principle?",
    options: ["Stack", "Queue", "Priority Queue", "Binary Search Tree"],
    correctAnswer: 1,
    explanation: "A Queue operates on the FIFO principle: the first element inserted is the first one to be removed.",
    category: "Data Structures",
    difficulty: "Easy"
  },
  {
    id: "q10",
    question: "In Python, what is the output of: [i*2 for i in range(4) if i % 2 == 0]?",
    options: ["[0, 2, 4, 6]", "[0, 4]", "[2, 6]", "[0, 2]"],
    correctAnswer: 1,
    explanation: "range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Multiplied by 2, they yield [0, 4].",
    category: "Python",
    difficulty: "Medium",
    codeSnippet: "[i*2 for i in range(4) if i % 2 == 0]"
  },
  {
    id: "q11",
    question: "What is the result of '2' + 2 - 1 in JavaScript?",
    options: ["21", "3", "'21'", "NaN"],
    correctAnswer: 0,
    explanation: "'2' + 2 results in string concatenation '22'. Then '22' - 1 triggers numeric coercion: 22 - 1 = 21.",
    category: "JavaScript",
    difficulty: "Medium",
    codeSnippet: "'2' + 2 - 1"
  },
  {
    id: "q12",
    question: "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?",
    options: ["Dijkstra's Algorithm", "Breadth-First Search", "Kruskal's Algorithm", "Floyd-Warshall (only)"],
    correctAnswer: 0,
    explanation: "Dijkstra's algorithm uses a priority queue to find the shortest path from a single source in non-negative weighted graphs in O((V + E) log V).",
    category: "Algorithms",
    difficulty: "Medium"
  },
  {
    id: "q13",
    question: "What is the size of an int pointer (int*) on a standard 64-bit operating system?",
    options: ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
    correctAnswer: 2,
    explanation: "On a 64-bit architecture, memory addresses are 64 bits wide, which equals 8 bytes, regardless of what type the pointer points to.",
    category: "C Programming",
    difficulty: "Easy"
  },
  {
    id: "q14",
    question: "Which data structure is primarily used to implement Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Min-Heap", "Linked List only"],
    correctAnswer: 1,
    explanation: "BFS explores nodes level by level in FIFO order, making a Queue the standard data structure.",
    category: "Data Structures",
    difficulty: "Easy"
  },
  {
    id: "q15",
    question: "In Java, what does the 'transient' keyword indicate for a class member?",
    options: ["It cannot be inherited", "It will not be serialized", "It cannot be accessed by threads", "It is stored in read-only memory"],
    correctAnswer: 1,
    explanation: "The transient keyword indicates that a variable should not be serialized when the object is saved to an ObjectOutputStream.",
    category: "Java",
    difficulty: "Hard"
  },
  {
    id: "q16",
    question: "What is an advantage of a Hash Table over a Binary Search Tree?",
    options: ["Elements are kept in sorted order", "Average O(1) time complexity for lookup", "Zero memory overhead", "Guaranteed worst-case O(1)"],
    correctAnswer: 1,
    explanation: "Hash tables offer average O(1) constant time insertion and retrieval using a hash function, whereas balanced BSTs offer O(log N).",
    category: "Data Structures",
    difficulty: "Medium"
  },
  {
    id: "q17",
    question: "What is a segmentation fault in C/C++ usually caused by?",
    options: ["Infinite while loop", "Accessing memory that the program does not have permission to access (e.g. null pointer or out-of-bounds)", "Syntax error in preprocessor macro", "Using too many variables"],
    correctAnswer: 1,
    explanation: "A segmentation fault (SIGSEGV) is triggered by the OS when a process attempts to access an unmapped or restricted memory page.",
    category: "C Programming",
    difficulty: "Easy"
  },
  {
    id: "q18",
    question: "What is the primary characteristic of a pure function in functional programming?",
    options: ["It executes asynchronously", "Given the same input it always returns the same output without side effects", "It must be an arrow function", "It can only accept one parameter"],
    correctAnswer: 1,
    explanation: "Pure functions are deterministic (same input -> same output) and produce no observable side effects (no global mutations, I/O, etc.).",
    category: "Programming Concepts",
    difficulty: "Easy"
  },
  {
    id: "q19",
    question: "What is the space complexity of quicksort in the worst case (with recursive call stack)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctAnswer: 2,
    explanation: "In the worst case (when the array is already sorted and bad pivots are chosen), the recursion tree degenerates into depth N, requiring O(N) call stack space.",
    category: "Algorithms",
    difficulty: "Hard"
  },
  {
    id: "q20",
    question: "In database systems, what does the 'A' in ACID stand for?",
    options: ["Association", "Atomicity", "Availability", "Authentication"],
    correctAnswer: 1,
    explanation: "Atomicity ensures that all operations within a database transaction either completely succeed or are entirely rolled back ('all-or-nothing').",
    category: "Databases",
    difficulty: "Easy"
  }
];
