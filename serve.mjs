// Compatibility entry point: the preview now needs the server-side AI routes.
process.argv = [process.execPath, 'scripts/run-framework.mjs', 'dev', '--hostname', '127.0.0.1', '--port', '4173'];
await import('./scripts/run-framework.mjs');
