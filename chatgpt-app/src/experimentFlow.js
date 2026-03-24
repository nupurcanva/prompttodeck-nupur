/**
 * UX exploration flags — experimentation branch.
 * 1) Default-selected design on first entry (recency / top result mock)
 * 2) Prefill search from user prompt (lower-risk than auto-select alone)
 * 3) Slide selection inside preview (collapse separate choose-slides step)
 * 4) Auto-select slides + override (lighter: CDA mock, user adjusts in preview)
 * 5) Unified Brand templates + Recent designs in one widget
 * 6) Flatter transitions — breadcrumb / message labels vs deep nesting feel
 * 7) Selected design visible earlier (hero above search)
 */
export const EXP = {
  defaultSelectedFirstEntry: true,
  prefillSearchFromPrompt: true,
  slideSelectionInPreview: true,
  autoSelectSlidesOverride: true,
  unifiedTemplateView: true,
  flatWidgetTransitions: true,
  earlyDesignHero: true,
}

/** Short search string from free text (mock LLM → search prefill). */
export function searchPrefillFromPrompt(text) {
  if (!text || !text.trim()) return ''
  const t = text.trim()
  const stop = new Set(['a', 'an', 'the', 'for', 'with', 'from', 'and', 'or', 'to', 'in', 'on', 'my', 'use', 'create', 'deck', 'presentation'])
  const words = t.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stop.has(w.replace(/[^a-z0-9]/g, '')))
  return words.slice(0, 4).join(' ') || t.slice(0, 40)
}
