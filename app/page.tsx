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
    <div className="flex h-screenitems-center justify-center bg-gray-100 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col gap-3 items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="flex w-full justify-center font-extrabold text-gray-800 dark:text-white sm:text-5xl">
          Welcome
        </h1>

        <div>
          <input
            type="text"
            placeholder="input hex..."
            className="input-field hover:border-blue-600 p-2 max-w-36 bg-gray-50 border border-gray-500 focus:outline-none focus:border-blue-400 focus:bg-blue-50 text-black ml-2"
            value={hexinput}
            onChange={(e) => setHexInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => hexToDecFunction({ hexData: hexinput })}
            className="p-2 border-2 border-blue-200 hover:border-blue-600 focus:outline-none  focus:border-blue-200  bg-blue-100 text-blue-950 ml-2"
          >
            Submit
          </button>
        </div>
        {result && (
          <p className="result-text p-0.5">Результат в системе dec: {result}</p>
        )}
        {result && (
          <p className="result-text p-0.5">Остаток от деления: {result % 64}</p>
        )}
        {result % 64 > 0 && (
          <p className="result-text p-0.5">Не делится без остатка</p>
        )}
      </main>
    </div>
  );
}
