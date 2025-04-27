// @ts-nocheck
import { QuizRegradeTres } from "@/components/quiz-regra-de-tres"

export default function Home(): JSX.Element {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz de Razões, Proporções e Regra de Três</h1>
      <QuizRegradeTres />
    </main>
  )
}
