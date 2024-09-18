# chrome-devtools-web

`chrome-devtools-web` is a simple tool that allows you to debug your website directly from the browser.

## Installation and Usage

### Running the Server

You can use either `npx` or `pnpm dlx` to run the server without installing the package globally:

```bash
npx chrome-devtools-web <url_to_debug>
```

or

```bash
pnpm dlx chrome-devtools-web <url_to_debug>
```

This will start a local server with Chrome DevTools running, and it will automatically load the URL that you pass to it.

### Global Installation

If you prefer to install the package globally, you can do so using `npm` or `pnpm`:

```bash
npm install -g chrome-devtools-web
```

or

```bash
pnpm add -g chrome-devtools-web
```

After global installation, you can start the server with the following command:

```bash
chrome-devtools-web <url_to_debug>
```

### Online Version

Alternatively, if you don’t want to run the server locally, you can visit [here](https://devtools.aruu.me/). And enter the site URL you want to debug.

## Adding the Client Script to Your Website

In order to debug your website, you’ll need to include the `chrome-devtools-web` client script. You can do this in two ways:

### 1. Using Unpkg

Add the following `<script>` tag to your website:

```jsx
<script src="https://unpkg.com/chrome-devtools-web@latest/dist/index.js"></script>
```

### 2. Installing via npm or pnpm

You can also install the `chrome-devtools-web` package and include it in your project:

```bash
npm install chrome-devtools-web
```

or

```bash
pnpm add chrome-devtools-web
```

Then, import the script in your project:

```js
import 'chrome-devtools-web/client';
```

### Optional: Enhanced Logging

For better logging, such as capturing initial loading errors, you can include this script at the beginning of the head of your website:

```js
<script>
  if (window.top !== window.self) {
    (function () {
      window.__originalMethods = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
        onerror: window.onerror,
        onunhandledrejection: window.onunhandledrejection,
      };

      console.log = function (...args) {
        window.parent.postMessage({ type: 'log', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.log(...args);
      };

      console.error = function (...args) {
        window.parent.postMessage({ type: 'error', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.error(...args);
      };

      console.warn = function (...args) {
        window.parent.postMessage({ type: 'warning', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.warn(...args);
      };

      console.info = function (...args) {
        window.parent.postMessage({ type: 'info', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.info(...args);
      };

      console.debug = function (...args) {
        window.parent.postMessage({ type: 'debug', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.debug(...args);
      };

      console.trace = function (...args) {
        window.parent.postMessage({ type: 'trace', data: args, stack: captureStackTrace() }, '*');
        window.__originalMethods.trace(...args);
      };

      window.onerror = function (message, source, lineno, colno, error) {
        window.parent.postMessage({ type: 'unhandledError', data: [message, error || 'Unknown error'], stack: captureStackTrace() }, '*');
        return false;
      };

      window.onunhandledrejection = function (event) {
        window.parent.postMessage({ type: 'unhandledRejection', data: [event.reason || 'Unhandled promise rejection'], stack: captureStackTrace() }, '*');
      };

      function captureStackTrace() {
        const error = new Error();
        if (error.stack) {
          const stackLines = error.stack.split('\n').slice(2);
          const callFrames = stackLines.map(line => {
            const match = line.match(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/);
            if (match) {
              const [_, functionName, url, lineNumber, columnNumber] = match;
              return {
                functionName,
                url,
                lineNumber: parseInt(lineNumber, 10),
                columnNumber: parseInt(columnNumber, 10),
              };
            }
            return {
              functionName: line.trim(),
              lineNumber: -1,
            };
          });
          return { callFrames };
        }
        return { callFrames: [] };
      }
    })();
  }

  document.currentScript.remove();
</script>
```

## Credits

This project is based on the [Chrome DevTools Frontend](https://chromium.googlesource.com/devtools/devtools-frontend/) and [Chobitsu](https://github.com/liriliri/chobitsu/).
