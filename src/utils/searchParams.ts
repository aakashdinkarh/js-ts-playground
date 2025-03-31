// Function overloads
export function getSearchParams(param: string): string | null;
export function getSearchParams(param: string[]): (string | null)[];
export function getSearchParams(param: string | string[]) {
  if (!param) return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);

    if (Array.isArray(param)) {
      const params: (string | null)[] = [];

      param.forEach(p => {
        params.push(searchParams.get(p));
      });

      return params;
    }

    return searchParams.get(param);
  } catch (error) {
    console.error('Error getting search params:', error);
    return null;
  }
}

export const removeSearchParam = (param: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.replaceState({}, '', url);
};
