import assert from "node:assert/strict";
import test from "node:test";
import { getSignUpErrorMessage, validateSignUpFields } from "../features/auth/validation.ts";

const text = {
  nameRequired: "Please enter your name.",
  nameValidationError: "Your name must be at least 2 characters long.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  passwordRequired: "Please enter a password.",
  passwordSpaceError: "Your password cannot contain only spaces.",
  passwordMinLength: "Password must be at least 12 characters.",
  registerError: "Unable to create your account. Please check your details or try logging in.",
};

test("sign-up shows a specific inline validation message for each missing field", () => {
  assert.deepEqual(validateSignUpFields({ name: "", email: "", password: "" }, text), {
    name: text.nameRequired,
    email: text.emailRequired,
    password: text.passwordRequired,
  });
});

test("sign-up rejects malformed emails and passwords shorter than twelve characters", () => {
  assert.deepEqual(validateSignUpFields({ name: "Ayaan", email: "not-an-email", password: "short-pass" }, text), {
    email: text.emailInvalid,
    password: text.passwordMinLength,
  });
});

test("sign-up accepts valid field values after trimming the name and email", () => {
  assert.deepEqual(validateSignUpFields({ name: " Ayaan ", email: " ayaan@example.com ", password: "long-password-12" }, text), {});
});

test("registered-email and other sign-up server errors use the same neutral response", () => {
  assert.equal(getSignUpErrorMessage(text, "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"), text.registerError);
  assert.equal(getSignUpErrorMessage(text, "INTERNAL_ERROR"), text.registerError);
});
