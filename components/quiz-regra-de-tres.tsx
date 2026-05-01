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

// Componente de Informação sobre Regra de Três
function RuleOfThreeInfo() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Lembrete:</AlertTitle>
      <AlertDescription className="text-blue-700 text-xs sm:text-sm">
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li>
            <strong>Direta:</strong> Quando uma grandeza aumenta, a outra também aumenta. (Ex: Mais quilos, mais caro).
          </li>
          <li>
            <strong>Inversa:</strong> Quando uma grandeza aumenta, a outra diminui. (Ex: Mais operários, menos tempo).
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

// Função para arredondar para no máximo 1 casa decimal
export function roundToHeader(value: number): number {
  return Math.round(value * 10) / 10
}

// Cenários para problemas de regra de três direta
const directScenarios = [
  {
    template: "{a} pintores pintam {b} paredes em {time} horas. Quantas paredes {c} pintores pintarão no mesmo tempo?",
    valueNames: { a: "pintores", b: "paredes", c: "pintores" },
    resultName: "paredes",
    timeValue: () => getRandomInt(2, 8),
    explanation: (values: any) => `
1. Identificação das Grandezas: Pintores e Paredes.
2. Análise da Proporção: Se aumentarmos o número de pintores, a quantidade de paredes pintadas também aumentará (no mesmo tempo). Logo, são grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} pintores -> ${values.b} paredes
   ${values.c} pintores -> x paredes
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
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
1. Identificação das Grandezas: Máquinas e Peças.
2. Análise da Proporção: Mais máquinas produzirão mais peças em um mesmo intervalo de tempo. Portanto, são grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} máquinas -> ${values.b} peças
   ${values.c} máquinas -> x peças
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
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
1. Identificação das Grandezas: Caminhões e Toneladas.
2. Análise da Proporção: Aumentando o número de caminhões, a capacidade total de carga transportada aumenta. São grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} caminhões -> ${values.b} toneladas
   ${values.c} caminhões -> x toneladas
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
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
1. Identificação das Grandezas: Funcionários e Clientes.
2. Análise da Proporção: Mais funcionários permitem atender mais clientes. São grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} funcionários -> ${values.b} clientes
   ${values.c} funcionários -> x clientes
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
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
1. Identificação das Grandezas: Impressoras e Folhetos.
2. Análise da Proporção: Mais impressoras produzem mais folhetos no mesmo tempo. São grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} impressoras -> ${values.b} folhetos
   ${values.c} impressoras -> x folhetos
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template: "Se {a} kg de carne custam R$ {b}, quanto custarão {c} kg da mesma carne?",
    valueNames: { a: "kg", b: "reais", c: "kg" },
    resultName: "reais",
    timeValue: null,
    explanation: (values: any) => `
1. Identificação das Grandezas: Peso (kg) e Preço (R$).
2. Análise da Proporção: Se aumentarmos a quantidade de carne, o preço total aumentará proporcionalmente. São grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} kg -> ${values.b} reais
   ${values.c} kg -> x reais
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
   x = R$ ${values.result}
`,
  },
  {
    template: "Um carro consome {a} litros de combustível para percorrer {b} km. Quantos km ele percorrerá com {c} litros?",
    valueNames: { a: "litros", b: "km", c: "litros" },
    resultName: "km",
    timeValue: null,
    explanation: (values: any) => `
1. Identificação das Grandezas: Combustível (litros) e Distância (km).
2. Análise da Proporção: Com mais combustível, o carro percorrerá uma distância maior. São grandezas DIRETAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} litros -> ${values.b} km
   ${values.c} litros -> x km
   
   ${values.a}/ ${values.c} = ${values.b}/x
   ${values.a} * x = ${values.c} * ${values.b}
   x = (${values.c} * ${values.b}) / ${values.a}
   x = ${values.result} km
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
1. Identificação das Grandezas: Operários e Dias.
2. Análise da Proporção: Se aumentarmos o número de operários, o tempo necessário (dias) para terminar o mesmo muro diminuirá. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} operários -> ${values.b} dias
   ${values.c} operários -> x dias
   
   Como é inversa, invertemos uma das razões ou multiplicamos em linha:
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template: "{a} torneiras enchem um tanque em {b} horas. Em quanto tempo {c} torneiras encherão o mesmo tanque?",
    valueNames: { a: "torneiras", b: "horas", c: "torneiras" },
    resultName: "horas",
    timeValue: null,
    explanation: (values: any) => `
1. Identificação das Grandezas: Torneiras e Horas.
2. Análise da Proporção: Mais torneiras abertas encherão o tanque em menos tempo. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} torneiras -> ${values.b} horas
   ${values.c} torneiras -> x horas
   
   Multiplicando em linha (inversa):
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
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
1. Identificação das Grandezas: Pessoas e Horas.
2. Análise da Proporção: Aumentando a equipe, o tempo para realizar o mesmo trabalho diminui. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} pessoas -> ${values.b} horas
   ${values.c} pessoas -> x horas
   
   Multiplicando em linha (inversa):
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
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
1. Identificação das Grandezas: Velocidade (km/h) e Tempo (horas).
2. Análise da Proporção: Se o carro for mais rápido (maior velocidade), ele levará menos tempo para percorrer a mesma distância. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} km/h -> ${values.b} horas
   ${values.c} km/h -> x horas
   
   Multiplicando em linha (inversa):
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Com uma velocidade de {a} m/min, um atleta completa uma pista em {b} segundos. Se ele correr a {c} m/min, em quanto tempo completará a pista?",
    valueNames: { a: "velocidade", b: "segundos", c: "velocidade" },
    resultName: "segundos",
    timeValue: null,
    explanation: (values: any) => `
