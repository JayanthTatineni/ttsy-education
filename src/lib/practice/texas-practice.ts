import { isNumericMatch, normalizeAnswer } from "@/lib/utils";
import type { LessonDetail, PracticeQuestion } from "@/types/domain";

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function randomFromRange(seed: number, min: number, max: number) {
  const size = max - min + 1;
  return min + (seed % size);
}

export function generateTexasPractice(
  lesson: LessonDetail,
  round: number,
): PracticeQuestion[] {
  const seedBase = lesson.slug.length * 17 + round * 13;

  switch (lesson.slug) {
    case "counting-to-10": {
      const count = randomFromRange(seedBase, 3, 9);
      const oneMore = count + 1;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS K.2A",
          prompt: `Count the toy cars in the set. There are ${count} toy cars. Which number matches the set?`,
          type: "multiple_choice",
          options: rotate([`${count - 1}`, `${count}`, `${count + 1}`, `${count + 2}`], round % 4),
          answer: `${count}`,
          explanation:
            "Count each object one time, then match the total to the correct number.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS K.2B",
          prompt: `What number is one more than ${count}?`,
          type: "numeric",
          answer: `${oneMore}`,
          explanation:
            "One more means the next counting number after the given number.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS K.2A",
          prompt: `True or false: A set with ${count} dots matches the number ${count}.`,
          type: "true_false",
          answer: "true",
          explanation:
            "The counting number tells how many objects are in the set.",
        },
      ];
    }

    case "weather-patterns":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS K.10B",
          prompt: "Which weather word best describes a day with falling rain?",
          type: "multiple_choice",
          options: rotate(["rainy", "sunny", "foggy", "night"], round % 4),
          answer: "rainy",
          explanation:
            "Rainy weather means water is falling from clouds.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS K.10C",
          prompt: "Which object do you usually see in the daytime sky?",
          type: "multiple_choice",
          options: rotate(["the Sun", "a flashlight", "a desk", "a pillow"], round % 4),
          answer: "the Sun",
          explanation:
            "The Sun is the daytime object students most often observe in the sky.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS K.10B",
          prompt: "True or false: Weather can change from one day to the next.",
          type: "true_false",
          answer: "true",
          explanation:
            "Students observe that some days are sunny, some are cloudy, and some are rainy.",
        },
      ];

    case "place-value-to-100": {
      const tens = randomFromRange(seedBase, 2, 8);
      const ones = randomFromRange(seedBase + 2, 1, 9);
      const value = tens * 10 + ones;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 2.2A",
          prompt: `A number has ${tens} tens and ${ones} ones. What number is it?`,
          type: "numeric",
          answer: `${value}`,
          explanation:
            "Use place value: tens are groups of ten and ones are single units.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 2.2B",
          prompt: `Which number is greater: ${value} or ${value - 3}?`,
          type: "multiple_choice",
          options: rotate([`${value}`, `${value - 3}`], round % 2),
          answer: `${value}`,
          explanation:
            "Compare the tens first. If the tens are the same, compare the ones.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 2.2B",
          prompt: `What number is one more than ${value}?`,
          type: "numeric",
          answer: `${value + 1}`,
          explanation:
            "One more increases the number by exactly one.",
        },
      ];
    }

    case "matter-and-materials":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 2.6A",
          prompt: "Which item is a solid?",
          type: "multiple_choice",
          options: rotate(["rock", "milk", "juice", "steam"], round % 4),
          answer: "rock",
          explanation:
            "A solid keeps its own shape. Liquids do not.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 2.6B",
          prompt: "What change happens when you fold paper?",
          type: "multiple_choice",
          options: rotate(
            ["its shape changes", "it becomes a liquid", "it turns into metal", "it vanishes"],
            round % 4,
          ),
          answer: "its shape changes",
          explanation:
            "Folding changes a physical property like shape without making a new material.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 2.6C",
          prompt: "True or false: Small pieces can be put together to make a new object for a different purpose.",
          type: "true_false",
          answer: "true",
          explanation:
            "Students combine small units like blocks to build new objects.",
        },
      ];

    case "addition-within-10": {
      const a = randomFromRange(seedBase, 1, 5);
      const b = randomFromRange(seedBase + 2, 2, 5);
      const sum = a + b;
      const missing = 10 - a;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 1.3B",
          prompt: `Sofia has ${a} markers and gets ${b} more. How many markers does she have now?`,
          type: "multiple_choice",
          options: rotate([`${sum}`, `${sum - 1}`, `${sum + 1}`, `${sum + 2}`], round % 4),
          answer: `${sum}`,
          explanation:
            "This is an addition story problem. Join the two groups to find the total.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 1.3D",
          prompt: `What is ${a} + ${b}?`,
          type: "numeric",
          answer: `${sum}`,
          explanation:
            "Count on from the larger number or use a ten-frame strategy to find the sum.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 1.5F",
          prompt: `${a} + ? = 10. What number makes the equation true?`,
          type: "numeric",
          answer: `${missing}`,
          explanation:
            "Think about how many more are needed to make ten.",
        },
      ];
    }

    case "subtraction-within-10": {
      const start = randomFromRange(seedBase, 6, 10);
      const take = randomFromRange(seedBase + 2, 1, 5);
      const left = start - take;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 1.3B",
          prompt: `There are ${start} balloons. ${take} float away. How many are left?`,
          type: "multiple_choice",
          options: rotate([`${left}`, `${left + 1}`, `${left - 1}`, `${left + 2}`], round % 4),
          answer: `${left}`,
          explanation:
            "This is a subtraction story problem. Start with the whole group and take away.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 1.3D",
          prompt: `What is ${start} - ${take}?`,
          type: "numeric",
          answer: `${left}`,
          explanation:
            "Count back or use the relationship between addition and subtraction.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 1.5F",
          prompt: `${start} - ? = ${left}. What number is missing?`,
          type: "numeric",
          answer: `${take}`,
          explanation:
            "The missing number is the amount taken away from the starting number.",
        },
      ];
    }

    case "intro-to-multiplication": {
      const groups = randomFromRange(seedBase, 2, 5);
      const each = randomFromRange(seedBase + 3, 2, 6);
      const total = groups * each;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 3.5B",
          prompt: `A model shows ${groups} equal rows with ${each} counters in each row. Which equation represents the model?`,
          type: "multiple_choice",
          options: rotate(
            [`${groups} x ${each}`, `${groups} + ${each}`, `${total} - ${each}`, `${each} / ${groups}`],
            round % 4,
          ),
          answer: `${groups} x ${each}`,
          explanation:
            "Multiplication describes equal groups. The first factor is the number of groups.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 3.4K",
          prompt: `Each box holds ${each} markers. There are ${groups} boxes. How many markers are there in all?`,
          type: "numeric",
          answer: `${total}`,
          explanation:
            "This is an equal-groups situation. Multiply the number of groups by the number in each group.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 3.5B",
          prompt: `A strip diagram has ${groups} equal parts labeled ${each}. Which repeated addition matches the diagram?`,
          type: "multiple_choice",
          options: rotate(
            [
              Array.from({ length: groups }, () => each).join(" + "),
              `${groups} + ${each}`,
              Array.from({ length: each }, () => groups).join(" + ") + " + 1",
              `${total} + ${each}`,
            ],
            round % 4,
          ),
          answer: Array.from({ length: groups }, () => each).join(" + "),
          explanation:
            "Repeated addition uses the same addend once for each equal group.",
        },
      ];
    }

    case "division-as-equal-groups": {
      const divisor = randomFromRange(seedBase, 2, 5);
      const quotient = randomFromRange(seedBase + 2, 2, 6);
      const dividend = divisor * quotient;

      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 3.4K",
          prompt: `A teacher shares ${dividend} counters equally among ${divisor} groups. How many counters are in each group?`,
          type: "numeric",
          answer: `${quotient}`,
          explanation:
            "Division asks how many are in each equal group or how many groups can be made.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 3.5B",
          prompt: `Which related multiplication fact can be used to solve ${dividend} / ${divisor}?`,
          type: "multiple_choice",
          options: rotate(
            [
              `${divisor} x ${quotient} = ${dividend}`,
              `${dividend} x ${divisor} = ${quotient}`,
              `${dividend} - ${divisor} = ${quotient}`,
              `${quotient} + ${divisor} = ${dividend}`,
            ],
            round % 4,
          ),
          answer: `${divisor} x ${quotient} = ${dividend}`,
          explanation:
            "A related multiplication fact shows the equal groups that make the total.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 3.4K",
          prompt: `True or false: If ${divisor} equal groups make ${dividend}, then each group can have ${quotient}.`,
          type: "true_false",
          answer: "true",
          explanation: `If ${divisor} groups of ${quotient} make ${dividend}, then the division fact is true.`,
        },
      ];
    }

    case "equivalent-fractions":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 4.3C",
          prompt: "A point on a number line is exactly halfway between 0 and 1. Which fraction could name that point?",
          type: "multiple_choice",
          options: rotate(["2/4", "1/4", "3/4", "5/6"], round % 4),
          answer: "2/4",
          explanation:
            "Equivalent fractions name the same amount of the whole.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 4.3D",
          prompt: "Which symbol makes the comparison true: 5/8 __ 1/2?",
          type: "multiple_choice",
          options: rotate([">", "<", "=", "+"], round % 4),
          answer: ">",
          explanation:
            "One-half is 4/8, so 5/8 is greater than 1/2.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 4.3C",
          prompt: "Complete the statement: 1/2 = __/8",
          type: "numeric",
          answer: "4",
          explanation:
            "One-half is the same amount as four eighths.",
        },
      ];

    case "energy-and-circuits":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 4.8A",
          prompt: "Which situation best shows sound energy being transferred?",
          type: "multiple_choice",
          options: rotate(["a ringing bell", "a silent book", "a still desk", "a sleeping pillow"], round % 4),
          answer: "a ringing bell",
          explanation:
            "Sound energy travels as vibrations that can be heard.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 4.8B",
          prompt: "A student wants to stop electrical energy from passing to her hand. Which material is the best insulator?",
          type: "multiple_choice",
          options: rotate(["rubber", "metal", "copper wire", "aluminum foil"], round % 4),
          answer: "rubber",
          explanation:
            "Insulators do not let electrical energy move through them easily.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 4.8C",
          prompt: "True or false: A bulb can light when the circuit has an open gap in the path.",
          type: "true_false",
          answer: "false",
          explanation:
            "A bulb needs a closed path so electrical energy can travel through the circuit.",
        },
      ];

    case "states-of-matter":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 5.6A",
          prompt: "A student compares three samples by whether they keep shape, keep volume, or spread out. Which property is the student using?",
          type: "multiple_choice",
          options: rotate(
            ["physical state", "favorite color", "day of the week", "classroom seat"],
            round % 4,
          ),
          answer: "physical state",
          explanation:
            "The TEKS focus on measurable or observable physical properties such as physical state and mass.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 5.6A",
          prompt: "True or false: A liquid keeps its volume but changes shape to fit its container.",
          type: "true_false",
          answer: "true",
          explanation:
            "Liquids do not keep their own shape, but they do keep a consistent volume.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 5.6A",
          prompt: "Which sample would most likely be identified as a gas at room temperature?",
          type: "multiple_choice",
          options: rotate(["air in a balloon", "ice cube", "metal spoon", "book cover"], round % 4),
          answer: "air in a balloon",
          explanation:
            "A gas spreads to fill the space available to it.",
        },
      ];

    case "simple-forces":
      return [
        {
          id: `${lesson.slug}-${round}-1`,
          teks: "TEKS 5.7A",
          prompt: "Two students pull the same rope with equal force in opposite directions. Which result is best supported by this model?",
          type: "multiple_choice",
          options: rotate(
            ["The rope stays balanced.", "The rope moves left fast.", "The rope disappears.", "Gravity turns off."],
            round % 4,
          ),
          answer: "The rope stays balanced.",
          explanation:
            "Equal forces in opposite directions are balanced, so the motion does not change.",
        },
        {
          id: `${lesson.slug}-${round}-2`,
          teks: "TEKS 5.7B",
          prompt: "Which investigation setup is best for testing how a stronger push changes a toy car's motion?",
          type: "multiple_choice",
          options: rotate(
            [
              "Roll the same toy car with gentle and strong pushes.",
              "Use different cars on different days.",
              "Ask a friend to guess the answer.",
              "Only watch a video without testing anything.",
            ],
            round % 4,
          ),
          answer: "Roll the same toy car with gentle and strong pushes.",
          explanation:
            "A fair test changes one variable, like the force, while keeping the object the same.",
        },
        {
          id: `${lesson.slug}-${round}-3`,
          teks: "TEKS 5.7A",
          prompt: "True or false: Unequal forces can change the speed or direction of motion.",
          type: "true_false",
          answer: "true",
          explanation:
            "Unbalanced forces change motion by speeding an object up, slowing it down, or turning it.",
        },
      ];

    default:
      return lesson.questions.slice(0, 3).map((question, index) => ({
        id: `${lesson.slug}-${round}-${index + 1}`,
        teks: question.skill_tag,
        prompt: question.prompt,
        type: question.type,
        options:
          Array.isArray(question.answer_options) &&
          question.answer_options.every((item) => typeof item === "string")
            ? (question.answer_options as string[])
            : undefined,
        answer: question.correct_answer,
        explanation: question.explanation,
      }));
  }
}

export function isPracticeAnswerCorrect(question: PracticeQuestion, selected: string) {
  if (question.type === "numeric") {
    return isNumericMatch(selected, question.answer);
  }

  return normalizeAnswer(selected) === normalizeAnswer(question.answer);
}
