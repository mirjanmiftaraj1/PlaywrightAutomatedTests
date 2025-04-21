// use server'
'use server';
/**
 * @fileOverview A test prioritization AI agent.
 *
 * - prioritizeTests - A function that handles the test prioritization process.
 * - PrioritizeTestsInput - The input type for the prioritizeTests function.
 * - PrioritizeTestsOutput - The return type for the prioritizeTests function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PrioritizeTestsInputSchema = z.object({
  tests: z
    .array(z.string())
    .describe('An array of generated test cases in Playwright format.'),
  codeChanges: z.string().describe('A description of the recent code changes.'),
  userBehaviorSimulation: z
    .string()
    .describe('A description of the simulated user behavior.'),
});
export type PrioritizeTestsInput = z.infer<typeof PrioritizeTestsInputSchema>;

const PrioritizeTestsOutputSchema = z.object({
  prioritizedTests: z
    .array(z.string())
    .describe('An array of prioritized test cases.'),
  reasoning: z.string().describe('The reasoning behind the prioritization.'),
});
export type PrioritizeTestsOutput = z.infer<typeof PrioritizeTestsOutputSchema>;

export async function prioritizeTests(input: PrioritizeTestsInput): Promise<PrioritizeTestsOutput> {
  return prioritizeTestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTestsPrompt',
  input: {
    schema: z.object({
      tests: z
        .array(z.string())
        .describe('An array of generated test cases in Playwright format.'),
      codeChanges: z.string().describe('A description of the recent code changes.'),
      userBehaviorSimulation: z
        .string()
        .describe('A description of the simulated user behavior.'),
    }),
  },
  output: {
    schema: z.object({
      prioritizedTests: z
        .array(z.string())
        .describe('An array of prioritized test cases.'),
      reasoning: z.string().describe('The reasoning behind the prioritization.'),
    }),
  },
  prompt: `You are an AI expert in test prioritization.

  Given the following generated Playwright tests, code changes, and user behavior simulation, prioritize a subset of the tests (50-60 tests) that are most critical to ensure application stability and functionality.

  Tests:
  {{#each tests}}
  - {{{this}}}
  {{/each}}

  Code Changes: {{{codeChanges}}}

  User Behavior Simulation: {{{userBehaviorSimulation}}}

  Return the prioritized tests and the reasoning behind the prioritization.
  `,
});

const prioritizeTestsFlow = ai.defineFlow<
  typeof PrioritizeTestsInputSchema,
  typeof PrioritizeTestsOutputSchema
>(
  {
    name: 'prioritizeTestsFlow',
    inputSchema: PrioritizeTestsInputSchema,
    outputSchema: PrioritizeTestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
