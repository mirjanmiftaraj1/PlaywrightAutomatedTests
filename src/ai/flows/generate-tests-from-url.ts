'use server';
/**
 * @fileOverview Generates Playwright tests from a product page URL.
 *
 * - generateTestsFromUrl - A function that generates Playwright tests from a URL.
 * - GenerateTestsFromUrlInput - The input type for the generateTestsFromUrl function.
 * - GenerateTestsFromUrlOutput - The return type for the generateTestsFromUrl function.
 */

import {ai} from '@/ai/ai-instance';
import {scanPage, PageContent} from '@/services/page-scanner';
import {z} from 'genkit';

const GenerateTestsFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the product page to scan.'),
  numTests: z.number().int().min(1).max(10).default(3).describe('The number of tests to generate.'),
});
export type GenerateTestsFromUrlInput = z.infer<typeof GenerateTestsFromUrlInputSchema>;

const GenerateTestsFromUrlOutputSchema = z.object({
  tests: z.array(z.string()).describe('The generated Playwright tests as an array of strings.'),
});
export type GenerateTestsFromUrlOutput = z.infer<typeof GenerateTestsFromUrlOutputSchema>;

export async function generateTestsFromUrl(input: GenerateTestsFromUrlInput): Promise<GenerateTestsFromUrlOutput> {
  return generateTestsFromUrlFlow(input);
}

const generateTestsPrompt = ai.definePrompt({
  name: 'generateTestsPrompt',
  input: {
    schema: z.object({
      productPageContent: z.string().describe('The content of the product page.'),
      productPageTitle: z.string().describe('The title of the product page.'),
      numTests: z.number().int().min(1).max(10).default(3).describe('The number of tests to generate.'),
    }),
  },
  output: {
    schema: z.object({
      tests: z.array(z.string()).describe('The generated Playwright tests as an array of strings.'),
    }),
  },
  prompt: `You are an expert Playwright test generator.  You will be given the content of a product page, and you will generate Playwright tests that cover the key functionalities of that page. You should generate {{{numTests}}} tests.

Here is the product page content:
Title: {{{productPageTitle}}}
Content: {{{productPageContent}}}

Ensure that the generated tests are complete and executable. The tests should cover all key functionalities of the page. Return the tests as a JSON array of strings.
`,
});

const generateTestsFromUrlFlow = ai.defineFlow<
  typeof GenerateTestsFromUrlInputSchema,
  typeof GenerateTestsFromUrlOutputSchema
>({
  name: 'generateTestsFromUrlFlow',
  inputSchema: GenerateTestsFromUrlInputSchema,
  outputSchema: GenerateTestsFromUrlOutputSchema,
},
async input => {
  const pageContent: PageContent = await scanPage(input.url);

  const {output} = await generateTestsPrompt({
    productPageContent: pageContent.content,
    productPageTitle: pageContent.title,
    numTests: input.numTests,
  });
  return output!;
});
