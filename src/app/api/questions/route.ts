import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { error } from "console";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession();

    //desprotegemos FOR THE SAKE OF THE COURSE, ya aprendere a implementar bien una autenticacion en llamadas
    /* if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a quiz" },
        { status: 401 }
      );
    } */

    const body = await req.json();

    const { amount, topic, type } = quizCreationSchema.parse(body);

    let questions: any;

    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array, you have to return only the json, no introducction message and no end message, only the plain JSON",
        new Array(amount).fill(
          `You are to generate a random hard open-ended question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array, you have to return only the json, no introducction message and no end message, only the plain JSON",
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "correct answer with max length of 15 words",
          option1: "answer with max length of 15 words",
          option2: "answer with max length of 15 words",
          option3: "answer with max length of 15 words",
        }
      );
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
  }
};
