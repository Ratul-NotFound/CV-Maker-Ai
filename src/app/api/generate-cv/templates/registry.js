import { generateModern, modernMeta } from './modern';
import { generateEuropass, europassMeta } from './europass';
import { generateScopus, scopusMeta } from './scopus';
import { generateCreative, creativeMeta } from './creative';
import { generateExecutive, executiveMeta } from './executive';
import { renderTemplate as renderBase } from './base';

const BASE_TOTAL = 4;
const baseMeta = () => ({ archetype: 'base', total: BASE_TOTAL });
const generateBase = (data, industry = 'technology', templateId = 1) =>
  renderBase(data, industry, templateId, 'base', BASE_TOTAL);

const REGISTRY = {
  modern: { render: generateModern, meta: modernMeta() },
  europass: { render: generateEuropass, meta: europassMeta() },
  scopus: { render: generateScopus, meta: scopusMeta() },
  creative: { render: generateCreative, meta: creativeMeta() },
  executive: { render: generateExecutive, meta: executiveMeta() },
  base: { render: generateBase, meta: baseMeta() },
};

export function getTemplate(archetype = 'modern') {
  const key = (archetype || 'modern').toLowerCase();
  return REGISTRY[key] || REGISTRY.modern;
}

export function getMeta(archetype = 'modern') {
  return getTemplate(archetype).meta;
}

export function listArchetypes() {
  return Object.entries(REGISTRY).map(([key, value]) => ({
    archetype: key,
    total: value.meta.total
  }));
}
