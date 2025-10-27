"use client";
import { useState } from "react";

export default function Home() {
  interface hexToDecFunctionProps {
    hexData: string;
  }
  const [hexinput, setHexInput] = useState<string>("");
  const [result, setResult] = useState(0);

  function hexToDecFunction({ hexData }: hexToDecFunctionProps) {
    console.log("Button clicked");
    return setResult(parseInt(hexData, 16));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome
        </h1>

        <div className="total">
          <input
            type="text"
            placeholder="input hex..."
            className="input-field mb-4 p-0.5"
            value={hexinput}
            onChange={(e) => setHexInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => hexToDecFunction({ hexData: hexinput })}
            className="submit-button"
          >
            Submit
          </button>
        </div>
        {result && (
          <p className="result-text">First, result in dec system: {result}</p>
        )}
        {result && (
          <p className="result-text">
            Second, result in dec system: {result % 64}
          </p>
        )}
      </main>
    </div>
  );
}
