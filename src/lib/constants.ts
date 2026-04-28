import type { Difficulty, GradeLevel, ProfileRole, QuestionType } from "@/types/domain";

export const GRADES: GradeLevel[] = ["K", "1", "2", "3", "4", "5"];

export const PROFILE_ROLES: Array<{ value: Exclude<ProfileRole, "admin">; label: string }> = [
  { value: "student", label: "Student" },
  { value: "educator", label: "Educator" },
];

export const SUBJECTS = [
  { slug: "math", name: "Math" },
  { slug: "science", name: "Science" },
] as const;

export const QUESTION_TYPES: Array<{ value: QuestionType; label: string }> = [
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "true_false", label: "True or false" },
  { value: "numeric", label: "Number answer" },
];

export const DIFFICULTIES: Array<{ value: Difficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "challenge", label: "Challenge" },
];

export const COMPLETION_SCORE = 80;

export const TEKS_SOURCE_LINKS = {
  math: "https://tea.texas.gov/about-tea/laws-and-rules/texas-administrative-code/19-tac-chapter-111",
  science:
    "https://tea.texas.gov/about-tea/laws-and-rules/texas-administrative-code/19-tac-chapter-112",
  releasedTests:
    "https://tea.texas.gov/student-assessment/staar/staar-released-test-questions",
} as const;

export const STARTER_TEXAS_TOPICS: Record<string, string[]> = {
  "math-counting-and-comparing": [
    "counting objects to 10",
    "one more and one less",
    "matching sets to numerals",
  ],
  "science-weather-and-sky": [
    "daily weather patterns",
    "day and night sky",
    "weather observation",
  ],
  "math-number-stories": [
    "joining and separating",
    "fact strategies",
    "missing numbers",
  ],
  "science-matter-and-materials": [
    "solids and liquids",
    "changing materials",
    "choosing materials by purpose",
  ],
  "math-place-value-and-strategies": [
    "tens and ones",
    "comparing numbers",
    "one more and one less",
  ],
  "math-groups-and-sharing": [
    "equal groups",
    "arrays and strip diagrams",
    "related multiplication and division facts",
  ],
  "math-fractions-and-patterns": [
    "fraction models",
    "equivalent fractions",
    "fraction comparisons",
  ],
  "science-energy-and-systems": [
    "sound energy",
    "conductors and insulators",
    "closed circuits",
  ],
  "science-matter-and-motion": [
    "states of matter",
    "physical properties",
    "forces and motion",
  ],
  "foundations-alphabet-and-colors": [
    "letter names and sounds",
    "sorting colors",
    "describing patterns",
  ],
  "science-organisms-and-environment": [
    "living things and needs",
    "food chains and food webs",
    "caring for habitats",
  ],
  "technology-digital-literacy": [
    "safe device habits",
    "searching and researching",
    "being a kind digital citizen",
  ],
  "engineering-scratch-projects": [
    "coding with blocks",
    "animations and games",
    "testing and improving projects",
  ],
  "science-plants": [
    "plant parts",
    "plant life cycles",
    "how plants help food chains",
  ],
  "math-addition-and-subtraction": [
    "adding within 100",
    "subtracting with strategies",
    "solving story problems",
  ],
  "math-big-addition-and-subtraction": [
    "regrouping",
    "checking with estimation",
    "multi-step number stories",
  ],
  "math-multiplication-and-division": [
    "equal groups",
    "arrays and products",
    "division with remainders",
  ],
  "math-place-value-fractions-and-decimals": [
    "place value",
    "fraction models",
    "decimal connections",
  ],
  "science-water-cycle": [
    "evaporation",
    "condensation and precipitation",
    "water on Earth",
  ],
  "science-force-and-energy": [
    "pushes and pulls",
    "light, sound, and heat",
    "energy transfer",
  ],
};

export function gradeLabel(grade: GradeLevel) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

export function parseGrade(value: string): GradeLevel | null {
  const normalized = value.toUpperCase();
  return GRADES.includes(normalized as GradeLevel)
    ? (normalized as GradeLevel)
    : null;
}
