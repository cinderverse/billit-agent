export function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return '';
  }

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function readOptionalJsonArgOrStdin(value?: string): Promise<unknown | undefined> {
  if (value && value !== '-') {
    return JSON.parse(value);
  }

  const stdin = await readStdin();
  if (!stdin.trim()) {
    return undefined;
  }
  return JSON.parse(stdin);
}
