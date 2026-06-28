type AiStubPayload = {
  prompt: string;
  context?: Record<string, unknown>;
};

type AiStubResponse = {
  status: "stub";
  message: string;
  hypotheses: string[];
};

export async function runAlbaAiStub(payload: AiStubPayload): Promise<AiStubResponse> {
  return {
    status: "stub",
    message:
      "The real AI layer is not active yet. Alba only exposes a local stub for the first sprint.",
    hypotheses: [
      `Prompt received: ${payload.prompt}`,
      "Return hypotheses, signals, and patterns to validate in future iterations.",
      "Integrate local models or private endpoints only after the privacy protocol is defined.",
    ],
  };
}
