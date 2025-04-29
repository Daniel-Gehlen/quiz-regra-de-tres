"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Info } from "lucide-react"

// Tipos de problemas
type ProportionType = "direct" | "inverse"

interface Problem {
  question: string
  options: { value: number; label: string }[]
  correctAnswer: number
  explanation: string
  type: ProportionType
  values: {
    a: number
    b: number
    c: number
    result: number
  }
  scenario: string
}

// Cenários para problemas de regra de três direta
const directScenarios = [
  {
    template: "{a} pintores pintam {b} paredes em {time} horas. Quantas paredes {c} pintores pintarão no mesmo tempo?",
    valueNames: { a: "pintores", b: "paredes", c: "pintores" },
    resultName: "paredes",
    timeValue: () => getRandomInt(2, 8),
    explanation: (values: any) => `
1. Classificação: Direta (mais pintores → mais paredes no mesmo tempo)

2. Proporção:
   ${values.a} pintores está para ${values.c} pintores
   assim como ${values.b} paredes está para x paredes
   
3. Montagem da equação:
   ${values.a}/${values.c} = ${values.b}/x
   
4. Cálculo:
   ${values.a} × x = ${values.c} × ${values.b}
   x = (${values.c} × ${values.b}) ÷ ${values.a}
   x = ${values.c * values.b} ÷ ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Uma fábrica produz {b} peças em {time} horas com {a} máquinas. Quantas peças serão produzidas no mesmo tempo com {c} máquinas?",
    valueNames: { a: "máquinas", b: "peças", c: "máquinas" },
    resultName: "peças",
    timeValue: () => getRandomInt(4, 12),
    explanation: (values: any) => `
1. Classificação: Direta (mais máquinas → mais peças no mesmo tempo)

2. Proporção:
   ${values.a} máquinas está para ${values.c} máquinas
   assim como ${values.b} peças está para x peças
   
3. Montagem da equação:
   ${values.a}/${values.c} = ${values.b}/x
   
4. Cálculo:
   ${values.a} × x = ${values.c} × ${values.b}
   x = (${values.c} × ${values.b}) ÷ ${values.a}
   x = ${values.c * values.b} ÷ ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "{a} caminhões transportam {b} toneladas de carga. Quantas toneladas {c} caminhões transportarão nas mesmas condições?",
    valueNames: { a: "caminhões", b: "toneladas", c: "caminhões" },
    resultName: "toneladas",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Direta (mais caminhões → mais toneladas transportadas)

2. Proporção:
   ${values.a} caminhões está para ${values.c} caminhões
   assim como ${values.b} toneladas está para x toneladas
   
3. Montagem da equação:
   ${values.a}/${values.c} = ${values.b}/x
   
4. Cálculo:
   ${values.a} × x = ${values.c} × ${values.b}
   x = (${values.c} × ${values.b}) ÷ ${values.a}
   x = ${values.c * values.b} ÷ ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Com {a} funcionários, uma empresa atende {b} clientes por dia. Quantos clientes serão atendidos com {c} funcionários?",
    valueNames: { a: "funcionários", b: "clientes", c: "funcionários" },
    resultName: "clientes",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Direta (mais funcionários → mais clientes atendidos)

2. Proporção:
   ${values.a} funcionários está para ${values.c} funcionários
   assim como ${values.b} clientes está para x clientes
   
3. Montagem da equação:
   ${values.a}/${values.c} = ${values.b}/x
   
4. Cálculo:
   ${values.a} × x = ${values.c} × ${values.b}
   x = (${values.c} × ${values.b}) ÷ ${values.a}
   x = ${values.c * values.b} ÷ ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "{a} impressoras produzem {b} folhetos em {time} minutos. Quantos folhetos {c} impressoras produzirão no mesmo tempo?",
    valueNames: { a: "impressoras", b: "folhetos", c: "impressoras" },
    resultName: "folhetos",
    timeValue: () => getRandomInt(10, 30),
    explanation: (values: any) => `
1. Classificação: Direta (mais impressoras → mais folhetos no mesmo tempo)

2. Proporção:
   ${values.a} impressoras está para ${values.c} impressoras
   assim como ${values.b} folhetos está para x folhetos
   
3. Montagem da equação:
   ${values.a}/${values.c} = ${values.b}/x
   
4. Cálculo:
   ${values.a} × x = ${values.c} × ${values.b}
   x = (${values.c} × ${values.b}) ÷ ${values.a}
   x = ${values.c * values.b} ÷ ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
]

// Cenários para problemas de regra de três inversa
const inverseScenarios = [
  {
    template: "{a} operários constroem um muro em {b} dias. Em quantos dias {c} operários construirão o mesmo muro?",
    valueNames: { a: "operários", b: "dias", c: "operários" },
    resultName: "dias",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Inversa (mais operários → menos dias para o mesmo trabalho)

2. Proporção:
   ${values.a} operários está para ${values.c} operários
   assim como x dias está para ${values.b} dias
   
3. Montagem da equação:
   ${values.a}/${values.c} = x/${values.b}
   
4. Cálculo:
   ${values.a} × ${values.b} = ${values.c} × x
   x = (${values.a} × ${values.b}) ÷ ${values.c}
   x = ${values.a * values.b} ÷ ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template: "{a} torneiras enchem um tanque em {b} horas. Em quanto tempo {c} torneiras encherão o mesmo tanque?",
    valueNames: { a: "torneiras", b: "horas", c: "torneiras" },
    resultName: "horas",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Inversa (mais torneiras → menos tempo para encher o tanque)

2. Proporção:
   ${values.a} torneiras está para ${values.c} torneiras
   assim como x horas está para ${values.b} horas
   
3. Montagem da equação:
   ${values.a}/${values.c} = x/${values.b}
   
4. Cálculo:
   ${values.a} × ${values.b} = ${values.c} × x
   x = (${values.a} × ${values.b}) ÷ ${values.c}
   x = ${values.a * values.b} ÷ ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Uma equipe de {a} pessoas realiza um trabalho em {b} horas. Quanto tempo uma equipe de {c} pessoas levará para realizar o mesmo trabalho?",
    valueNames: { a: "pessoas", b: "horas", c: "pessoas" },
    resultName: "horas",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Inversa (mais pessoas → menos tempo para o mesmo trabalho)

2. Proporção:
   ${values.a} pessoas está para ${values.c} pessoas
   assim como x horas está para ${values.b} horas
   
3. Montagem da equação:
   ${values.a}/${values.c} = x/${values.b}
   
4. Cálculo:
   ${values.a} × ${values.b} = ${values.c} × x
   x = (${values.a} × ${values.b}) ÷ ${values.c}
   x = ${values.a * values.b} ÷ ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Um carro percorre uma distância em {b} horas a {a} km/h. Quanto tempo levará para percorrer a mesma distância a {c} km/h?",
    valueNames: { a: "velocidade", b: "horas", c: "velocidade" },
    resultName: "horas",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Inversa (maior velocidade → menos tempo para a mesma distância)

2. Proporção:
   ${values.a} km/h está para ${values.c} km/h
   assim como x horas está para ${values.b} horas
   
3. Montagem da equação:
   ${values.a}/${values.c} = x/${values.b}
   
4. Cálculo:
   ${values.a} × ${values.b} = ${values.c} × x
   x = (${values.a} × ${values.b}) ÷ ${values.c}
   x = ${values.a * values.b} ÷ ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "{a} máquinas produzem determinada quantidade de peças em {b} horas. Quanto tempo {c} máquinas levarão para produzir a mesma quantidade?",
    valueNames: { a: "máquinas", b: "horas", c: "máquinas" },
    resultName: "horas",
    timeValue: null,
    explanation: (values: any) => `
1. Classificação: Inversa (mais máquinas → menos tempo para a mesma produção)

2. Proporção:
   ${values.a} máquinas está para ${values.c} máquinas
   assim como x horas está para ${values.b} horas
   
3. Montagem da equação:
   ${values.a}/${values.c} = x/${values.b}
   
4. Cálculo:
   ${values.a} × ${values.b} = ${values.c} × x
   x = (${values.a} × ${values.b}) ÷ ${values.c}
   x = ${values.a * values.b} ÷ ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
]

// Função para gerar um número aleatório dentro de um intervalo
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Função para substituir placeholders no template
function replacePlaceholders(template: string, values: Record<string, any>): string {
  let result = template
  for (const key in values) {
    result = result.replace(`{${key}}`, values[key])
  }
  return result
}

// Função para gerar opções de resposta
function generateOptions(correctAnswer: number): { value: number; label: string }[] {
  const options: { value: number; label: string }[] = [{ value: correctAnswer, label: correctAnswer.toString() }]

  // Gerar opções incorretas plausíveis
  while (options.length < 4) {
    // Variação de 10% a 30% para mais ou para menos
    const variation = correctAnswer * (getRandomInt(10, 30) / 100) * (Math.random() > 0.5 ? 1 : -1)
    const optionValue = Math.max(1, Math.round(correctAnswer + variation))

    // Verificar se a opção já existe
    if (!options.some((opt) => opt.value === optionValue)) {
      options.push({ value: optionValue, label: optionValue.toString() })
    }
  }

  // Embaralhar as opções
  return options.sort(() => Math.random() - 0.5)
}

// Função para gerar um problema de regra de três
function generateProblem(): Problem {
  // Determinar se será regra de três direta ou inversa
  const problemType: ProportionType = Math.random() > 0.5 ? "direct" : "inverse"

  // Selecionar um cenário aleatório
  const scenarios = problemType === "direct" ? directScenarios : inverseScenarios
  const scenarioIndex = getRandomInt(0, scenarios.length - 1)
  const scenario = scenarios[scenarioIndex]

  // Gerar valores aleatórios para o problema
  let a = getRandomInt(2, 10)
  let c = getRandomInt(2, 15)

  // Garantir que c seja diferente de a
  while (c === a) {
    c = getRandomInt(2, 15)
  }

  // Gerar b de forma que o resultado seja um número inteiro
  let b: number
  let result: number

  if (problemType === "direct") {
    // Para regra de três direta: a/c = b/x => x = (c*b)/a
    // Queremos que x seja inteiro, então b deve ser múltiplo de a
    const multiplier = getRandomInt(1, 5)
    b = a * multiplier
    result = Math.round((c * b) / a)
  } else {
    // Para regra de três inversa: a/c = x/b => x = (a*b)/c
    // Queremos que x seja inteiro, então a*b deve ser múltiplo de c
    b = getRandomInt(2, 12)
    // Ajustar a para que a*b seja múltiplo de c
    const remainder = (a * b) % c
    if (remainder !== 0) {
      a = a + (c - remainder) / b
    }
    result = Math.round((a * b) / c)
  }

  // Criar valores para substituir no template
  const values: Record<string, any> = {
    a: a,
    b: b,
    c: c,
    time: scenario.timeValue ? scenario.timeValue() : null,
  }

  // Substituir placeholders no template
  const questionText = replacePlaceholders(scenario.template, values)

  // Adicionar a classificação ao enunciado
  const questionWithClassification = `${questionText} Use regra de três ${problemType === "direct" ? "DIRETA" : "INVERSA"}.`

  // Gerar explicação detalhada
  const explanationValues = {
    a: a,
    b: b,
    c: c,
    result: result,
    resultName: scenario.valueNames.b === "paredes" ? "paredes" : scenario.resultName,
  }

  const explanation = scenario.explanation(explanationValues)

  // Gerar opções de resposta
  const options = generateOptions(result)

  // Criar o problema
  return {
    question: questionWithClassification,
    options: options,
    correctAnswer: result,
    explanation: explanation,
    type: problemType,
    values: {
      a: a,
      b: b,
      c: c,
      result: result,
    },
    scenario: scenario.template,
  }
}

// Componente principal do quiz
export function QuizRegradeTres() {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  // Função para criar um novo problema
  const createNewProblem = () => {
    setIsLoading(true)
    try {
      const newProblem = generateProblem()
      setProblem(newProblem)
      setSelectedOption(null)
      setIsAnswered(false)
      setShowExplanation(false)
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

  // Mostrar explicação
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation)
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
        <Alert>
          <AlertTitle className="text-lg font-medium">Problema:</AlertTitle>
          <AlertDescription className="mt-2">{problem.question}</AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="font-medium">Alternativas:</h3>
          <RadioGroup
            value={selectedOption || ""}
            onValueChange={setSelectedOption}
            className="space-y-3"
            disabled={isAnswered}
          >
            {problem.options.map((option, index) => {
              const letters = ["A", "B", "C", "D"]
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 border p-3 rounded-md ${
                    isAnswered && option.value === problem.correctAnswer ? "bg-green-100 border-green-300" : ""
                  } ${
                    isAnswered && selectedOption === option.value.toString() && option.value !== problem.correctAnswer
                      ? "bg-red-100 border-red-300"
                      : ""
                  }`}
                >
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} disabled={isAnswered} />
                  <Label htmlFor={`option-${index}`} className="w-full cursor-pointer">
                    {letters[index]}) {option.value}
                  </Label>
                  {isAnswered && option.value === problem.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {isAnswered &&
                    selectedOption === option.value.toString() &&
                    option.value !== problem.correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {isAnswered && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Tipo: Regra de Três {problem.type === "direct" ? "Direta" : "Inversa"}</h3>
              <Button variant="outline" size="sm" onClick={toggleExplanation} className="flex items-center gap-1">
                <Info className="h-4 w-4" /> {showExplanation ? "Ocultar Solução" : "Ver Solução"}
              </Button>
            </div>

            {showExplanation && (
              <div className="p-4 bg-gray-50 rounded-md border">
                <h4 className="font-medium mb-2">Solução:</h4>
                <div className="text-sm space-y-3">
                  {problem.explanation.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className={
                        paragraph.trim().startsWith("1.") ||
                        paragraph.trim().startsWith("2.") ||
                        paragraph.trim().startsWith("3.") ||
                        paragraph.trim().startsWith("4.")
                          ? "font-medium"
                          : "pl-4"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-3 font-medium">
                  Resposta correta:{" "}
                  {problem.options.findIndex((opt) => opt.value === problem.correctAnswer) !== -1
                    ? `${["A", "B", "C", "D"][problem.options.findIndex((opt) => opt.value === problem.correctAnswer)]} (${problem.correctAnswer})`
                    : problem.correctAnswer}
                </div>
              </div>
            )}
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
