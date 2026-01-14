"use client";
import { useState } from "react";

export default function ScriptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleGo = async () => {
    if (!file) return alert(" выбери файл!");

    setStatus("Обработка...");
    const formData = new FormData();
    formData.append("binFile", file);

    try {
      const response = await fetch("/api/bin", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка сервера");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `modified_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus("Файл успешно обработан и скачан!");
    } catch (error) {
      setStatus(`Ошибка: ${error}`);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Hello</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2"
      />
      <button
        onClick={handleGo}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-fit"
      >
        GO (Запустить Python)
      </button>
      <p className="mt-4 font-mono text-sm">{status}</p>
    </div>
  );
}
