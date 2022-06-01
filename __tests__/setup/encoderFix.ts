// This file is only used in tests and overwriting the global object is
// required for these tests
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { TextEncoder } from 'node:util';

global.TextEncoder = TextEncoder;

export { default as ReactServer } from 'react-dom/server';