1. Identificação das Grandezas: Velocidade e Tempo.
2. Análise da Proporção: Maior velocidade resulta em menor tempo para o mesmo percurso. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} m/min -> ${values.b} s
   ${values.c} m/min -> x s
   
   Multiplicando em linha (inversa):
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
   x = ${values.result} ${values.resultName}
`,
  },
  {
    template:
      "Para ler um livro em {b} dias, preciso ler {a} páginas por dia. Se eu ler {c} páginas por dia, em quantos dias terminarei?",
    valueNames: { a: "páginas/dia", b: "dias", c: "páginas/dia" },
    resultName: "dias",
    timeValue: null,
    explanation: (values: any) => `
1. Identificação das Grandezas: Páginas por dia e Total de dias.
2. Análise da Proporção: Se eu ler mais páginas por dia, terminarei o livro em menos dias. São grandezas INVERSAMENTE proporcionais.

3. Montagem e Cálculo:
   ${values.a} pág/dia -> ${values.b} dias
   ${values.c} pág/dia -> x dias
   
   Multiplicando em linha (inversa):
   ${values.a} * ${values.b} = ${values.c} * x
   x = (${values.a} * ${values.b}) / ${values.c}
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
    if (values[key] !== null) {
      result = result.replace(`{${key}}`, values[key])
    }
  }
  return result
}

// Função para gerar opções de resposta
function generateOptions(correctAnswer: number): { value: number; label: string }[] {
  const options: { value: number; label: string }[] = [{ value: correctAnswer, label: correctAnswer.toString() }]

  // Gerar opções incorretas plausíveis
  while (options.length < 4) {
    // Variação de 10% a 30% para mais ou para menos
    const variation = correctAnswer * (getRandomInt(10, 50) / 100) * (Math.random() > 0.5 ? 1 : -1)
    const optionValue = roundToHeader(Math.max(0.1, correctAnswer + variation))

    // Verificar se a opção já existe
    if (!options.some((opt) => opt.value === optionValue)) {
      options.push({ value: optionValue, label: optionValue.toString() })
    }
  }

  // Embaralhar as opções
  return options.sort(() => Math.random() - 0.5)
}

