export const isDesktop = () =>
  globalThis.matchMedia("(min-width: 1024px)").matches;
