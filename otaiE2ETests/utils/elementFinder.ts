export function inputByName(name: string): string {
  return `//input[@name='${name}']`;
}

export function buttonByText(text: string): string {
  return `//button[text()='${text}']`;
}

export function paragraphByText(text: string): string {
  return `(//p[text()='${text}'])[1]`;
}

export function popupText(text: string): string {
  return `//div[text()='${text}']`;
}

export function sectionName(section: string): string {
  return `//*[text()='${section}']`;
}

export function itemName(section: string, item: string): string {
  return `//*[text()='${section}']/..//following-sibling::div//*[text()='${item}']`;
}

export function customersInputFields(name: string): string {
  return `//*[@name='${name}']`;
}

export function customerStats(stateName: string): string {
  return `//span[text()='${stateName}']/../../div`;
}

export function buttonByType(text: string): string {
  return `//input[@type='${text}']`;
}
