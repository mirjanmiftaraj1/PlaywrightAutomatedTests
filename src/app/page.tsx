'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {generateTestsFromUrl} from '@/ai/flows/generate-tests-from-url';
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";

export default function Home() {
  const [url, setUrl] = useState('');
  const [numTests, setNumTests] = useState(3);
  const [generatedTests, setGeneratedTests] = useState<string[] | null>(null);

  const handleGenerateTests = async () => {
    if (url) {
      const result = await generateTestsFromUrl({url, numTests});
      setGeneratedTests(result.tests);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Playwright Automated Tests</CardTitle>
          <CardDescription>Automated Test Generation and Management</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to TestGenius! This application automates the creation, refinement, and maintenance of tests at scale.</p>
          <div className="mt-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="url">URL</Label>
              <Input
                type="url"
                id="url"
                placeholder="Enter URL to generate tests"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
              <Label htmlFor="numTests">Number of Tests</Label>
              <Input
                type="number"
                id="numTests"
                placeholder="Enter number of tests to generate"
                value={numTests}
                onChange={(e) => setNumTests(Number(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <Button onClick={handleGenerateTests} className="mt-4">Generate Tests</Button>
          </div>
          {generatedTests && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Generated Tests:</h2>
              <ul>
                {generatedTests.map((test, index) => (
                  <li key={index} className="mb-2">
                    <pre className="whitespace-pre-wrap">{test}</pre>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
          &copy; Copyright {currentYear} - Contact <a href="https://www.linkedin.com/company/deepdiveaico/" className="text-blue-500 hover:underline" target="_blank">deepdive.ai</a>
      </div>
    </div>
  );
}


