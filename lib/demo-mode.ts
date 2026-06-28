function readBooleanFlag(value: string | undefined, defaultValue: boolean) {
  if (!value) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

export const publicSharedDemoMode = readBooleanFlag(
  process.env.NEXT_PUBLIC_ALBA_PUBLIC_DEMO,
  false,
);

export const blankDemoMode = readBooleanFlag(
  process.env.NEXT_PUBLIC_ALBA_BLANK_DEMO,
  true,
);

export function isPublicSharedDemo() {
  return publicSharedDemoMode;
}

export function isBlankDemoMode() {
  return blankDemoMode || publicSharedDemoMode;
}
