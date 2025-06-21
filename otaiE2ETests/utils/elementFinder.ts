export function inputByName(name: string): string {
  return `//input[@name='${name}']`;
}

export function buttonByText(text: string): string {
  return `//button[text()='${text}']`;
}

export function paragraphByText(text: string): string {
  return `(//p[text()='${text}'])[1]`;
}