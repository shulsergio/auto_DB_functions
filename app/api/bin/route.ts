import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs"; //

export async function GET() {
  return NextResponse.json({ 
    status: "OK", 
    message: "Маршрут найден и работает!",
    time: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("binFile") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const scriptPath = path.join(process.cwd(), "scripts", "editBin.py");
  const bytes = await file.arrayBuffer();
 
  return new Promise<NextResponse>((resolve) => {

  if (!fs.existsSync(scriptPath)) {
  return NextResponse.json({ 
    error: `Файл скрипта не найден по пути: ${scriptPath}` 
  }, { status: 500 });
}
if (!fs.existsSync(scriptPath)) {
      console.error("Path error:", scriptPath);  
      resolve(NextResponse.json({ 
        error: `Файл скрипта не найден! Путь на сервере: ${scriptPath}` 
      }, { status: 500 }));
      return;  
    }

const pythonProcess = spawn("python3", [scriptPath]);
const versionCheck = spawn("python3", ["--version"]);
versionCheck.stdout.on("data", (d) => console.log("Python version:", d.toString()));

// const pythonProcess = spawn("python3", [scriptPath]);

const chunks: Buffer[] = [];
const errorChunks: Buffer[] = [];

pythonProcess.stdin.write(Buffer.from(bytes));
pythonProcess.stdin.end();

pythonProcess.stdout.on("data", (chunk) => chunks.push(chunk));
pythonProcess.stderr.on("data", (chunk) => {
    console.error("STDERR:", chunk.toString()); // Это должно уйти в логи Sevalla
    errorChunks.push(chunk);
});

pythonProcess.on("close", (code) => {
    if (code !== 0) {
        const errorMsg = Buffer.concat(errorChunks).toString() || "Скрипт упал с кодом " + code + " без текста ошибки";
        console.error("Full Error:", errorMsg);
        resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
        return;
    }
    // ... остальной код (отправка файла)
});

pythonProcess.on("error", (err) => {
    resolve(NextResponse.json({ error: "Не удалось запустить Python3: " + err.message }, { status: 500 }));
});
  });
}