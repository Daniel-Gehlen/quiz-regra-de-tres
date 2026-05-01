import { describe, it, expect } from 'vitest'
import { generateProblem, roundToHeader } from './quiz-regra-de-tres'

describe('Quiz Logic', () => {
  it('should round to at most one decimal place', () => {
    expect(roundToHeader(10.555)).toBe(10.6)
    expect(roundToHeader(10)).toBe(10)
    expect(roundToHeader(10.1)).toBe(10.1)
    expect(roundToHeader(10.12)).toBe(10.1)
  })

  it('should generate a valid problem', () => {
    const problem = generateProblem()
    expect(problem).toHaveProperty('question')
    expect(problem).toHaveProperty('correctAnswer')
    expect(problem.options.length).toBe(4)
    expect(problem.options.some(opt => opt.value === problem.correctAnswer)).toBe(true)
  })

  it('should not have "direta" or "inversa" hint in the question text', () => {
    const problem = generateProblem()
    const questionLower = problem.question.toLowerCase()
    expect(questionLower).not.toContain('use regra de três direta')
    expect(questionLower).not.toContain('use regra de três inversa')
  })

  it('should calculate direct proportion correctly', () => {
    // We can't easily mock random in a simple way here without a library, 
    // but we can verify the consistency of the generated problem.
    for (let i = 0; i < 100; i++) {
      const problem = generateProblem()
      const { a, b, c, result } = problem.values
      
      if (problem.type === 'direct') {
        // a/c = b/x => x = (c*b)/a
        const expected = roundToHeader((c * b) / a)
        expect(result).toBe(expected)
      } else {
        // a*b = c*x => x = (a*b)/c
        const expected = roundToHeader((a * b) / c)
        expect(result).toBe(expected)
      }
      
      // Ensure no result has more than 1 decimal place
      const resultStr = result.toString()
      if (resultStr.includes('.')) {
        const decimals = resultStr.split('.')[1]
        expect(decimals.length).toBeLessThanOrEqual(1)
      }
    }
  })
})
