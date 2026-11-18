import { World, Language } from '../types.js';

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Coding Village",
    slug: "coding-village",
    subtitle: "The Foundations of Computation",
    description: "Enter the peaceful hamlet of Byteville where aspiring coder knights awaken their mana. Master foundational syntax, variable alchemy, I/O scrolls, and arithmetic operators.",
    topics: ["Variables", "Data Types", "Input & Output", "Arithmetic & Relational Operators"],
    themeColor: "#10b981", // Emerald / Village Green
    accentColor: "#34d399",
    iconName: "Home",
    bannerImage: "village-realm",
    bossName: "Syntax Golem",
    bossTitle: "Guardian of the Primer Gate",
    bossAvatar: "golem",
    requiredLevel: 1,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w1-l1",
        worldId: 1,
        levelNumber: 1,
        title: "The Awakening Scroll",
        subtitle: "Master standard stream output and greeting spells",
        description: "Write a program that outputs the ancient coder greeting: 'Hello, CodeQuest!'.",
        storyContext: "You awaken in the village square. Elder Turing hands you an enchanted scroll that only responds to pure standard output.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Output", "Strings"],
        starterCode: {
          javascript: "// Output 'Hello, CodeQuest!'\nfunction solution() {\n  return 'Hello, CodeQuest!';\n}\nconsole.log(solution());",
          python: "# Output 'Hello, CodeQuest!'\ndef solution():\n    return 'Hello, CodeQuest!'\n\nprint(solution())",
          c: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, CodeQuest!\\n\");\n    return 0;\n}",
          cpp: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, CodeQuest!\" << std::endl;\n    return 0;\n}",
          java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, CodeQuest!\");\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "", expectedOutput: "Hello, CodeQuest!", description: "Verify standard greeting output", isHidden: false },
          { id: "tc2", input: "", expectedOutput: "Hello, CodeQuest!", description: "Verify no trailing rogue symbols", isHidden: true }
        ],
        hints: [
          "Ensure spelling matches exactly: 'Hello, CodeQuest!'",
          "Check for correct uppercase and punctuation."
        ]
      },
      {
        id: "w1-l2",
        worldId: 1,
        levelNumber: 2,
        title: "Mana Crystal Alchemy",
        subtitle: "Sum two integer energy crystals",
        description: "Given two numbers a and b separated by a space or newline, compute their sum.",
        storyContext: "The village alchemist requires two raw mana crystals to forge a defensive talisman.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Variables", "Operators"],
        starterCode: {
          javascript: "function solution(a, b) {\n  // Return the sum of a and b\n  return a + b;\n}",
          python: "def solution(a, b):\n    # Return the sum of a and b\n    return a + b",
          c: "#include <stdio.h>\n\nint solution(int a, int b) {\n    return a + b;\n}",
          cpp: "#include <iostream>\n\nint solution(int a, int b) {\n    return a + b;\n}",
          java: "public class Main {\n    public static int solution(int a, int b) {\n        return a + b;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "5 7", expectedOutput: "12", description: "Positive integers", isHidden: false },
          { id: "tc2", input: "-3 8", expectedOutput: "5", description: "Negative and positive", isHidden: false },
          { id: "tc3", input: "100 250", expectedOutput: "350", description: "Large values", isHidden: true }
        ],
        hints: [
          "Use the addition operator `+` on the two incoming parameters."
        ]
      },
      {
        id: "w1-l3",
        worldId: 1,
        levelNumber: 3,
        title: "The Alchemist's Ratio",
        subtitle: "Type casting and floating point precision",
        description: "Given the base and height of a triangular mana seal, compute its area (0.5 * base * height) rounded to two decimal places.",
        storyContext: "The town gate is sealed by a triangular glyph. Calculate its precise surface area to disarm it.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Floats", "Math"],
        starterCode: {
          javascript: "function solution(base, height) {\n  // Return area rounded to 2 decimals\n  return Number((0.5 * base * height).toFixed(2));\n}",
          python: "def solution(base, height):\n    return round(0.5 * base * height, 2)",
          c: "#include <stdio.h>\n\nfloat solution(float base, float height) {\n    return 0.5f * base * height;\n}",
          cpp: "#include <iostream>\n\nfloat solution(float base, float height) {\n    return 0.5f * base * height;\n}",
          java: "public class Main {\n    public static double solution(double base, double height) {\n        return 0.5 * base * height;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "10 5", expectedOutput: "25", description: "Whole area", isHidden: false },
          { id: "tc2", input: "7 3", expectedOutput: "10.5", description: "Decimal area", isHidden: false },
          { id: "tc3", input: "12.4 6.2", expectedOutput: "38.44", description: "Float precision check", isHidden: true }
        ],
        hints: [
          "Area of triangle formula is (1/2) * base * height.",
          "Be careful with integer division in languages like C/C++/Java (use 0.5 instead of 1/2)."
        ]
      },
      {
        id: "w1-l4",
        worldId: 1,
        levelNumber: 4,
        title: "The Bitwise Obelisk",
        subtitle: "Unveil parity using bitwise operators",
        description: "Given an integer n, return 'EVEN' if n is even, or 'ODD' if n is odd, using bitwise operations.",
        storyContext: "An ancient obelisk hums with binary frequency. It reads only the lowest bit of your mana pulse.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Bitwise", "Parity"],
        starterCode: {
          javascript: "function solution(n) {\n  // Use bitwise AND (& 1) to determine parity\n  return (n & 1) === 0 ? 'EVEN' : 'ODD';\n}",
          python: "def solution(n):\n    return 'EVEN' if (n & 1) == 0 else 'ODD'",
          c: "#include <stdio.h>\n\nconst char* solution(int n) {\n    return (n & 1) == 0 ? \"EVEN\" : \"ODD\";\n}",
          cpp: "#include <iostream>\n#include <string>\n\nstd::string solution(int n) {\n    return (n & 1) == 0 ? \"EVEN\" : \"ODD\";\n}",
          java: "public class Main {\n    public static String solution(int n) {\n        return (n & 1) == 0 ? \"EVEN\" : \"ODD\";\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "4", expectedOutput: "EVEN", description: "Even integer", isHidden: false },
          { id: "tc2", input: "7", expectedOutput: "ODD", description: "Odd integer", isHidden: false },
          { id: "tc3", input: "0", expectedOutput: "EVEN", description: "Zero check", isHidden: true },
          { id: "tc4", input: "-9", expectedOutput: "ODD", description: "Negative odd check", isHidden: true }
        ],
        hints: [
          "Remember that in binary, the least significant bit (LSB) is 0 for even numbers and 1 for odd numbers.",
          "`n & 1` extracts the last bit!"
        ]
      },
      {
        id: "w1-l5",
        worldId: 1,
        levelNumber: 5,
        title: "Boss: The Syntax Golem",
        subtitle: "Trial of the Primer Gatekeeper",
        description: "The Syntax Golem challenges you to format and analyze a batch of student sensor readings. Given an array of integers, return the difference between the maximum and minimum values (the range).",
        storyContext: "The colossal stone golem awakens with runic eyes. 'Only those who comprehend data bounds shall pass beyond the Village into the Dungeons!'",
        difficulty: "Boss",
        xpReward: 200,
        coinReward: 100,
        isBoss: true,
        topics: ["Arrays", "Variables", "Math"],
        starterCode: {
          javascript: "function solution(arr) {\n  // Return max(arr) - min(arr)\n  return Math.max(...arr) - Math.min(...arr);\n}",
          python: "def solution(arr):\n    return max(arr) - min(arr)",
          c: "#include <stdio.h>\n#include <limits.h>\n\nint solution(int* arr, int n) {\n    int min = arr[0], max = arr[0];\n    for(int i = 1; i < n; i++) {\n        if(arr[i] < min) min = arr[i];\n        if(arr[i] > max) max = arr[i];\n    }\n    return max - min;\n}",
          cpp: "#include <vector>\n#include <algorithm>\n\nint solution(std::vector<int> arr) {\n    auto [minIt, maxIt] = std::minmax_element(arr.begin(), arr.end());\n    return *maxIt - *minIt;\n}",
          java: "import java.util.Arrays;\npublic class Main {\n    public static int solution(int[] arr) {\n        int min = arr[0], max = arr[0];\n        for (int x : arr) {\n            if (x < min) min = x;\n            if (x > max) max = x;\n        }\n        return max - min;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[10, 2, 8, 15, 6]", expectedOutput: "13", description: "Standard range (15 - 2)", isHidden: false },
          { id: "tc2", input: "[5, 5, 5]", expectedOutput: "0", description: "Identical elements", isHidden: false },
          { id: "tc3", input: "[-10, 50, -2, 100]", expectedOutput: "110", description: "Negative & positive mix", isHidden: true }
        ],
        hints: [
          "Identify the largest element and the smallest element in the list.",
          "Subtract the minimum from the maximum."
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Logic Dungeon",
    slug: "logic-dungeon",
    subtitle: "Conditionals, Loops & Control Flow",
    description: "Delve into subterranean crypts where paths open only for flawless boolean assertions and looping machinery. Beware the Infinite Loop Beast lurking in the lower chambers.",
    topics: ["If-Else", "Switch-Case", "While & For Loops", "Break & Continue", "Nested Conditions"],
    themeColor: "#8b5cf6", // Purple / Dungeon Arcane
    accentColor: "#a78bfa",
    iconName: "ShieldAlert",
    bannerImage: "dungeon-realm",
    bossName: "Infinite Loop Beast",
    bossTitle: "Terror of the Halting Problem",
    bossAvatar: "beast",
    requiredLevel: 2,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w2-l1",
        worldId: 2,
        levelNumber: 1,
        title: "The Leap Year Seal",
        subtitle: "Multi-layered conditional testing",
        description: "Given a year integer, return true if it is a leap year, and false otherwise. A leap year is divisible by 4, except end-of-century years which must be divisible by 400.",
        storyContext: "A locked crypt door counts time in centuries. Submit the leap calendar formula to unlock the chamber.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["If-Else", "Modulo"],
        starterCode: {
          javascript: "function solution(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);\n}",
          python: "def solution(year):\n    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)",
          c: "#include <stdbool.h>\n\nbool solution(int year) {\n    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n}",
          cpp: "bool solution(int year) {\n    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n}",
          java: "public class Main {\n    public static boolean solution(int year) {\n        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "2024", expectedOutput: "true", description: "Standard leap year", isHidden: false },
          { id: "tc2", input: "1900", expectedOutput: "false", description: "Century year not div by 400", isHidden: false },
          { id: "tc3", input: "2000", expectedOutput: "true", description: "Century year div by 400", isHidden: true }
        ],
        hints: [
          "Remember the rule: divisible by 4 AND (not divisible by 100 OR divisible by 400)."
        ]
      },
      {
        id: "w2-l2",
        worldId: 2,
        levelNumber: 2,
        title: "The Factorial Elevator",
        subtitle: "Loop accumulation under pressure",
        description: "Calculate n factorial (n!) for an integer n (where 0 <= n <= 12). Recall 0! = 1.",
        storyContext: "The elevator platform rises only when provided the product of consecutive dungeon gears.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Loops", "Accumulators"],
        starterCode: {
          javascript: "function solution(n) {\n  let res = 1;\n  for(let i = 2; i <= n; i++) res *= i;\n  return res;\n}",
          python: "def solution(n):\n    res = 1\n    for i in range(2, n + 1):\n        res *= i\n    return res",
          c: "int solution(int n) {\n    int res = 1;\n    for(int i = 2; i <= n; i++) res *= i;\n    return res;\n}",
          cpp: "int solution(int n) {\n    int res = 1;\n    for(int i = 2; i <= n; i++) res *= i;\n    return res;\n}",
          java: "public class Main {\n    public static int solution(int n) {\n        int res = 1;\n        for(int i = 2; i <= n; i++) res *= i;\n        return res;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "5", expectedOutput: "120", description: "5! = 120", isHidden: false },
          { id: "tc2", input: "0", expectedOutput: "1", description: "0! = 1 base condition", isHidden: false },
          { id: "tc3", input: "7", expectedOutput: "5040", description: "7! = 5040", isHidden: true }
        ],
        hints: [
          "Initialize an accumulator variable to 1.",
          "Multiply from 2 up to n."
        ]
      },
      {
        id: "w2-l3",
        worldId: 2,
        levelNumber: 3,
        title: "The Prime Crypt",
        subtitle: "Efficient prime verification loop",
        description: "Given an integer n, determine if it is a prime number (true or false).",
        storyContext: "Undead sentries check prime frequencies. Composite numbers trigger poison darts.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Math", "Loops"],
        starterCode: {
          javascript: "function solution(n) {\n  if (n <= 1) return false;\n  for(let i = 2; i * i <= n; i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}",
          python: "def solution(n):\n    if n <= 1:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True",
          c: "#include <stdbool.h>\n\nbool solution(int n) {\n    if (n <= 1) return false;\n    for(int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}",
          cpp: "bool solution(int n) {\n    if (n <= 1) return false;\n    for(int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}",
          java: "public class Main {\n    public static boolean solution(int n) {\n        if (n <= 1) return false;\n        for(int i = 2; i * i <= n; i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "17", expectedOutput: "true", description: "17 is prime", isHidden: false },
          { id: "tc2", input: "1", expectedOutput: "false", description: "1 is not prime", isHidden: false },
          { id: "tc3", input: "49", expectedOutput: "false", description: "49 is composite (7x7)", isHidden: true }
        ],
        hints: [
          "Check up to sqrt(n) for efficiency instead of n."
        ]
      },
      {
        id: "w2-l4",
        worldId: 2,
        levelNumber: 4,
        title: "The Fibonacci Steps",
        subtitle: "Dynamic sequence iteration",
        description: "Compute the n-th Fibonacci number where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2).",
        storyContext: "Each stone step in the chasm requires the next Fibonacci code to remain solid.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Loops", "Sequences"],
        starterCode: {
          javascript: "function solution(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  let a = 0, b = 1;\n  for(let i = 2; i <= n; i++) {\n    let c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}",
          python: "def solution(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b",
          c: "int solution(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for(int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}",
          cpp: "int solution(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for(int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}",
          java: "public class Main {\n    public static int solution(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        int a = 0, b = 1;\n        for(int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "6", expectedOutput: "8", description: "F(6) = 8", isHidden: false },
          { id: "tc2", input: "10", expectedOutput: "55", description: "F(10) = 55", isHidden: false },
          { id: "tc3", input: "0", expectedOutput: "0", description: "F(0) base case", isHidden: true }
        ],
        hints: [
          "Use iterative variables a and b to achieve O(1) space and O(N) time."
        ]
      },
      {
        id: "w2-l5",
        worldId: 2,
        levelNumber: 5,
        title: "Boss: Infinite Loop Beast",
        subtitle: "Escape the Halting Abyss",
        description: "The Infinite Loop Beast entraps you in a Collatz maze! Given a starting integer n, return the number of steps required to reach 1: if n is even divide by 2; if odd multiply by 3 and add 1.",
        storyContext: "The monstrous Beast roars as loops swirl into eternity around you. Provide the exact steps to collapse its infinite loop vortex!",
        difficulty: "Boss",
        xpReward: 200,
        coinReward: 100,
        isBoss: true,
        topics: ["While Loops", "Conditionals"],
        starterCode: {
          javascript: "function solution(n) {\n  let steps = 0;\n  while(n > 1) {\n    if (n % 2 === 0) n = n / 2;\n    else n = 3 * n + 1;\n    steps++;\n  }\n  return steps;\n}",
          python: "def solution(n):\n    steps = 0\n    while n > 1:\n        if n % 2 == 0:\n            n = n // 2\n        else:\n            n = 3 * n + 1\n        steps += 1\n    return steps",
          c: "int solution(int n) {\n    int steps = 0;\n    while(n > 1) {\n        if (n % 2 == 0) n = n / 2;\n        else n = 3 * n + 1;\n        steps++;\n    }\n    return steps;\n}",
          cpp: "int solution(int n) {\n    int steps = 0;\n    while(n > 1) {\n        if (n % 2 == 0) n = n / 2;\n        else n = 3 * n + 1;\n        steps++;\n    }\n    return steps;\n}",
          java: "public class Main {\n    public static int solution(int n) {\n        int steps = 0;\n        while(n > 1) {\n            if (n % 2 == 0) n = n / 2;\n            else n = 3 * n + 1;\n            steps++;\n        }\n        return steps;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "6", expectedOutput: "8", description: "6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1 (8 steps)", isHidden: false },
          { id: "tc2", input: "1", expectedOutput: "0", description: "Already at 1 (0 steps)", isHidden: false },
          { id: "tc3", input: "12", expectedOutput: "9", description: "Collatz sequence for 12", isHidden: true }
        ],
        hints: [
          "Loop while n > 1.",
          "Check even/odd using `n % 2 == 0`."
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Function Forest",
    slug: "function-forest",
    subtitle: "Modular Architecture & Recursion",
    description: "Wander through the enchanted woods of ancient modular spells. Discover functional purity, call stacks, array trellises, and survive the recursive Stack Overflow Hydra.",
    topics: ["Functions", "Recursion", "Arrays", "String Manipulation", "Call Stack"],
    themeColor: "#06b6d4", // Cyan / Forest Ether
    accentColor: "#22d3ee",
    iconName: "Trees",
    bannerImage: "forest-realm",
    bossName: "Stack Overflow Hydra",
    bossTitle: "Terror of the Unbounded Call Stack",
    bossAvatar: "hydra",
    requiredLevel: 3,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w3-l1",
        worldId: 3,
        levelNumber: 1,
        title: "The Palindrome Grove",
        subtitle: "String reversal and symmetry",
        description: "Given a string s, return true if it is a palindrome (reads the same backward and forward), ignoring case and non-alphanumeric characters.",
        storyContext: "Ancient elven trees whisper mirror spells. Only mirrored words resonate with the forest gates.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Strings", "Two Pointers"],
        starterCode: {
          javascript: "function solution(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}",
          python: "def solution(s):\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]",
          c: "#include <stdbool.h>\n#include <ctype.h>\n#include <string.h>\n\nbool solution(const char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while(l < r) {\n        while(l < r && !isalnum(s[l])) l++;\n        while(l < r && !isalnum(s[r])) r--;\n        if(tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}",
          cpp: "#include <string>\n#include <cctype>\n\nbool solution(std::string s) {\n    int l = 0, r = s.length() - 1;\n    while(l < r) {\n        while(l < r && !isalnum(s[l])) l++;\n        while(l < r && !isalnum(s[r])) r--;\n        if(tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}",
          java: "public class Main {\n    public static boolean solution(String s) {\n        String clean = s.replaceAll(\"[^a-zA-Z0-9]\", \"\").toLowerCase();\n        return clean.equals(new StringBuilder(clean).reverse().toString());\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "\"racecar\"", expectedOutput: "true", description: "Simple palindrome", isHidden: false },
          { id: "tc2", input: "\"hello\"", expectedOutput: "false", description: "Not a palindrome", isHidden: false },
          { id: "tc3", input: "\"A man, a plan, a canal: Panama\"", expectedOutput: "true", description: "Punctuation & case palindrome", isHidden: true }
        ],
        hints: [
          "Filter out non-alphanumeric characters and normalize case first."
        ]
      },
      {
        id: "w3-l2",
        worldId: 3,
        levelNumber: 2,
        title: "The Sum of Array Runes",
        subtitle: "Array mapping and reduction",
        description: "Given an array of integers, return the running sum of the array where output[i] = sum(arr[0]...arr[i]).",
        storyContext: "Rune stones gather elemental energy consecutively. Each stone stores the aggregate power of all previous stones.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Arrays", "Prefix Sum"],
        starterCode: {
          javascript: "function solution(nums) {\n  let sum = 0;\n  return nums.map(x => sum += x);\n}",
          python: "def solution(nums):\n    res = []\n    s = 0\n    for x in nums:\n        s += x\n        res.append(s)\n    return res",
          c: "// Return array of prefix sums",
          cpp: "#include <vector>\n\nstd::vector<int> solution(std::vector<int> nums) {\n    for(size_t i = 1; i < nums.size(); i++) nums[i] += nums[i-1];\n    return nums;\n}",
          java: "public class Main {\n    public static int[] solution(int[] nums) {\n        for(int i = 1; i < nums.length; i++) nums[i] += nums[i-1];\n        return nums;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[1, 2, 3, 4]", expectedOutput: "[1,3,6,10]", description: "Running sum", isHidden: false },
          { id: "tc2", input: "[1, 1, 1, 1, 1]", expectedOutput: "[1,2,3,4,5]", description: "All ones", isHidden: false },
          { id: "tc3", input: "[3, -1, 2, -1]", expectedOutput: "[3,2,4,3]", description: "Positive & negative mix", isHidden: true }
        ],
        hints: [
          "Keep an accumulator or modify the array in place: `arr[i] += arr[i - 1]`."
        ]
      },
      {
        id: "w3-l3",
        worldId: 3,
        levelNumber: 3,
        title: "Echoes of the Recursive Caves",
        subtitle: "Sum of digits using recursive invocation",
        description: "Given a non-negative integer n, recursively sum all its digits until a single digit remains (digital root).",
        storyContext: "The deeper cave echoes your shout, compressing numbers down to their single elemental frequency.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Recursion", "Digital Root"],
        starterCode: {
          javascript: "function solution(n) {\n  if (n < 10) return n;\n  let sum = 0;\n  while(n > 0) {\n    sum += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return solution(sum);\n}",
          python: "def solution(n):\n    if n < 10:\n        return n\n    return solution(sum(int(d) for d in str(n)))",
          c: "int solution(int n) {\n    if (n < 10) return n;\n    int sum = 0;\n    while(n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return solution(sum);\n}",
          cpp: "int solution(int n) {\n    if (n < 10) return n;\n    int sum = 0;\n    while(n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return solution(sum);\n}",
          java: "public class Main {\n    public static int solution(int n) {\n        if (n < 10) return n;\n        int sum = 0;\n        while(n > 0) {\n            sum += n % 10;\n            n /= 10;\n        }\n        return solution(sum);\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "38", expectedOutput: "2", description: "3 + 8 = 11 -> 1 + 1 = 2", isHidden: false },
          { id: "tc2", input: "0", expectedOutput: "0", description: "Single digit base case", isHidden: false },
          { id: "tc3", input: "9999", expectedOutput: "9", description: "Multiple reductions", isHidden: true }
        ],
        hints: [
          "Base case: if n < 10, return n.",
          "Otherwise, sum digits and call recursively."
        ]
      },
      {
        id: "w3-l4",
        worldId: 3,
        levelNumber: 4,
        title: "The Anagram Weaver",
        subtitle: "String frequency counting",
        description: "Given two strings s and t, return true if t is an anagram of s (same characters in any order), and false otherwise.",
        storyContext: "The forest weaver binds cloaks with identical thread threads rearranged. Determine if two threads share identical composition.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Strings", "Hash Map"],
        starterCode: {
          javascript: "function solution(s, t) {\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}",
          python: "def solution(s, t):\n    return sorted(s) == sorted(t)",
          c: "// Return true if anagram",
          cpp: "#include <string>\n#include <algorithm>\n\nbool solution(std::string s, std::string t) {\n    std::sort(s.begin(), s.end());\n    std::sort(t.begin(), t.end());\n    return s == t;\n}",
          java: "import java.util.Arrays;\npublic class Main {\n    public static boolean solution(String s, String t) {\n        char[] a = s.toCharArray(), b = t.toCharArray();\n        Arrays.sort(a); Arrays.sort(b);\n        return Arrays.equals(a, b);\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "\"anagram\" \"nagaram\"", expectedOutput: "true", description: "Valid anagram", isHidden: false },
          { id: "tc2", input: "\"rat\" \"car\"", expectedOutput: "false", description: "Different letters", isHidden: false },
          { id: "tc3", input: "\"listen\" \"silent\"", expectedOutput: "true", description: "Valid anagram 2", isHidden: true }
        ],
        hints: [
          "Sorting both strings or counting character occurrences will reveal if they match."
        ]
      },
      {
        id: "w3-l5",
        worldId: 3,
        levelNumber: 5,
        title: "Boss: Stack Overflow Hydra",
        subtitle: "The Tower of Hanoi Trial",
        description: "The Stack Overflow Hydra strikes whenever recursive calls multiply out of control! Return the minimum number of moves required to solve the Tower of Hanoi puzzle with n disks: 2^n - 1.",
        storyContext: "Multiple serpentine heads hiss recursive chants. Compute the absolute optimal disk transitions to banish the beast before memory exhaustion!",
        difficulty: "Boss",
        xpReward: 200,
        coinReward: 100,
        isBoss: true,
        topics: ["Recursion", "Exponents"],
        starterCode: {
          javascript: "function solution(n) {\n  // Minimum moves for n disks: 2^n - 1\n  return Math.pow(2, n) - 1;\n}",
          python: "def solution(n):\n    return (2 ** n) - 1",
          c: "#include <math.h>\n\nlong long solution(int n) {\n    return (1ULL << n) - 1;\n}",
          cpp: "long long solution(int n) {\n    return (1ULL << n) - 1;\n}",
          java: "public class Main {\n    public static long solution(int n) {\n        return (1L << n) - 1;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "3", expectedOutput: "7", description: "3 disks = 7 moves", isHidden: false },
          { id: "tc2", input: "1", expectedOutput: "1", description: "1 disk = 1 move", isHidden: false },
          { id: "tc3", input: "5", expectedOutput: "31", description: "5 disks = 31 moves", isHidden: true }
        ],
        hints: [
          "T(n) = 2 * T(n-1) + 1. Closed form: 2^n - 1."
        ]
      }
    ]
  },
  {
    id: 4,
    name: "OOP City",
    slug: "oop-city",
    subtitle: "Classes, Objects & Polymorphism",
    description: "Enter a high-tech metropolis built on structured blueprints. Master encapsulation firewalls, inheritance hierarchies, and polymorphic interfaces to overthrow the Monolithic Overlord.",
    topics: ["Classes & Objects", "Constructors", "Encapsulation", "Inheritance", "Polymorphism"],
    themeColor: "#3b82f6", // Electric Blue / Cyber Metro
    accentColor: "#60a5fa",
    iconName: "Building2",
    bannerImage: "city-realm",
    bossName: "Monolithic Overlord",
    bossTitle: "Master of Spaghetti Architecture",
    bossAvatar: "overlord",
    requiredLevel: 4,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w4-l1",
        worldId: 4,
        levelNumber: 1,
        title: "The Cyber Blueprint",
        subtitle: "Class instantiation and state tracking",
        description: "Design a BankAccount model. Given an initial balance and an array of transactions (+ for deposit, - for withdrawal, reject if insufficient balance), return the final balance.",
        storyContext: "The City's financial core runs on object accounts. Rebuild the secure transaction parser.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Classes", "State"],
        starterCode: {
          javascript: "function solution(initialBalance, transactions) {\n  let balance = initialBalance;\n  for(let tx of transactions) {\n    if (balance + tx >= 0) {\n      balance += tx;\n    }\n  }\n  return balance;\n}",
          python: "def solution(initialBalance, transactions):\n    balance = initialBalance\n    for tx in transactions:\n        if balance + tx >= 0:\n            balance += tx\n    return balance",
          c: "// Bank account transaction simulator",
          cpp: "#include <vector>\n\nint solution(int initialBalance, std::vector<int> transactions) {\n    int balance = initialBalance;\n    for(int tx : transactions) {\n        if(balance + tx >= 0) balance += tx;\n    }\n    return balance;\n}",
          java: "public class Main {\n    public static int solution(int initialBalance, int[] transactions) {\n        int balance = initialBalance;\n        for (int tx : transactions) {\n            if (balance + tx >= 0) balance += tx;\n        }\n        return balance;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "100 [50, -30, -200, 20]", expectedOutput: "140", description: "-200 is rejected due to insufficient funds", isHidden: false },
          { id: "tc2", input: "0 [100, -50]", expectedOutput: "50", description: "Deposit then withdraw", isHidden: false },
          { id: "tc3", input: "500 [-600, 100, -50]", expectedOutput: "550", description: "Multiple transactions", isHidden: true }
        ],
        hints: [
          "Before applying a negative transaction, check if `balance + tx >= 0`."
        ]
      },
      {
        id: "w4-l2",
        worldId: 4,
        levelNumber: 2,
        title: "Drone Inheritance Matrix",
        subtitle: "Subclassing and specialized behaviors",
        description: "Given a list of drones with their base battery and boost multipliers, compute the maximum distance travelable: baseBattery * boost.",
        storyContext: "City surveillance drones inherit from BaseDrone, but Scout and Heavy models override thruster velocity.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Inheritance", "Polymorphism"],
        starterCode: {
          javascript: "function solution(battery, boost) {\n  return battery * boost;\n}",
          python: "def solution(battery, boost):\n    return battery * boost",
          c: "int solution(int battery, int boost) { return battery * boost; }",
          cpp: "int solution(int battery, int boost) { return battery * boost; }",
          java: "public class Main { public static int solution(int battery, int boost) { return battery * boost; } }"
        },
        testCases: [
          { id: "tc1", input: "50 3", expectedOutput: "150", description: "Scout drone speed", isHidden: false },
          { id: "tc2", input: "100 1", expectedOutput: "100", description: "Base drone speed", isHidden: false },
          { id: "tc3", input: "85 4", expectedOutput: "340", description: "Turbo drone", isHidden: true }
        ],
        hints: [
          "Calculate battery multiplied by boost factor."
        ]
      },
      {
        id: "w4-l3",
        worldId: 4,
        levelNumber: 3,
        title: "Shape Interface Morphism",
        subtitle: "Polymorphic area calculations",
        description: "Given a shape type ('RECTANGLE', 'CIRCLE', 'SQUARE') and dimensions, return the area rounded to an integer. (For circle, use PI = 3.14159).",
        storyContext: "Holographic billboards adjust their shape dynamically to fit ads.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Polymorphism", "Abstraction"],
        starterCode: {
          javascript: "function solution(type, dim1, dim2 = 0) {\n  if (type === 'RECTANGLE') return Math.round(dim1 * dim2);\n  if (type === 'SQUARE') return Math.round(dim1 * dim1);\n  if (type === 'CIRCLE') return Math.round(Math.PI * dim1 * dim1);\n  return 0;\n}",
          python: "import math\ndef solution(type, dim1, dim2=0):\n    if type == 'RECTANGLE': return round(dim1 * dim2)\n    if type == 'SQUARE': return round(dim1 * dim1)\n    if type == 'CIRCLE': return round(math.pi * dim1 * dim1)\n    return 0",
          c: "// Shape polymorphism simulator",
          cpp: "#include <string>\n#include <cmath>\nint solution(std::string type, double dim1, double dim2 = 0) {\n    if (type == \"RECTANGLE\") return std::round(dim1 * dim2);\n    if (type == \"SQUARE\") return std::round(dim1 * dim1);\n    if (type == \"CIRCLE\") return std::round(M_PI * dim1 * dim1);\n    return 0;\n}",
          java: "public class Main {\n    public static int solution(String type, double dim1, double dim2) {\n        if (type.equals(\"RECTANGLE\")) return (int)Math.round(dim1 * dim2);\n        if (type.equals(\"SQUARE\")) return (int)Math.round(dim1 * dim1);\n        if (type.equals(\"CIRCLE\")) return (int)Math.round(Math.PI * dim1 * dim1);\n        return 0;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "\"RECTANGLE\" 4 6", expectedOutput: "24", description: "Rectangle 4x6", isHidden: false },
          { id: "tc2", input: "\"CIRCLE\" 5 0", expectedOutput: "79", description: "Circle radius 5", isHidden: false },
          { id: "tc3", input: "\"SQUARE\" 7 0", expectedOutput: "49", description: "Square 7x7", isHidden: true }
        ],
        hints: [
          "Check the shape type and apply the appropriate mathematical formula."
        ]
      },
      {
        id: "w4-l4",
        worldId: 4,
        levelNumber: 4,
        title: "Encapsulation Firewall",
        subtitle: "Password strength validator object",
        description: "Validate if a proposed security key satisfies: at least 8 chars, contains at least one uppercase, one lowercase, and one digit. Return true or false.",
        storyContext: "The City Bank's vault refuses any password that lacks strong character variety.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Validation", "Regex"],
        starterCode: {
          javascript: "function solution(pwd) {\n  if (pwd.length < 8) return false;\n  const hasUpper = /[A-Z]/.test(pwd);\n  const hasLower = /[a-z]/.test(pwd);\n  const hasDigit = /[0-9]/.test(pwd);\n  return hasUpper && hasLower && hasDigit;\n}",
          python: "def solution(pwd):\n    if len(pwd) < 8: return False\n    has_up = any(c.isupper() for c in pwd)\n    has_low = any(c.islower() for c in pwd)\n    has_num = any(c.isdigit() for c in pwd)\n    return has_up and has_low and has_num",
          c: "// Password validator",
          cpp: "#include <string>\n#include <cctype>\nbool solution(std::string pwd) {\n    if (pwd.length() < 8) return false;\n    bool u = false, l = false, d = false;\n    for(char c : pwd) {\n        if (isupper(c)) u = true;\n        if (islower(c)) l = true;\n        if (isdigit(c)) d = true;\n    }\n    return u && l && d;\n}",
          java: "public class Main {\n    public static boolean solution(String pwd) {\n        if (pwd.length() < 8) return false;\n        return pwd.matches(\".*[A-Z].*\") && pwd.matches(\".*[a-z].*\") && pwd.matches(\".*[0-9].*\");\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "\"CodeQuest2026\"", expectedOutput: "true", description: "Strong password", isHidden: false },
          { id: "tc2", input: "\"weak\"", expectedOutput: "false", description: "Too short (<8)", isHidden: false },
          { id: "tc3", input: "\"nocapitals123\"", expectedOutput: "false", description: "Missing uppercase", isHidden: true }
        ],
        hints: [
          "Check length >= 8 and test for [A-Z], [a-z], and [0-9]."
        ]
      },
      {
        id: "w4-l5",
        worldId: 4,
        levelNumber: 5,
        title: "Boss: Monolithic Overlord",
        subtitle: "Refactoring the Spaghetti Citadel",
        description: "The Monolithic Overlord hurls tightly coupled dependency chains at you! Given a list of dependency pairs [A, B] where A depends on B, return true if there is NO circular dependency (valid architecture), or false if a cycle is detected.",
        storyContext: "The Overlord's tower is a chaotic mess of circular references. Analyze the module graph and purge the cycles!",
        difficulty: "Boss",
        xpReward: 200,
        coinReward: 100,
        isBoss: true,
        topics: ["Architecture", "Graphs", "Cycle Detection"],
        starterCode: {
          javascript: "function solution(n, edges) {\n  // Detect if DAG (topological sortable / no cycle)\n  const adj = Array.from({length: n}, () => []);\n  const inDegree = new Array(n).fill(0);\n  for(let [u, v] of edges) {\n    adj[u].push(v);\n    inDegree[v]++;\n  }\n  const queue = [];\n  for(let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);\n  let count = 0;\n  while(queue.length) {\n    const node = queue.shift();\n    count++;\n    for(let neighbor of adj[node]) {\n      inDegree[neighbor]--;\n      if(inDegree[neighbor] === 0) queue.push(neighbor);\n    }\n  }\n  return count === n;\n}",
          python: "from collections import deque\ndef solution(n, edges):\n    adj = [[] for _ in range(n)]\n    in_deg = [0] * n\n    for u, v in edges:\n        adj[u].append(v)\n        in_deg[v] += 1\n    q = deque([i for i in range(n) if in_deg[i] == 0])\n    visited = 0\n    while q:\n        node = q.popleft()\n        visited += 1\n        for nxt in adj[node]:\n            in_deg[nxt] -= 1\n            if in_deg[nxt] == 0:\n                q.append(nxt)\n    return visited == n",
          c: "// Cycle detection in DAG",
          cpp: "#include <vector>\n#include <queue>\nbool solution(int n, std::vector<std::pair<int, int>> edges) {\n    std::vector<std::vector<int>> adj(n);\n    std::vector<int> in_deg(n, 0);\n    for(auto& e : edges) {\n        adj[e.first].push_back(e.second);\n        in_deg[e.second]++;\n    }\n    std::queue<int> q;\n    for(int i = 0; i < n; i++) if(in_deg[i] == 0) q.push(i);\n    int count = 0;\n    while(!q.empty()) {\n        int u = q.front(); q.pop(); count++;\n        for(int v : adj[u]) {\n            if(--in_deg[v] == 0) q.push(v);\n        }\n    }\n    return count == n;\n}",
          java: "import java.util.*;\npublic class Main {\n    public static boolean solution(int n, int[][] edges) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for(int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        int[] inDeg = new int[n];\n        for(int[] e : edges) {\n            adj.get(e[0]).add(e[1]);\n            inDeg[e[1]]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for(int i = 0; i < n; i++) if(inDeg[i] == 0) q.add(i);\n        int count = 0;\n        while(!q.isEmpty()) {\n            int curr = q.poll(); count++;\n            for(int next : adj.get(curr)) {\n                if(--inDeg[next] == 0) q.add(next);\n            }\n        }\n        return count == n;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "3 [[0, 1], [1, 2]]", expectedOutput: "true", description: "Linear dependency chain without cycle", isHidden: false },
          { id: "tc2", input: "2 [[0, 1], [1, 0]]", expectedOutput: "false", description: "Direct circular cycle (0 -> 1 -> 0)", isHidden: false },
          { id: "tc3", input: "4 [[0, 1], [2, 3]]", expectedOutput: "true", description: "Disjoint valid chains", isHidden: true }
        ],
        hints: [
          "Use Kahn's algorithm (Topological sort via In-degrees). If all nodes are visited, no cycle exists!"
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Data Structure Realm",
    slug: "data-structure-realm",
    subtitle: "Stacks, Queues, Trees & Graphs",
    description: "Venture across floating islands woven from nodes, pointers, and memory blocks. Master balanced trees, priority queues, and defeat the Binary Necromancer.",
    topics: ["Arrays", "Stacks", "Queues", "Linked Lists", "Binary Search Trees", "Graphs"],
    themeColor: "#f59e0b", // Amber / Realm Crystal
    accentColor: "#fbbf24",
    iconName: "Network",
    bannerImage: "realm-realm",
    bossName: "Binary Necromancer",
    bossTitle: "Ruler of Deserialized Souls",
    bossAvatar: "necromancer",
    requiredLevel: 5,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w5-l1",
        worldId: 5,
        levelNumber: 1,
        title: "The LIFO Vault",
        subtitle: "Valid parentheses validation using a stack",
        description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string has valid brackets.",
        storyContext: "The Vault of Pointers unlocks only when each opened bracket is closed in precise reverse order.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Stack"],
        starterCode: {
          javascript: "function solution(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let c of s) {\n    if (map[c]) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}",
          python: "def solution(s):\n    stack = []\n    mp = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in mp:\n            if not stack or stack.pop() != mp[c]:\n                return False\n        else:\n            stack.append(c)\n    return len(stack) == 0",
          c: "// Valid bracket checker",
          cpp: "#include <string>\n#include <stack>\nbool solution(std::string s) {\n    std::stack<char> st;\n    for(char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == '}' && top != '{') return false;\n            if (c == ']' && top != '[') return false;\n        }\n    }\n    return st.empty();\n}",
          java: "import java.util.Stack;\npublic class Main {\n    public static boolean solution(String s) {\n        Stack<Character> stack = new Stack<>();\n        for(char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "\"()[]{}\"", expectedOutput: "true", description: "Balanced mixed brackets", isHidden: false },
          { id: "tc2", input: "\"(]\"", expectedOutput: "false", description: "Mismatched bracket", isHidden: false },
          { id: "tc3", input: "\"{[]}\"", expectedOutput: "true", description: "Nested brackets", isHidden: true }
        ],
        hints: [
          "Push opening brackets to a stack, and pop to check match upon encountering a closing bracket."
        ]
      },
      {
        id: "w5-l2",
        worldId: 5,
        levelNumber: 2,
        title: "The Circular Buffer",
        subtitle: "Queue management and window tracking",
        description: "Given an array of integer ping timestamps and a window size k, calculate the maximum value within each sliding window of size k.",
        storyContext: "Network nodes in the realm suffer packet congestion. Monitor the peak packet burst in sliding time windows.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Queue", "Sliding Window"],
        starterCode: {
          javascript: "function solution(nums, k) {\n  const res = [];\n  for(let i = 0; i <= nums.length - k; i++) {\n    res.push(Math.max(...nums.slice(i, i + k)));\n  }\n  return res;\n}",
          python: "def solution(nums, k):\n    return [max(nums[i:i+k]) for i in range(len(nums) - k + 1)]",
          c: "// Sliding window maximum",
          cpp: "#include <vector>\n#include <algorithm>\nstd::vector<int> solution(std::vector<int> nums, int k) {\n    std::vector<int> res;\n    for(size_t i = 0; i + k <= nums.size(); i++) {\n        int m = *std::max_element(nums.begin() + i, nums.begin() + i + k);\n        res.push_back(m);\n    }\n    return res;\n}",
          java: "import java.util.*;\npublic class Main {\n    public static int[] solution(int[] nums, int k) {\n        int[] res = new int[nums.length - k + 1];\n        for(int i = 0; i <= nums.length - k; i++) {\n            int max = nums[i];\n            for(int j = 1; j < k; j++) max = Math.max(max, nums[i+j]);\n            res[i] = max;\n        }\n        return res;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[1, 3, -1, -3, 5, 3, 6, 7] 3", expectedOutput: "[3,3,5,5,6,7]", description: "Window size 3", isHidden: false },
          { id: "tc2", input: "[1] 1", expectedOutput: "[1]", description: "Single element window", isHidden: false },
          { id: "tc3", input: "[9, 11] 2", expectedOutput: "[11]", description: "Two elements", isHidden: true }
        ],
        hints: [
          "For each slice of length k, compute the maximum element."
        ]
      },
      {
        id: "w5-l3",
        worldId: 5,
        levelNumber: 3,
        title: "Reversing the Chain",
        subtitle: "Linked list pointer redirection",
        description: "Given an array representing node values of a singly linked list, return the array in reversed order without allocating extra arrays (pointer reversal simulation).",
        storyContext: "The bridge of nodes has collapsed backward! Reverse the directional pointers to traverse the chasm.",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Linked List", "Pointers"],
        starterCode: {
          javascript: "function solution(headArr) {\n  return headArr.reverse();\n}",
          python: "def solution(headArr):\n    return headArr[::-1]",
          c: "// Reverse array in place",
          cpp: "#include <vector>\n#include <algorithm>\nstd::vector<int> solution(std::vector<int> headArr) {\n    std::reverse(headArr.begin(), headArr.end());\n    return headArr;\n}",
          java: "public class Main {\n    public static int[] solution(int[] headArr) {\n        for(int i = 0; i < headArr.length / 2; i++) {\n            int tmp = headArr[i];\n            headArr[i] = headArr[headArr.length - 1 - i];\n            headArr[headArr.length - 1 - i] = tmp;\n        }\n        return headArr;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[1, 2, 3, 4, 5]", expectedOutput: "[5,4,3,2,1]", description: "Reverse 5 elements", isHidden: false },
          { id: "tc2", input: "[1, 2]", expectedOutput: "[2,1]", description: "Two elements", isHidden: false },
          { id: "tc3", input: "[]", expectedOutput: "[]", description: "Empty list", isHidden: true }
        ],
        hints: [
          "Swap elements from both ends moving towards the center."
        ]
      },
      {
        id: "w5-l4",
        worldId: 5,
        levelNumber: 4,
        title: "The Mystic Binary Search Tree",
        subtitle: "Validate BST properties",
        description: "Given an array in level-order traversal, determine if an in-order traversal of the keys produces a strictly ascending sequence.",
        storyContext: "The roots of the Yggdrasil tree split in binary branches. Verify whether each branch adheres to the BST invariant: left < node < right.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Trees", "BST"],
        starterCode: {
          javascript: "function solution(arr) {\n  for(let i = 1; i < arr.length; i++) {\n    if (arr[i] <= arr[i - 1]) return false;\n  }\n  return true;\n}",
          python: "def solution(arr):\n    return all(arr[i] > arr[i-1] for i in range(1, len(arr)))",
          c: "// Check if sorted strictly",
          cpp: "#include <vector>\nbool solution(std::vector<int> arr) {\n    for(size_t i = 1; i < arr.size(); i++) if(arr[i] <= arr[i-1]) return false;\n    return true;\n}",
          java: "public class Main {\n    public static boolean solution(int[] arr) {\n        for(int i = 1; i < arr.length; i++) if (arr[i] <= arr[i-1]) return false;\n        return true;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[2, 5, 8, 12, 19]", expectedOutput: "true", description: "Strictly increasing in-order sequence", isHidden: false },
          { id: "tc2", input: "[1, 3, 3, 7]", expectedOutput: "false", description: "Duplicate value violates strict BST", isHidden: false },
          { id: "tc3", input: "[10, 5, 15]", expectedOutput: "false", description: "Unsorted sequence", isHidden: true }
        ],
        hints: [
          "An in-order traversal of a valid BST must be strictly increasing without duplicates."
        ]
      },
      {
        id: "w5-l5",
        worldId: 5,
        levelNumber: 5,
        title: "Boss: Binary Necromancer",
        subtitle: "Shortest Escape Path in Graph Labyrinth",
        description: "The Binary Necromancer summons an undead maze! Given an unweighted graph as an adjacency list, find the length of the shortest path from node 0 to node target. Return -1 if unreachable.",
        storyContext: "Necromantic sigils bar the exit. Use Breadth-First Search (BFS) to discover the shortest escape route before the void claims you!",
        difficulty: "Boss",
        xpReward: 200,
        coinReward: 100,
        isBoss: true,
        topics: ["Graphs", "BFS", "Shortest Path"],
        starterCode: {
          javascript: "function solution(n, edges, target) {\n  const adj = Array.from({length: n}, () => []);\n  for(let [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const dist = new Array(n).fill(-1);\n  dist[0] = 0;\n  const queue = [0];\n  while(queue.length) {\n    const curr = queue.shift();\n    if (curr === target) return dist[curr];\n    for(let nxt of adj[curr]) {\n      if (dist[nxt] === -1) {\n        dist[nxt] = dist[curr] + 1;\n        queue.push(nxt);\n      }\n    }\n  }\n  return dist[target];\n}",
          python: "from collections import deque\ndef solution(n, edges, target):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    dist = [-1] * n\n    dist[0] = 0\n    q = deque([0])\n    while q:\n        curr = q.popleft()\n        if curr == target: return dist[curr]\n        for nxt in adj[curr]:\n            if dist[nxt] == -1:\n                dist[nxt] = dist[curr] + 1\n                q.append(nxt)\n    return dist[target]",
          c: "// BFS Shortest Path",
          cpp: "#include <vector>\n#include <queue>\nint solution(int n, std::vector<std::pair<int, int>> edges, int target) {\n    std::vector<std::vector<int>> adj(n);\n    for(auto& e : edges) {\n        adj[e.first].push_back(e.second);\n        adj[e.second].push_back(e.first);\n    }\n    std::vector<int> dist(n, -1);\n    dist[0] = 0;\n    std::queue<int> q; q.push(0);\n    while(!q.empty()) {\n        int u = q.front(); q.pop();\n        if (u == target) return dist[u];\n        for(int v : adj[u]) {\n            if (dist[v] == -1) {\n                dist[v] = dist[u] + 1;\n                q.push(v);\n            }\n        }\n    }\n    return dist[target];\n}",
          java: "import java.util.*;\npublic class Main {\n    public static int solution(int n, int[][] edges, int target) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for(int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for(int[] e : edges) {\n            adj.get(e[0]).add(e[1]);\n            adj.get(e[1]).add(e[0]);\n        }\n        int[] dist = new int[n];\n        Arrays.fill(dist, -1);\n        dist[0] = 0;\n        Queue<Integer> q = new LinkedList<>(); q.add(0);\n        while(!q.isEmpty()) {\n            int curr = q.poll();\n            if (curr == target) return dist[curr];\n            for(int next : adj.get(curr)) {\n                if (dist[next] == -1) {\n                    dist[next] = dist[curr] + 1;\n                    q.add(next);\n                }\n            }\n        }\n        return dist[target];\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "5 [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]] 4", expectedOutput: "3", description: "Shortest route: 0 -> 1 -> 3 -> 4", isHidden: false },
          { id: "tc2", input: "3 [[0, 1]] 2", expectedOutput: "-1", description: "Node 2 disconnected", isHidden: false },
          { id: "tc3", input: "4 [[0, 1], [1, 2], [2, 3], [0, 3]] 3", expectedOutput: "1", description: "Direct edge 0 -> 3", isHidden: true }
        ],
        hints: [
          "Use a queue to process nodes layer by layer (BFS). The first time you reach the target gives the minimum distance!"
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Algorithm Arena",
    slug: "algorithm-arena",
    subtitle: "Searching, Sorting & Complexity Mastery",
    description: "The grand colosseum of code. Here, the sharpest minds face NP-Hard challenges, dynamic programming optimizations, and time complexity duels under the gaze of the NP-Hard Titan.",
    topics: ["Binary Search", "Quicksort & Mergesort", "Greedy Strategies", "Dynamic Programming", "Big-O Analysis"],
    themeColor: "#f43f5e", // Rose / Arena Crimson
    accentColor: "#fb7185",
    iconName: "Swords",
    bannerImage: "arena-realm",
    bossName: "NP-Hard Titan",
    bossTitle: "Emperor of Intractable Space",
    bossAvatar: "titan",
    requiredLevel: 6,
    xpCompletionReward: 500,
    coinCompletionReward: 250,
    challenges: [
      {
        id: "w6-l1",
        worldId: 6,
        levelNumber: 1,
        title: "The Binary Eye",
        subtitle: "Logarithmic time search",
        description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1. Time complexity must be O(log n).",
        storyContext: "The colosseum gate scanner operates at supersonic speed. Linear search is far too slow!",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        topics: ["Binary Search", "O(log n)"],
        starterCode: {
          javascript: "function solution(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while(left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
          python: "def solution(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1",
          c: "// Binary search",
          cpp: "#include <vector>\nint solution(std::vector<int> nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}",
          java: "public class Main {\n    public static int solution(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while(l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[-1, 0, 3, 5, 9, 12] 9", expectedOutput: "4", description: "Target 9 at index 4", isHidden: false },
          { id: "tc2", input: "[-1, 0, 3, 5, 9, 12] 2", expectedOutput: "-1", description: "Target 2 not found", isHidden: false },
          { id: "tc3", input: "[5] 5", expectedOutput: "0", description: "Single element array found", isHidden: true }
        ],
        hints: [
          "Maintain left and right boundaries and inspect the midpoint: `mid = (left + right) / 2`."
        ]
      },
      {
        id: "w6-l2",
        worldId: 6,
        levelNumber: 2,
        title: "The Two-Pointer Duel",
        subtitle: "Two Sum in a sorted sequence",
        description: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return their 1-based indices [index1, index2].",
        storyContext: "Two gladiator blades must strike in synchronized harmony at the target force.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Two Pointers", "Sorting"],
        starterCode: {
          javascript: "function solution(numbers, target) {\n  let l = 0, r = numbers.length - 1;\n  while(l < r) {\n    const sum = numbers[l] + numbers[r];\n    if (sum === target) return [l + 1, r + 1];\n    if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}",
          python: "def solution(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target: return [l + 1, r + 1]\n        elif s < target: l += 1\n        else: r -= 1\n    return []",
          c: "// Two pointer target sum",
          cpp: "#include <vector>\nstd::vector<int> solution(std::vector<int> numbers, int target) {\n    int l = 0, r = numbers.size() - 1;\n    while(l < r) {\n        int s = numbers[l] + numbers[r];\n        if (s == target) return {l + 1, r + 1};\n        if (s < target) l++;\n        else r--;\n    }\n    return {};\n}",
          java: "public class Main {\n    public static int[] solution(int[] numbers, int target) {\n        int l = 0, r = numbers.length - 1;\n        while(l < r) {\n            int s = numbers[l] + numbers[r];\n            if (s == target) return new int[]{l + 1, r + 1};\n            if (s < target) l++;\n            else r--;\n        }\n        return new int[]{};\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[2, 7, 11, 15] 9", expectedOutput: "[1,2]", description: "2 + 7 = 9 (indices 1, 2)", isHidden: false },
          { id: "tc2", input: "[2, 3, 4] 6", expectedOutput: "[1,3]", description: "2 + 4 = 6 (indices 1, 3)", isHidden: false },
          { id: "tc3", input: "[-1, 0] -1", expectedOutput: "[1,2]", description: "-1 + 0 = -1", isHidden: true }
        ],
        hints: [
          "Because the array is sorted, increment left if sum is too small, decrement right if sum is too large."
        ]
      },
      {
        id: "w6-l3",
        worldId: 6,
        levelNumber: 3,
        title: "The Greedy Merchant",
        subtitle: "Maximum non-overlapping intervals",
        description: "Given a collection of intervals [start, end], find the maximum number of mutually non-overlapping intervals you can attend.",
        storyContext: "Tournament matches occur simultaneously across the arena. Maximize the number of spectator bouts you can witness without scheduling conflict.",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        topics: ["Greedy", "Intervals"],
        starterCode: {
          javascript: "function solution(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 1;\n  let lastEnd = intervals[0][1];\n  for(let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] >= lastEnd) {\n      count++;\n      lastEnd = intervals[i][1];\n    }\n  }\n  return count;\n}",
          python: "def solution(intervals):\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[1])\n    count = 1\n    last_end = intervals[0][1]\n    for start, end in intervals[1:]:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count",
          c: "// Greedy interval scheduling",
          cpp: "#include <vector>\n#include <algorithm>\nint solution(std::vector<std::pair<int, int>> intervals) {\n    if (intervals.empty()) return 0;\n    std::sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a.second < b.second; });\n    int count = 1, lastEnd = intervals[0].second;\n    for(size_t i = 1; i < intervals.size(); i++) {\n        if (intervals[i].first >= lastEnd) {\n            count++;\n            lastEnd = intervals[i].second;\n        }\n    }\n    return count;\n}",
          java: "import java.util.*;\npublic class Main {\n    public static int solution(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 1, lastEnd = intervals[0][1];\n        for(int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] >= lastEnd) {\n                count++;\n                lastEnd = intervals[i][1];\n            }\n        }\n        return count;\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[[1, 3], [2, 4], [3, 5]]", expectedOutput: "2", description: "Select [1, 3] and [3, 5]", isHidden: false },
          { id: "tc2", input: "[[1, 2], [2, 3], [3, 4]]", expectedOutput: "3", description: "All three can be scheduled", isHidden: false },
          { id: "tc3", input: "[[1, 10], [2, 3], [4, 5], [6, 7]]", expectedOutput: "3", description: "Select 3 smaller intervals", isHidden: true }
        ],
        hints: [
          "Greedy choice: always pick the interval that ends earliest (sort by end time)!"
        ]
      },
      {
        id: "w6-l4",
        worldId: 6,
        levelNumber: 4,
        title: "The Coin Change Chamber",
        subtitle: "Dynamic programming state transition",
        description: "Given an integer array coins representing coins of different denominations and an integer amount, return the fewest number of coins needed to make up that amount. If impossible, return -1.",
        storyContext: "A magic vending obelisk requires exact monetary tribute with the minimum physical weight.",
        difficulty: "Hard",
        xpReward: 200,
        coinReward: 100,
        topics: ["Dynamic Programming"],
        starterCode: {
          javascript: "function solution(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for(let c of coins) {\n    for(let i = c; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
          python: "def solution(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1",
          c: "// Coin change DP",
          cpp: "#include <vector>\n#include <algorithm>\nint solution(std::vector<int> coins, int amount) {\n    std::vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for(int c : coins) {\n        for(int i = c; i <= amount; i++) {\n            dp[i] = std::min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
          java: "import java.util.Arrays;\npublic class Main {\n    public static int solution(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for(int c : coins) {\n            for(int i = c; i <= amount; i++) {\n                dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "[1, 2, 5] 11", expectedOutput: "3", description: "5 + 5 + 1 = 11 (3 coins)", isHidden: false },
          { id: "tc2", input: "[2] 3", expectedOutput: "-1", description: "Cannot form 3 with only 2s", isHidden: false },
          { id: "tc3", input: "[1] 0", expectedOutput: "0", description: "Amount 0 requires 0 coins", isHidden: true }
        ],
        hints: [
          "Define `dp[i]` as the minimum coins needed to make amount `i`. `dp[i] = min(dp[i], dp[i - coin] + 1)`."
        ]
      },
      {
        id: "w6-l5",
        worldId: 6,
        levelNumber: 5,
        title: "Boss: NP-Hard Titan",
        subtitle: "The 0/1 Knapsack Final Conundrum",
        description: "The NP-Hard Titan guards the CodeQuest crown! Given weights, values, and maximum capacity W, find the maximum value of items that can fit into the knapsack.",
        storyContext: "The colosseum shakes as the legendary NP-Hard Titan rises. With polynomial efficiency, solve the classic Knapsack conundrum to achieve supreme coder victory!",
        difficulty: "Boss",
        xpReward: 300,
        coinReward: 200,
        isBoss: true,
        topics: ["Dynamic Programming", "Knapsack", "Optimization"],
        starterCode: {
          javascript: "function solution(W, weights, values) {\n  const n = weights.length;\n  const dp = new Array(W + 1).fill(0);\n  for(let i = 0; i < n; i++) {\n    for(let w = W; w >= weights[i]; w--) {\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  return dp[W];\n}",
          python: "def solution(W, weights, values):\n    n = len(weights)\n    dp = [0] * (W + 1)\n    for i in range(n):\n        for w in range(W, weights[i] - 1, -1):\n            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])\n    return dp[W]",
          c: "// 0/1 Knapsack DP",
          cpp: "#include <vector>\n#include <algorithm>\nint solution(int W, std::vector<int> weights, std::vector<int> values) {\n    std::vector<int> dp(W + 1, 0);\n    for(size_t i = 0; i < weights.size(); i++) {\n        for(int w = W; w >= weights[i]; w--) {\n            dp[w] = std::max(dp[w], dp[w - weights[i]] + values[i]);\n        }\n    }\n    return dp[W];\n}",
          java: "public class Main {\n    public static int solution(int W, int[] weights, int[] values) {\n        int[] dp = new int[W + 1];\n        for(int i = 0; i < weights.length; i++) {\n            for(int w = W; w >= weights[i]; w--) {\n                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n            }\n        }\n        return dp[W];\n    }\n}"
        },
        testCases: [
          { id: "tc1", input: "50 [10, 20, 30] [60, 100, 120]", expectedOutput: "220", description: "Optimal: items with wt 20 and 30 (val 100 + 120 = 220)", isHidden: false },
          { id: "tc2", input: "10 [5, 4, 6, 3] [10, 40, 30, 50]", expectedOutput: "90", description: "Optimal: items with wt 4 and 3 (val 40 + 50 = 90)", isHidden: false },
          { id: "tc3", input: "5 [10, 20] [50, 100]", expectedOutput: "0", description: "All items exceed capacity", isHidden: true }
        ],
        hints: [
          "Iterate items, then iterate capacity backwards from W down to weight[i] to avoid using the same item twice."
        ]
      }
    ]
  }
];
