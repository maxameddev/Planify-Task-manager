import type { Messages } from "@/lib/i18n";

export type SignUpField = "name" | "email" | "password";
export type SignUpFieldErrors = Partial<Record<SignUpField, string>>;

type SignUpMessages = Pick<
  Messages,
  | "nameRequired"
  | "nameValidationError"
  | "emailRequired"
  | "emailInvalid"
  | "passwordRequired"
  | "passwordSpaceError"
  | "passwordMinLength"
  | "registerError"
>;

export function validateSignUpFields(
  values: { name: string; email: string; password: string },
  text: SignUpMessages,
): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) errors.name = text.nameRequired;
  else if (name.length < 2) errors.name = text.nameValidationError;

  if (!email) errors.email = text.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = text.emailInvalid;

  if (!values.password) errors.password = text.passwordRequired;
  else if (!values.password.trim()) errors.password = text.passwordSpaceError;
  else if (values.password.length < 12) errors.password = text.passwordMinLength;

  return errors;
}

export function validateSignUpField(
  field: SignUpField,
  value: string,
  text: SignUpMessages,
): string | undefined {
  const values = { name: "Valid name", email: "valid@example.com", password: "valid-password-12" };
  values[field] = value;
  return validateSignUpFields(values, text)[field];
}

export function getSignUpErrorMessage(
  text: Pick<Messages, "registerError">,
  errorCode?: string,
) {
  void errorCode;
  return text.registerError;
}
