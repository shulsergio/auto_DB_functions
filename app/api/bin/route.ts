import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("binFile") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "editBin.py");
    const bytes = await file.arrayBuffer();

    return new Promise((resolve) => { 
      const pythonProcess = spawn("python", [scriptPath]);

      const chunks: Buffer[] = [];
      const errorChunks: Buffer[] = [];
 
      pythonProcess.stdin.write(Buffer.from(bytes));
      pythonProcess.stdin.end();
      pythonProcess.stdout.on("data", (chunk) => {
        chunks.push(chunk);
      });
 
      pythonProcess.stderr.on("data", (chunk) => {
        errorChunks.push(chunk);
        console.error("Python Log:", chunk.toString());
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          const errorMsg = Buffer.concat(errorChunks).toString();
          resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
          return;
        }
 
        const modifiedFileBuffer = Buffer.concat(chunks);
 
        resolve(new NextResponse(modifiedFileBuffer, {
          headers: {
            "Content-Type": "application/octet-stream", 
            "Content-Disposition": `attachment; filename="modified_${file.name}"`,
          },
        }));
      });
    });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка сервера" +e}, { status: 500 });
  }
}