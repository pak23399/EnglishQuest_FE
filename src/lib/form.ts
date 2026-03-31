export function objectToFormData(
  obj: Record<string, any>,
  form: FormData = new FormData(),
  parentKey?: string,
): FormData {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      continue;
    }

    // Trường hợp File
    if (value instanceof File) {
      form.append(formKey, value);
    }
    // Trường hợp mảng File
    else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof File
    ) {
      value.forEach((file, i) => {
        form.append(`${formKey}[${i}]`, file);
      });
    }
    // Trường hợp Date
    else if (value instanceof Date) {
      form.append(formKey, value.toISOString());
    }
    // Trường hợp object lồng nhau
    else if (typeof value === 'object' && !(value instanceof Blob)) {
      objectToFormData(value, form, formKey);
    }
    // Primitive
    else {
      form.append(formKey, String(value));
    }
  }
  return form;
}
