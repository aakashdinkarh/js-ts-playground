import { CDN_URLS } from "@constants/app";
import { __handleError } from "@utils/errorHandlerOverrides";
import { loadScript } from "@utils/script-loader";

export const loadTypeScriptCompiler = async () => {
  if (window.ts) {
    return true;
  }

  try {
    await loadScript(CDN_URLS.TYPESCRIPT, {
      async: true,
      crossOrigin: 'anonymous'
    });
    return true;
  } catch (error) {
    __handleError(error);
    return false;
  }
};
