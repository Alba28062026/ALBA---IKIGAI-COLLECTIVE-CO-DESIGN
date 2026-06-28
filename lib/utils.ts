export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function computeGap(currentLevel: number, desiredLevel: number) {
  return desiredLevel - currentLevel;
}

export function computeActivationNeed(
  currentLevel: number,
  desiredLevel: number,
  priority: number,
) {
  return Math.max(0, computeGap(currentLevel, desiredLevel)) * priority;
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function formatBandLabel(
  band: "expressed" | "latent" | "strategic",
  locale: "it" | "en" = "en",
) {
  const labels = {
    en: {
      expressed: "Expressed",
      latent: "Latent",
      strategic: "Strategic",
    },
    it: {
      expressed: "Espresse",
      latent: "Latenti",
      strategic: "Strategiche",
    },
  };

  return labels[locale][band];
}
