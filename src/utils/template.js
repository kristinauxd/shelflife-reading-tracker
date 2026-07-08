export function fillTemplate(template, values = {}) {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.replaceAll(`{{${key}}}`, String(value ?? '')),
    template,
  );
}