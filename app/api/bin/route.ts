import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("binFile") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const scriptPath = path.join(process.cwd(), "scripts", "editBin.py");
  const bytes = await file.arrayBuffer();

  // Явно указываем тип <NextResponse> для Promise
  return new Promise<NextResponse>((resolve) => {
    // На Sevalla в Linux лучше использовать 'python3'
    const pythonProcess = spawn("python3", [scriptPath]);

    const chunks: Buffer[] = [];
    const errorChunks: Buffer[] = [];

    pythonProcess.stdin.write(Buffer.from(bytes));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (chunk) => chunks.push(chunk));
    pythonProcess.stderr.on("data", (chunk) => errorChunks.push(chunk));

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        const errorMsg = Buffer.concat(errorChunks).toString();
        console.error("Python Error:", errorMsg);
        resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
        return;
      }

      const outputBuffer = Buffer.concat(chunks);
      resolve(new NextResponse(outputBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="modified_${file.name}"`,
        },
      }));
    });
  });
}