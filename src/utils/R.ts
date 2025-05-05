import { WebR } from 'webr';

export const getWebR = async () => {
  const r = new WebR({ baseUrl: 'https://webr.r-wasm.org/latest/' });
  await r.init();
  await r.installPackages(['PBSddesolve', 'escape2024', 'jsonlite'], {
    repos: ['https://jgf5013.r-universe.dev', 'https://r-forge.r-universe.dev', 'https://karlines.r-universe.dev', 'https://repo.r-wasm.org'],
    quiet: false,
  });
  return r;
};