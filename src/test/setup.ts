if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom reports an unfocused document, which makes `useWindowFocus` start false.
if (typeof document !== 'undefined' && !document.hasFocus()) {
  Object.defineProperty(document, 'hasFocus', {
    configurable: true,
    value: () => true,
  })
}
