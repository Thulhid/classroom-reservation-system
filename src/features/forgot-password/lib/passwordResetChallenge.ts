import "server-only";

import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

const RESET_PIN_TTL_MS = 10 * 60 * 1000;

type PasswordResetChallengePayload = {
  userId: string;
  pinHash: string;
  nonce: string;
  expiresAt: number;
  issuedAt: number;
};

export class PasswordResetChallengeError extends Error {
  constructor(message = "Invalid or expired reset PIN.") {
    super(message);
  }
}

function getChallengeSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required.");
  }

  return secret;
}

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeJson<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function signValue(value: string) {
  return createHmac("sha256", getChallengeSecret())
    .update(value)
    .digest("base64url");
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function hashPin(pin: string, nonce: string) {
  return createHmac("sha256", getChallengeSecret())
    .update(`${nonce}:${pin}`)
    .digest("hex");
}

function assertChallengePayload(
  value: Partial<PasswordResetChallengePayload>,
): asserts value is PasswordResetChallengePayload {
  if (
    typeof value.userId !== "string" ||
    typeof value.pinHash !== "string" ||
    typeof value.nonce !== "string" ||
    typeof value.expiresAt !== "number" ||
    typeof value.issuedAt !== "number"
  ) {
    throw new PasswordResetChallengeError();
  }
}

export function createResetPin() {
  return randomInt(100000, 1000000).toString();
}

export function createPasswordResetChallenge(userId: string, pin: string) {
  const nonce = randomBytes(16).toString("base64url");
  const payload: PasswordResetChallengePayload = {
    userId,
    nonce,
    pinHash: hashPin(pin, nonce),
    issuedAt: Date.now(),
    expiresAt: Date.now() + RESET_PIN_TTL_MS,
  };
  const encodedPayload = encodeJson(payload);

  return `${encodedPayload}.${signValue(encodedPayload)}`;
}

export function verifyPasswordResetChallenge(token: string, pin: string) {
  const [encodedPayload, signature] = token.split(".");

  if (
    !encodedPayload ||
    !signature ||
    !safeEquals(signValue(encodedPayload), signature)
  ) {
    throw new PasswordResetChallengeError();
  }

  let payload: Partial<PasswordResetChallengePayload>;

  try {
    payload = decodeJson<Partial<PasswordResetChallengePayload>>(
      encodedPayload,
    );
  } catch {
    throw new PasswordResetChallengeError();
  }

  assertChallengePayload(payload);

  if (payload.expiresAt < Date.now()) {
    throw new PasswordResetChallengeError("Reset PIN has expired.");
  }

  if (!safeEquals(hashPin(pin, payload.nonce), payload.pinHash)) {
    throw new PasswordResetChallengeError();
  }

  return {
    userId: payload.userId,
  };
}

export function isPasswordResetChallengeError(error: unknown) {
  return error instanceof PasswordResetChallengeError;
}
