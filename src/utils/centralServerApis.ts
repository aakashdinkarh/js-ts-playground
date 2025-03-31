import { APP_CONSTANTS } from '@constants/app';
import type { CodeSessionResponse } from 'types/session';

const makeApiRequest = async (
  method: string,
  body: Record<string, unknown>
) => {
  const response = await fetch(APP_CONSTANTS.CODE_SESSION_API_URL, {
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
      code: data.code,
      language: data.language,
      createdAt: new Date(data.createdAt).getTime(),
      lastModified: new Date(data.updatedAt).getTime(),
    };
  } catch (error) {
    return {
      ...handleApiError(error),
      code: APP_CONSTANTS.FETCHING_FAILED_CODE_MESSAGE,
    };
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
