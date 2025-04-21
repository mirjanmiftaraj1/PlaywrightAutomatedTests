'use server';
/**
 * @fileOverview Analyzes test results using AI to detect issues and suggest potential fixes.
 *
 * - analyzeTestResults - A function that handles the test result analysis process.
 * - AnalyzeTestResultsInput - The input type for the analyzeTestResults function.
 * - AnalyzeTestResultsOutput - The return type for the analyzeTestResults function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeTestResultsInputSchema = z.object({
  testResults: z.string().describe('The test results to analyze.'),
  codeContext: z.string().describe('The relevant code context for the test results.'),
});
export type AnalyzeTestResultsInput = z.infer<typeof AnalyzeTestResultsInputSchema>;

const AnalyzeTestResultsOutputSchema = z.object({
  issuesDetected: z.boolean().describe('Whether issues were detected in the test results.'),
  issueDescription: z.string().describe('A description of the issues detected, if any.'),
  suggestedFixes: z.string().describe('Suggested fixes for the detected issues, if any.'),
});
export type AnalyzeTestResultsOutput = z.infer<typeof AnalyzeTestResultsOutputSchema>;

export async function analyzeTestResults(input: AnalyzeTestResultsInput): Promise<AnalyzeTestResultsOutput> {
  return analyzeTestResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTestResultsPrompt',
  input: {
    schema: z.object({
      testResults: z.string().describe('The test results to analyze.'),
      codeContext: z.string().describe('The relevant code context for the test results.'),
    }),
  },
  output: {
    schema: z.object({
      issuesDetected: z.boolean().describe('Whether issues were detected in the test results.'),
      issueDescription: z.string().describe('A description of the issues detected, if any.'),
      suggestedFixes: z.string().describe('Suggested fixes for the detected issues, if any.'),
    }),
  },
  prompt: `You are an AI expert in analyzing test results and suggesting fixes.

You will be provided with test results and the relevant code context. Your goal is to detect issues, describe them, and suggest potential fixes.

Test Results:
{{testResults}}

Code Context:
{{codeContext}}

Based on the information above, determine if there are any issues. If so, provide a description of the issues and suggest potential fixes. If there are no issues, indicate that no issues were detected.
`,
});

const analyzeTestResultsFlow = ai.defineFlow<
  typeof AnalyzeTestResultsInputSchema,
  typeof AnalyzeTestResultsOutputSchema
>(
  {
    name: 'analyzeTestResultsFlow',
    inputSchema: AnalyzeTestResultsInputSchema,
    outputSchema: AnalyzeTestResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
