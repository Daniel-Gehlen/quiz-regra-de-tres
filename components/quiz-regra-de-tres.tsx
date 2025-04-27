"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

// Tipos de problemas
type ProblemType = "direct" | "inverse"

interface Problem {
  question: string
  options: number[]
  correctAnswer: number
  explanation: string
  type: ProblemType
}

// Função para gerar um número aleatório dentro de um intervalo
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Função para gerar um problema de regra de três
function generateProblem(): Problem {
  // Determinar se será regra de três direta ou inversa
  const problemType: ProblemType = Math.random() > 0.5 ? "direct" : "inverse"

  // Gerar valores aleatórios para o problema
  const a = getRandomInt(2, 10)
  const b = getRandomInt(5, 20)
  const c = getRandomInt(2, 15)

  // Calcular a resposta correta
  let correctAnswer: number

  if (problemType === "direct") {
    // Regra de três direta: a/b = c/x => x = (b*c)/a
    correctAnswer = Math.round((b * c) / a)
  } else {
    // Regra de três inversa: a/b = x/c => x = (a*c)/b
    correctAnswer = Math.round((a * c) / b)
  }

  // Gerar opções de resposta (1 correta e 4 incorretas)
  const options: number[] = [correctAnswer]

  while (options.length < 5) {
    // Variação de 10% a 30% para mais ou para menos
    const variation = correctAnswer * (getRandomInt(10, 30) / 100) * (Math.random() > 0.5 ? 1 : -1)
    const option = Math.max(1, Math.round(correctAnswer + variation))

    // Verificar se a opção já existe
    if (!options.includes(option) && option !== correctAnswer) {
      options.push(option)
    }
  }

  // Embaralhar as opções
  const shuffledOptions = [...options].sort(() => Math.random() - 0.5)

  // Gerar o enunciado do problema
  let question: string
  let explanation: string

  if (problemType === "direct") {
    // Exemplos de problemas de regra de três direta
    const scenarios = [
      `${a} pintores pintam ${b} paredes em um dia. Quantas paredes ${c} pintores pintarão em um dia?`,
      `Uma fábrica produz ${b} peças em ${a} horas. Quantas peças serão produzidas em ${c} horas?`,
      `${a} carros consomem ${b} litros de combustível. Quantos litros serão necessários para ${c} carros?`,
    ]

    question = scenarios[getRandomInt(0, scenarios.length - 1)]

    explanation = `Regra de três direta: ${a} está para ${b} assim como ${c} está para x.
    \n${a}/${b} = ${c}/x
    \n${a} × x = ${b} × ${c}
    \nx = (${b} × ${c}) ÷ ${a}
    \nx = ${correctAnswer}`
  } else {
    // Exemplos de problemas de regra de três inversa
    const scenarios = [
      `${a} trabalhadores constroem um muro em ${b} dias. Quantos dias levarão ${c} trabalhadores?`,
      `${a} máquinas produzem ${b} peças por hora. Quantas peças por hora produzirão ${c} máquinas?`,
      `Uma torneira enche um tanque em ${b} minutos. Quanto tempo levarão ${c} torneiras para encher o mesmo tanque?`,
    ]

    question = scenarios[getRandomInt(0, scenarios.length - 1)]

    explanation = `Regra de três inversa: ${a} está para ${b} assim como ${c} está para x.
    \n${a}/${b} = ${c}/x
    \n${a} × x = ${b} × ${c}
    \nx = (${a} × ${b}) ÷ ${c}
    \nx = ${correctAnswer}`
  }

  return {
    question,
    options: shuffledOptions,
    correctAnswer,
    explanation,
    type: problemType,
  }
}

export function QuizRegradeTres() {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Função para criar um novo problema
  const createNewProblem = () => {
    setIsLoading(true)
    try {
      const newProblem = generateProblem()
      setProblem(newProblem)
      setSelectedOption(null)
      setIsAnswered(false)
    } catch (error) {
      console.error("Erro ao gerar problema:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar resposta
  const checkAnswer = () => {
    if (!selectedOption || !problem) return

    setIsAnswered(true)

    if (Number.parseInt(selectedOption) === problem.correctAnswer) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }
  }

  // Gerar um problema ao iniciar
  useEffect(() => {
    createNewProblem()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!problem) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <p className="text-red-500">Erro ao carregar o problema. Por favor, tente novamente.</p>
            <Button onClick={createNewProblem} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Problema de Regra de Três</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" /> {score.correct}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" /> {score.incorrect}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{problem.question}</div>

        <Alert>
          <AlertDescription className="text-sm">
            <strong>Dica:</strong> Use a regra de três {problem.type === "direct" ? "direta" : "inversa"} para resolver
            este problema.
          </AlertDescription>
        </Alert>

        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
          disabled={isAnswered}
        >
          {problem.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 border p-3 rounded-md ${
                isAnswered && option === problem.correctAnswer ? "bg-green-100 border-green-300" : ""
              } ${
                isAnswered && selectedOption === option.toString() && option !== problem.correctAnswer
                  ? "bg-red-100 border-red-300"
                  : ""
              }`}
            >
              <RadioGroupItem value={option.toString()} id={`option-${index}`} disabled={isAnswered} />
              <Label htmlFor={`option-${index}`} className="w-full cursor-pointer">
                {option}
              </Label>
              {isAnswered && option === problem.correctAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
              {isAnswered && selectedOption === option.toString() && option !== problem.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          ))}
        </RadioGroup>

        {isAnswered && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border">
            <h3 className="font-bold mb-2">Resolução:</h3>
            <pre className="whitespace-pre-wrap text-sm">{problem.explanation}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAnswered ? (
          <Button onClick={checkAnswer} disabled={!selectedOption}>
            Verificar Resposta
          </Button>
        ) : (
          <Button onClick={createNewProblem} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Novo Problema
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
