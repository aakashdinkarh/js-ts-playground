import type { CodeSessionResponse } from 'types/session';

const CENTRAL_SERVER_BASE_URL = 'https://central-server-app.vercel.app';

const codeSessionApiUrl = `${CENTRAL_SERVER_BASE_URL}/api/code`;

const makeApiRequest = async (
  method: string,
  body: Record<string, unknown>
) => {
  const response = await fetch(codeSessionApiUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

const handleApiError = (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : 'Something went wrong! Try again.';

  return {
    error: errorMessage,
    id: null,
  };
};

const getCodeSessionData = async (sessionId: string) => {
  try {
    const { data }: CodeSessionResponse = await makeApiRequest('GET', {
      id: sessionId,
    });

    return {
      error: null,
      id: data.id,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

const createCodeSession = async (code: string, language: string) => {
  try {
    const { data }: CodeSessionResponse = await makeApiRequest('POST', {
      code,
      language,
    });

    return {
      error: null,
      id: data.id,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

const updateCodeSession = async (
  sessionId: string,
  code: string,
  language: string
) => {
  try {
    const { data }: CodeSessionResponse = await makeApiRequest('PATCH', {
      id: sessionId,
      code,
      language,
    });

    return {
      error: null,
      id: data.id,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export { getCodeSessionData, createCodeSession, updateCodeSession };