// Função para gerar um problema de regra de três
export function generateProblem(): Problem {
  // Determinar se será regra de três direta ou inversa
  const problemType: ProportionType = Math.random() > 0.5 ? "direct" : "inverse"

  // Selecionar um cenário aleatório
  const scenarios = problemType === "direct" ? directScenarios : inverseScenarios
  const scenarioIndex = getRandomInt(0, scenarios.length - 1)
  const scenario = scenarios[scenarioIndex]

  let a, b, c, result: number

  if (problemType === "direct") {
    // a/c = b/x => x = (c*b)/a
    a = getRandomInt(2, 20)
    c = getRandomInt(2, 40)
    while (c === a) c = getRandomInt(2, 40)

    // Gerar b tal que x tenha no máximo 1 casa decimal
    // (c*b)/a = N.d => c*b = (N.d) * a
    // Para simplificar, b será um valor que resulte em algo amigável ou arredondaremos
    b = getRandomInt(5, 100)
    result = roundToHeader((c * b) / a)
  } else {
    // a*b = c*x => x = (a*b)/c
    a = getRandomInt(2, 20)
    b = getRandomInt(2, 30)
    c = getRandomInt(2, 40)
    while (c === a) c = getRandomInt(2, 40)

    result = roundToHeader((a * b) / c)
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

  // Gerar explicação detalhada
  const explanationValues = {
    ...values,
    result: result,
    resultName: scenario.resultName,
  }

  const explanation = scenario.explanation(explanationValues)

  // Gerar opções de resposta
  const options = generateOptions(result)

  // Criar o problema
  return {
    question: questionText,
    options: options,
    correctAnswer: result,
    explanation: explanation,
    type: problemType,
    values: { a, b, c, result },
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

    // Usar parseFloat para lidar com casas decimais
    if (Number.parseFloat(selectedOption) === problem.correctAnswer) {
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
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-60 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Gerando problema...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!problem) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">Erro ao carregar o problema.</p>
          <Button onClick={createNewProblem}>Tentar Novamente</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <RuleOfThreeInfo />

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between items-center text-xl sm:text-2xl">
            <span className="truncate">Desafio de Proporção</span>
            <div className="flex items-center gap-3 text-sm font-bold bg-muted p-2 rounded-full px-4">
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
          <div className="p-4 bg-muted/50 rounded-lg border border-muted select-none">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Enunciado</h3>
            <p className="text-base sm:text-lg leading-relaxed">{problem.question}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base">Escolha a alternativa correta:</h3>
            <RadioGroup
              value={selectedOption || ""}
              onValueChange={setSelectedOption}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              disabled={isAnswered}
            >
              {problem.options.map((option, index) => {
                const letters = ["A", "B", "C", "D"]
                const isCorrect = isAnswered && option.value === problem.correctAnswer
                const isSelectedAndWrong =
                  isAnswered && selectedOption === option.value.toString() && option.value !== problem.correctAnswer

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 border-2 p-4 rounded-xl transition-all cursor-pointer hover:bg-muted/30 ${
                      isCorrect ? "bg-green-50 border-green-500 ring-1 ring-green-500" : ""
                    } ${isSelectedAndWrong ? "bg-red-50 border-red-500 ring-1 ring-red-500" : ""} ${
                      !isAnswered && selectedOption === option.value.toString() ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${index}`} disabled={isAnswered} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 font-medium cursor-pointer py-1 text-base sm:text-lg"
                    >
                      <span className="mr-2 text-muted-foreground">{letters[index]})</span>
                      {option.value}
                    </Label>
                    {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {isSelectedAndWrong && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {isAnswered && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Tipo de Proporção</span>
                  <h3 className="font-bold text-lg">Regra de Três {problem.type === "direct" ? "Direta" : "Inversa"}</h3>
                </div>
                <Button variant="outline" size="sm" onClick={toggleExplanation} className="w-full sm:w-auto font-bold">
                  <Info className="h-4 w-4 mr-2" /> {showExplanation ? "Ocultar Solução" : "Ver Solução Detalhada"}
                </Button>
              </div>

              {showExplanation && (
                <div className="p-5 bg-card rounded-xl border-2 border-dashed border-muted shadow-inner">
                  <h4 className="font-bold mb-4 text-primary">Passo a Passo:</h4>
                  <div className="text-sm sm:text-base space-y-4">
                    {problem.explanation.split("\n\n").map((paragraph, i) => (
                      <div
                        key={i}
                        className={
                          paragraph.trim().match(/^[0-9]\./)
                            ? "font-bold text-foreground border-l-4 border-primary pl-3 py-1"
                            : "pl-5 text-muted-foreground"
                        }
                      >
                        {paragraph}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t text-center font-bold text-lg text-green-600">
                    Gabarito: {["A", "B", "C", "D"][problem.options.findIndex((opt) => opt.value === problem.correctAnswer)]} ({problem.correctAnswer})
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-6 border-t">
          {!isAnswered ? (
            <Button onClick={checkAnswer} disabled={!selectedOption} className="w-full sm:w-auto h-12 px-8 font-bold text-lg">
              Verificar Resposta
            </Button>
          ) : (
            <Button onClick={createNewProblem} className="w-full sm:w-auto h-12 px-8 font-bold text-lg">
              <RefreshCw className="h-5 w-5 mr-2" /> Novo Problema
            </Button>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Responda atentamente e confira a explicação se tiver dúvida!
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
