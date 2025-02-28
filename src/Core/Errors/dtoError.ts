interface ErrorItem {
  property: string;
  constraints?: { [key: string]: string };
}

export function formatErrors(errors: ErrorItem[]): string {
  return errors
    .map((item) => {
      const message = item.constraints
        ? Object.values(item.constraints).join(", ")
        : "";
      return `${item.property}: ${message}`;
    })
    .join(" | ");
}
