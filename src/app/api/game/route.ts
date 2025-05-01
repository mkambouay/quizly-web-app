// /api/game

import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();

    //desprotegemos FOR THE SAKE OF THE COURSE, ya aprendere a implementar bien una autenticacion en llamadas
    /* if (!session?.user) {
      //Protegemos la ruta exigiendo que el usuario este logueado
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    } */

    const body = await req.json(); // Obtenemos el body de la request
    const { amount, topic, type } = quizCreationSchema.parse(body); // Mapeamos el objeto json
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5); //random para mezclar las preguntas del test
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });

      console.log("llega aqui");

      await prisma.question.createMany({
        data: manyData,
      });

      console.log("aqui parece que no");
    } else if (type == "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };

      let openQuestionData = data.questions.map((question: openQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended",
        };
      });

      await prisma.question.createMany({ data: openQuestionData });
    }
    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      // Si el error es de validacion, devolvemos un status 400
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
