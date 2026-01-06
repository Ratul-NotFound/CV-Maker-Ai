import { modernMeta } from './src/app/api/generate-cv/templates/modern.js';

try {
  const meta = modernMeta();
  console.log(' modernMeta works!', meta);
} catch (err) {
  console.error(' modernMeta failed:', err.message);
  console.error('Stack:', err.stack);
}
