import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("binFile") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const scriptPath = path.join(process.cwd(), "scripts", "editBin.py");
    const bytes = await file.arrayBuffer();

    return new Promise<NextResponse>((resolve) => {
      // Проверка файла
      if (!fs.existsSync(scriptPath)) {
        resolve(NextResponse.json({ error: "Python скрипт не найден на сервере" }, { status: 500 }));
        return;
      }

      // На серверах обычно python3, на Windows - python
      const command = process.platform === "win32" ? "python" : "python3";
      const pythonProcess = spawn(command, [scriptPath]);

      const chunks: Buffer[] = [];
      const errorChunks: Buffer[] = [];

      pythonProcess.stdin.write(Buffer.from(bytes));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (chunk) => chunks.push(chunk));
      pythonProcess.stderr.on("data", (chunk) => errorChunks.push(chunk));

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          const errorMsg = Buffer.concat(errorChunks).toString() || "Python error";
          resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
          return;
        }

        // ВАЖНО: Отправляем измененный файл обратно!
        const outputBuffer = Buffer.concat(chunks);
        resolve(new NextResponse(outputBuffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="modified.bin"`,
          },
        }));
      });

      pythonProcess.on("error", (err) => {
        resolve(NextResponse.json({ error: `Spawn error: ${err.message}` }, { status: 500 }));
      });
    });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}