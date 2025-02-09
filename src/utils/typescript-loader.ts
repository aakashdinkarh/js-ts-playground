import { CDN_URLS } from "@constants/app";
import { __handleError } from "@utils/errorHandlerOverrides";
import { loadScript } from "@utils/script-loader";

// Track the loading state
let loadingPromise: Promise<boolean> | null = null;

export const loadTypeScriptCompiler = async () => {
  // Return true immediately if TypeScript is already loaded
  if (window.ts) {
    return true;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  try {
    // Create new loading promise
    loadingPromise = (async () => {
      try {
        await loadScript(CDN_URLS.TYPESCRIPT, {
          async: true,
          crossOrigin: 'anonymous'
        });
        return true;
      } catch (error) {
        __handleError(error);
        return false;
      } finally {
        // Clear the loading promise when done
        loadingPromise = null;
      }
    })();

    return loadingPromise;
  } catch (error) {
    __handleError(error);
    return false;
  }
};
