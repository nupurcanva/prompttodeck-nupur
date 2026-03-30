import { useState, useEffect, useRef, useLayoutEffect, useId } from 'react'
import './App.css'

/**
 * Shared Canva widget handoff: pulsing dot + status text that steps through {@link CANVA_WIDGET_LOAD_MESSAGES},
 * then the thread swaps in the real widget. Use {@link CANVA_WIDGET_LOAD_TOTAL_MS} with runAfterSecondaryLoad.
 */
const CANVA_WIDGET_LOAD_MESSAGES = ['Calling the tool', 'Called the tool', 'Talked to Canva']
const CANVA_WIDGET_LOAD_PHASE_MS = 850
const CANVA_WIDGET_LOAD_TOTAL_MS = CANVA_WIDGET_LOAD_PHASE_MS * CANVA_WIDGET_LOAD_MESSAGES.length
const WIZARD_CONTENT_OPTIONS = [
  {
    value: 'preserve-chat',
    label: 'Preserve content',
    menuTitle: 'Preserve content',
    menuDescription: 'Use this chat conversation as-is',
  },
  {
    value: 'generate-outline',
    label: 'Generate outline',
    menuTitle: 'Generate outline',
    menuDescription: 'Review content before generating',
  },
]

/** When "Start fresh" — how brand/style is applied (Prompt-to-Deck scratch flow) */
const WIZARD_SCRATCH_STYLE_OPTIONS = [
  { value: 'no-style-preference', label: 'No style preference' },
  { value: 'select-style', label: 'Select a Style' },
  { value: 'apply-brand', label: 'Apply Brand' },
  { value: 'reference-design', label: 'Reference an existing design' },
]

/** Guided presentation workflow — style thumbnails (Figma 811:11802) */
const WIZARD_STYLE_CARD_ROWS = [
  [
    { id: 'minimalist', label: 'Minimalist', img1: '/figma-assets/39b353c0d626287203a3c8b4bbda43c3f9d42798.png', img2: '/figma-assets/83631a4ea4104a3084b9ef24a1c375e46a6f17a4.png' },
    { id: 'playful', label: 'Playful', img1: '/figma-assets/8857266ec56022d36fa6e514fceb6633ad926fa1.png', img2: '/figma-assets/8e784c2d3ac2d4ee3bed5c66e45c43ce9a83413b.png' },
    { id: 'organic', label: 'Organic', img1: '/figma-assets/8cccdbc5c30b1f6c3704bf0b482d343bb35c0529.png', img2: '/figma-assets/0c87ef390c74d0f1cd5815abafea49d01ec3158d.png' },
    { id: 'modular', label: 'Modular', img1: '/figma-assets/c0d4f9ccf4d88e46dbf31de5de984e35303a929a.png', img2: '/figma-assets/3346061c861059292f06338d9efb47cf9a6e2db0.png' },
  ],
  [
    { id: 'elegant', label: 'Elegant', img1: '/figma-assets/c5e3ff1d3bda698b2f58f5614fdf51faeacaf58d.png', img2: '/figma-assets/94dcac9b39edae527c8cc5fffd6162371a0a2053.png' },
    { id: 'digital', label: 'Digital', img1: '/figma-assets/4b6920a78218229fbc302736dffe68cd2826b167.png', img2: '/figma-assets/c574450832e234e9d26a43f16e3cb96e27ecb19f.png' },
    { id: 'geometric', label: 'Geometric', img1: '/figma-assets/6b4dad088a58c9a30c533cdf562f9961afeba270.png', img2: '/figma-assets/ad8814daa1713ab187151f6e2f16f119cadbe0ff.png' },
    { id: 'surprise-me', label: 'Surprise me', surprise: true },
  ],
]

const WIZARD_STYLE_CARDS_FLAT = WIZARD_STYLE_CARD_ROWS.flat()

/** Style strip order in Widget 1 — Figma Prompt-to-Deck sales 1390:75492 */
const WIZARD_WIDGET1_STYLE_ORDER_IDS = [
  'minimalist',
  'playful',
  'organic',
  'geometric',
  'modular',
  'elegant',
  'digital',
  'surprise-me',
]

const WIZARD_WIDGET1_STYLE_CARDS_ORDERED = WIZARD_WIDGET1_STYLE_ORDER_IDS.map((id) =>
  WIZARD_STYLE_CARDS_FLAT.find((c) => c.id === id)
).filter(Boolean)

/** Brand kit cards (Figma 811:12755) */
const WIZARD_BRAND_KIT_CARDS = [
  {
    id: 'byte',
    label: 'Byte',
    thumbClass: 'wizard-brand-kit-thumb--byte',
    palette: ['#0122ff', '#f6f5f1', '#00ff6d', '#010002'],
    img: '/figma-assets/15bf176e152a4fa188ca16f9465422b0aa8c4101.png',
  },
  {
    id: 'buller-bread',
    label: 'Buller & Bread',
    thumbClass: 'wizard-brand-kit-thumb--buller',
    palette: ['#d1653e', '#e9c2c1', '#ffffff'],
    img: '/figma-assets/86f51f73f25bd9ce4708105fe492524057965ddb.png',
  },
  {
    id: 'hatoya',
    label: 'Hatoya',
    thumbClass: 'wizard-brand-kit-thumb--hatoya',
    palette: ['#3b5803', '#5a991b', '#81b522', '#d8ecb3'],
    img: '/figma-assets/32d512bb97236032d207ad10dbd34283f3f6fcf9.png',
  },
  {
    id: 'handcraft',
    label: 'Handcraft',
    thumbClass: 'wizard-brand-kit-thumb--handcraft',
    palette: ['#443522', '#7a3c1a', '#f2ecdf'],
    img: '/figma-assets/c66e8241e2ef31d495992d876618b6e6d6527017.png',
  },
  {
    id: 'lumina',
    label: 'Lumina',
    thumbClass: 'wizard-brand-kit-thumb--lumina',
    palette: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'],
    img: null,
  },
  {
    id: 'slate',
    label: 'Slate',
    thumbClass: 'wizard-brand-kit-thumb--slate',
    palette: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9'],
    img: null,
  },
  {
    id: 'aurora',
    label: 'Aurora',
    thumbClass: 'wizard-brand-kit-thumb--aurora',
    palette: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'],
    img: null,
  },
  {
    id: 'grove',
    label: 'Grove',
    thumbClass: 'wizard-brand-kit-thumb--grove',
    palette: ['#00b894', '#00cec9', '#55efc4', '#ffeaa7'],
    img: null,
  },
]

/** Per-kit brand templates. Buller & Bread intentionally empty to show the empty state. */
const BRAND_KIT_TEMPLATES = {
  'byte': [
    { id: 'byte-1', name: 'Byte Pitch Deck', type: 'Brand Template' },
    { id: 'byte-2', name: 'Byte All Hands', type: 'Brand Template' },
    { id: 'byte-3', name: 'Byte Product Overview', type: 'Brand Template' },
  ],
  'buller-bread': [],
  'hatoya': [
    { id: 'hatoya-1', name: 'Hatoya Brand Guidelines', type: 'Brand Template' },
    { id: 'hatoya-2', name: 'Hatoya Annual Report', type: 'Brand Template' },
  ],
  'handcraft': [
    { id: 'handcraft-1', name: 'Handcraft Portfolio', type: 'Brand Template' },
    { id: 'handcraft-2', name: 'Handcraft Proposal', type: 'Brand Template' },
  ],
  'lumina': [
    { id: 'lumina-1', name: 'Lumina Pitch Deck', type: 'Brand Template' },
    { id: 'lumina-2', name: 'Lumina Campaign Brief', type: 'Brand Template' },
  ],
  'slate': [
    { id: 'slate-1', name: 'Slate Executive Summary', type: 'Brand Template' },
    { id: 'slate-2', name: 'Slate Quarterly Review', type: 'Brand Template' },
  ],
  'aurora': [
    { id: 'aurora-1', name: 'Aurora Brand Deck', type: 'Brand Template' },
    { id: 'aurora-2', name: 'Aurora Product Launch', type: 'Brand Template' },
  ],
  'grove': [
    { id: 'grove-1', name: 'Grove Impact Report', type: 'Brand Template' },
    { id: 'grove-2', name: 'Grove Strategy Overview', type: 'Brand Template' },
  ],
}

function findStyleCardLabel(styleId) {
  for (const row of WIZARD_STYLE_CARD_ROWS) {
    const c = row.find((x) => x.id === styleId)
    if (c) return c.label
  }
  return styleId
}

function findBrandKitLabel(kitId) {
  return WIZARD_BRAND_KIT_CARDS.find((k) => k.id === kitId)?.label ?? kitId
}

const SCRATCH_OUTLINE_CONTENT_OPTIONS = [
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'extensive', label: 'Extensive' },
]

const SCRATCH_OUTLINE_LENGTH_OPTIONS = [
  { value: 'short', label: 'Short (~5 slides)' },
  { value: 'standard', label: 'Standard (~8 slides)' },
  { value: 'full', label: 'Full deck' },
]

function stubCondenseFromChat(text) {
  const t = text.trim()
  if (!t) return ''
  if (t.length <= 280) return t
  const cut = t.slice(0, 280)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

/** Custom listbox menu — solid white panel; optional two-line rows in the open menu only. */
function Widget1FigmaDropdown({
  id,
  value,
  onChange,
  options,
  placeholder,
  multiline,
  hideSecondaryOnTrigger,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)
  const showSecondarySelected =
    multiline && selected?.menuDescription && !hideSecondaryOnTrigger

  return (
    <div className="widget1-dropdown" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="widget1-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`widget1-dropdown-value${showSecondarySelected ? ' widget1-dropdown-value--twoline' : ''}`}
        >
          {selected ? (
            <>
              <span className="widget1-dropdown-value-primary">{selected.menuTitle ?? selected.label}</span>
              {showSecondarySelected ? (
                <span className="widget1-dropdown-value-secondary">{selected.menuDescription}</span>
              ) : null}
            </>
          ) : (
            <span className="widget1-dropdown-placeholder">{placeholder}</span>
          )}
        </span>
        <span className="widget1-dropdown-chevron" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open ? (
        <div className="widget1-dropdown-panel" id={listId} role="listbox" aria-labelledby={id}>
          {options.map((opt) => {
            const isSelected = value === opt.value
            const twoLine = multiline && opt.menuDescription
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`widget1-dropdown-item${twoLine ? ' widget1-dropdown-item--twoline' : ' widget1-dropdown-item--single'}${
                  isSelected ? ' widget1-dropdown-item--current' : ''
                }`}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                <span className="widget1-dropdown-item-primary">{opt.menuTitle ?? opt.label}</span>
                {twoLine ? (
                  <span className="widget1-dropdown-item-secondary">{opt.menuDescription}</span>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

/** Brand-template picker dropdown for Widget 1 reference-template row */
function Widget1TemplatePicker({ id, value, onChange, templates }) {
  const [open, setOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = templates.find((t) => String(t.id) === String(value))
  const filtered = localSearch.trim()
    ? templates.filter((t) => t.name.toLowerCase().includes(localSearch.toLowerCase()))
    : templates

  return (
    <div className="widget1-template-picker" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="widget1-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? 'widget1-dropdown-value-primary' : 'widget1-dropdown-placeholder'}>
          {selected ? selected.name : 'Select'}
        </span>
        <span className="widget1-dropdown-chevron" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open ? (
        <div className="widget1-dropdown-panel widget1-template-picker-panel">
          <div className="widget1-picker-header">
            <span className="widget1-picker-header-label">Brand Template ({templates.length})</span>
          </div>
          <div className="widget1-picker-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="widget1-picker-search-input"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search brand templates..."
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="widget1-picker-list" role="listbox">
            {filtered.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8f8f8f', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                No results for &ldquo;{localSearch}&rdquo;
              </p>
            ) : filtered.map((t) => {
              const isSelected = String(t.id) === String(value)
              return (
                <div
                  key={t.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`widget1-picker-item${isSelected ? ' widget1-picker-item--selected' : ''}`}
                  onClick={() => { onChange(String(t.id)); setOpen(false); setLocalSearch('') }}
                >
                  <div className="widget1-picker-thumb-wrap">
                    <div className="widget1-picker-thumb">
                      {t.thumb ? <img src={t.thumb} alt="" /> : null}
                    </div>
                    {isSelected && (
                      <div className="widget1-picker-thumb-badge" aria-hidden>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="widget1-picker-item-info">
                    <p className="widget1-picker-item-name">{t.name}</p>
                    <p className="widget1-picker-item-type">{t.type}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const DEFAULT_REMIX_DOCUMENT = `Deploy 2026 — Pitch Deck

Cover
Opening slide with event branding, date, and venue. Establish the Deploy 2026 identity and set the tone for the entire presentation. Event logo and tagline, date and location, presenter name and title.

Agenda
Outline the main themes so the audience knows what to expect and can follow along. Problem statement and market context, solution and product overview, product demo and key features, team traction and ask.

Problem — Market opportunity
Address the challenges and gaps in the current landscape. Articulate the pain points your target audience faces and the market opportunity that exists. Current state and pain points, market size and growth potential, why now — timing and trends, competitive landscape gaps.

Solution — Product overview
Introduce your offering and how it solves the identified problems. Position your solution clearly and differentiate from alternatives. Product vision and value proposition, core capabilities and benefits, target customer and use cases, key differentiators.

Product demo — Key features
Walk through the most important capabilities and differentiators. Show, don't tell — demonstrate how the product works in practice. Feature highlights with screenshots or mockups, user flow and key workflows, integration and ecosystem, roadmap preview.

Team — Leadership & expertise
Highlight the people behind the vision and their relevant experience. Build trust and credibility through the team's track record. Founder and key leadership bios, relevant experience and achievements, advisors and board, why this team can execute.

Traction — Metrics & milestones
Share progress, validation, and proof points to build credibility. Use concrete numbers and milestones to demonstrate momentum. Key metrics — users, revenue, growth. Customer logos and testimonials, partnerships and milestones, recognition and awards.

Ask — Next steps & call to action
Clear recommendations and what you need from the audience. Make the ask specific, actionable, and easy to say yes to. Funding amount and use of funds if applicable, partnership or pilot opportunities, next meeting or follow-up, contact information.`

function App() {
  const [prompt, setPrompt] = useState('')
  /** Step 1: natural-language capture before configuration */
  const [capturePrompt, setCapturePrompt] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState('') // Prompt user submitted - shown on next screen
  /** 1 = home capture, 3 = conversation + Canva stack */
  const [wizardStep, setWizardStep] = useState(1)
  const [contentChoice, setContentChoice] = useState('')
  /** When starting fresh: style mode from WIZARD_SCRATCH_STYLE_OPTIONS */
  const [wizardScratchStyleMode, setWizardScratchStyleMode] = useState('apply-brand')
  /** When mode is apply-brand / reference-template: which brand template (id string) */
  const [wizardReferenceTemplateId, setWizardReferenceTemplateId] = useState('byte-1')
  /** Content path “Reference a brand template” — team template to start from */
  const [wizardChosenBrandTemplateId, setWizardChosenBrandTemplateId] = useState('')
  /** Brand template used only as visual reference when mode is reference-template */
  const [scratchStyleBrandTemplate, setScratchStyleBrandTemplate] = useState(null)
  /** Mirrors wizard choice in Canva scratch widget: 'select-style' | 'brand-kit' | 'reference-template' | null */
  const [scratchStyleMode, setScratchStyleMode] = useState(null)
  /** Picked presentation style (Figma style cards) */
  const [scratchSelectedStyle, setScratchSelectedStyle] = useState(null)
  /** Picked brand kit card */
  const [scratchSelectedBrandKit, setScratchSelectedBrandKit] = useState(null)
  const [wizardSelectedStyleId, setWizardSelectedStyleId] = useState('')
  const [wizardSelectedBrandKitId, setWizardSelectedBrandKitId] = useState('byte')
  const [screen, setScreen] = useState('home') // 'home' | 'next' - ready for next screen
  const [flowStep, setFlowStep] = useState('options') // 'options' | 'create-from-existing'
  const [widgetStep, setWidgetStep] = useState('options') // 'options' | 'widget-1' | 'create-from-existing' | 'generate-from-scratch' | 'generating' | 'remix'
  const [loadedSlideCount, setLoadedSlideCount] = useState(0) // slides loaded in generating view
  const [mainPreviewUnblurred, setMainPreviewUnblurred] = useState(false)
  const [visiblePageSlotsCount, setVisiblePageSlotsCount] = useState(0) // page slots shown below (loading states)
  const [preSelectedDesign, setPreSelectedDesign] = useState(null) // legacy / outline navigation
  const [createExistingItem, setCreateExistingItem] = useState(null) // selected template or design in create-from-existing flow
  /** 'preserve' | 'condense' | 'generate-outline' — how chat content is used with the design */
  const [createExistingContentMode, setCreateExistingContentMode] = useState('preserve')
  const [createExistingPickerOpen, setCreateExistingPickerOpen] = useState(false)
  const createExistingPickerRef = useRef(null)
  /** Fallback when `submittedPrompt` is empty so Widget 1 Continue still runs (e.g. race or alternate entry). */
  const lastHomePromptRef = useRef('')
  const chatScrollRef = useRef(null)
  const canvaLatestSegmentRef = useRef(null)
  const wizardStyleCarouselRef = useRef(null)
  const wizardBrandKitCarouselRef = useRef(null)
  const [pickerSearchQuery, setPickerSearchQuery] = useState('')
  const [secondaryPanelLoading, setSecondaryPanelLoading] = useState(false)
  const [secondaryLoadPhaseIndex, setSecondaryLoadPhaseIndex] = useState(0)
  const secondaryLoadTimerRef = useRef(null)
  const SECONDARY_LOAD_MESSAGES = CANVA_WIDGET_LOAD_MESSAGES
  const SECONDARY_LOAD_PHASE_MS = CANVA_WIDGET_LOAD_PHASE_MS
  const SECONDARY_PANEL_LOAD_MS = CANVA_WIDGET_LOAD_TOTAL_MS
  const [canvaThread, setCanvaThread] = useState([{ id: 'widget-1-default', type: 'widget', variant: 'widget-1' }]) // { id, type: 'chooser' | 'widget', variant?, cfeSnapshot?, outlineToneSnap?, remixSnap? }
  const [createTab, setCreateTab] = useState('brand-template') // 'brand-template' | 'your-designs' | 'search'
  const SHOW_SEARCH_BY_URL_TAB = false // Set to true to restore Search by URL tab
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false) // true when user pressed Search or Enter
  const [searchByNameNoMatch, setSearchByNameNoMatch] = useState(false) // user asked for design by name, 0 results
  const [urlSearchQuery, setUrlSearchQuery] = useState('')
  const [previewItem, setPreviewItem] = useState(null)
  const [previewFromPicker, setPreviewFromPicker] = useState(false)
  const [noUserBrandTemplates, setNoUserBrandTemplates] = useState(false)
  const [remixItem, setRemixItem] = useState(null) // design selected for Edit with AI
  const [chooseSlidesItem, setChooseSlidesItem] = useState(null) // design for choose-slides fullscreen
  const [selectedPageIds, setSelectedPageIds] = useState(new Set()) // page IDs selected in choose-slides
  const [editDocumentFullscreenOpen, setEditDocumentFullscreenOpen] = useState(false)
  const USE_INLINE_EDIT_DOCUMENT = false // Set true to restore inline Enhance flow
  const [remixContent, setRemixContent] = useState(DEFAULT_REMIX_DOCUMENT)

  // Clear search only when user clicks a tab (not when we navigate from prompt)
  const handleTabClick = (tab) => {
    setSearchQuery('')
    setSearchSubmitted(false)
    setSearchByNameNoMatch(false)
    setCreateTab(tab)
  }
  const [urlSearchResult, setUrlSearchResult] = useState(null)
  const [outlineTone, setOutlineTone] = useState(null) // 'casual' | 'balanced' | 'playful' | null = none selected
  const [widget1TemplateSearch, setWidget1TemplateSearch] = useState('')
  const [wizardApplyBrandTab, setWizardApplyBrandTab] = useState('brand-template')
  const [scratchOutlineContent, setScratchOutlineContent] = useState('detailed')
  const [scratchOutlineLength, setScratchOutlineLength] = useState('standard')

  // Outline built out for Generate from scratch - matches Figma node 810-7610
  const generateFromScratchOutline = [
    { num: 1, title: 'Cover', desc: 'Deploy 2026 — Opening slide with event branding and key messaging.' },
    { num: 2, title: 'Agenda', desc: 'Key topics overview. Outline the main themes and structure of the presentation for the audience.' },
    { num: 3, title: 'Problem', desc: 'Market opportunity. Address the challenges and gaps in the current landscape that your solution addresses.' },
    { num: 4, title: 'Solution', desc: 'Product overview. Introduce your offering and how it solves the identified problems.' },
    { num: 5, title: 'Product demo', desc: 'Key features. Walk through the most important capabilities and differentiators of your product.' },
    { num: 6, title: 'Team', desc: 'Leadership & expertise. Highlight the people behind the vision and their relevant experience.' },
    { num: 7, title: 'Traction', desc: 'Metrics & milestones. Share progress, validation, and proof points to build credibility.' },
    { num: 8, title: 'Ask', desc: 'Next steps & call to action. Clear recommendations and what you need from the audience.' },
  ]

  const slideThumbs = [
    '/1_11-469a37db-93e8-4db4-b2d4-80a3f42cbc2d.png',
    '/2_27-8faad275-6d33-4458-8a13-03095e59b2a5.png',
    '/3_11-f9537c15-0d69-4c0b-9813-b003d87375a4.png',
    '/4_11-7dd24973-69bd-46a5-9e32-4090069af5e4.png',
    '/5_2-6c6967d6-dc40-42f3-94ba-e090d041eb7a.png',
    '/6_2-bf271a23-8671-4194-b699-1bd22e1224fe.png',
    '/9_2-ee403aef-a49b-42a9-b934-d8e6b088eb3c.png',
    '/10_2-8fd1956e-89ba-46b7-9d18-7dd891609b0d.png',
    '/11_2-596350c9-9861-48ba-8ec6-6d2b04c4ee8b.png',
    '/12_2-bea7aaf0-c97c-4a08-80fd-7c6e6a74ba72.png',
    '/13_2-8ac943e7-4348-4fb9-8d77-0beee2db9e9b.png',
    '/14_2-fbd1bd84-8cd0-4e59-be35-85597c9c2e64.png',
  ]
  const createPages = (count = 12) => Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    label: `Page ${i + 1}`,
    thumb: slideThumbs[i % slideThumbs.length]
  }))

  const brandTemplates = [
    { id: 1, name: 'OpenAI GKO Brand template', type: 'Brand template', thumb: slideThumbs[0], pages: createPages() },
    { id: 2, name: 'Partner Brand template', type: 'Brand template', thumb: slideThumbs[1], pages: createPages() },
    { id: 3, name: 'Startup Brand Kit', type: 'Brand template', thumb: slideThumbs[2], pages: createPages() },
    { id: 4, name: 'Corporate Identity', type: 'Brand template', thumb: slideThumbs[3], pages: createPages() },
    { id: 5, name: 'Creative Agency Template', type: 'Brand template', thumb: slideThumbs[4], pages: createPages() },
  ]

  const yourDesigns = [
    { id: 1, name: 'Q4 Pitch Deck', type: 'Presentation', thumb: slideThumbs[0], pages: createPages() },
    { id: 2, name: 'Brand Guidelines 2024', type: 'Document', thumb: slideThumbs[1], pages: createPages() },
    { id: 3, name: 'Marketing Banner', type: 'Social post', thumb: slideThumbs[2], pages: createPages(4) },
    { id: 4, name: 'Product Overview', type: 'Presentation', thumb: slideThumbs[3], pages: createPages() },
    { id: 5, name: 'Team Handbook', type: 'Document', thumb: slideThumbs[4], pages: createPages() },
  ]

  const allItems = [...brandTemplates, ...yourDesigns]
  const isSearching = searchSubmitted && searchQuery.trim().length > 0

  // Shared logic: process prompt for template/design request, returns { foundDesign, foundInBrandTemplates, explicitName, askedForBrandTemplate }
  const processTemplateDesignPrompt = (text) => {
    const allDesigns = [...brandTemplates, ...yourDesigns]
    let foundDesign = null
    let foundInBrandTemplates = false
    const textLower = text.toLowerCase()
    const askedForBrandTemplate = /\bbrand\s*template\b/i.test(text) || (/\btemplate\b/i.test(text) && !/\bdesign\b/i.test(text))
    const askedForDesign = /\bdesign\b/i.test(text) && !/\bbrand\s*template\b/i.test(text)

    // Extract name: prioritize "brand template" phrases so tab/counter work correctly
    const templateMatch =
      text.match(/\bbrand\s+template\s+(?:called|named)?\s*['"]?([^'",.!?\s]+(?:\s+[^'",.!?\s]+)*)['"]?/i) ||
      text.match(/use\s+(?:my\s+)?(?:the\s+)?(?:brand\s+)?(?:template|design)\s+(?:called|named)?\s*['"]?([^'",.!?\s]+(?:\s+[^'",.!?\s]+)*)['"]?/i) ||
      text.match(/(?:with|using|from)\s+(?:my\s+)?(?:brand\s+)?(?:template|design)\s+([^.,!?]+)/i) ||
      text.match(/(?:brand\s+)?template\s+(?:called|named)?\s*['"]?([^'",.!?\s]+(?:\s+[^'",.!?\s]+)*)['"]?/i) ||
      text.match(/(?:my\s+)?design\s+(?:called|named)?\s*['"]?([^'",.!?\s]+(?:\s+[^'",.!?\s]+)*)['"]?/i) ||
      text.match(/generate\s+(?:a\s+)?(?:design\s+)?using\s+(?:my\s+)?(?:brand\s+)?(?:template|design)\s+([^.,!?]+)/i) ||
      text.match(/\b(?:create|make|build|generate)\s+(?:a\s+)?(?:presentation|deck|slides?)\s+(?:with|using|from)\s+my\s+design\s+([^.,!?]+)/i)
    let explicitName = templateMatch ? templateMatch[1].trim() : null
    if (!explicitName && /\bmy\s+design\b/i.test(text)) {
      const tail = text.match(/\bmy\s+design\s+(?:called|named)?\s*['"]?([^'".,;!?]+?)(?=\s*[.,;!?]|$)/i)
      if (tail) explicitName = tail[1].trim()
    }

    if (explicitName) {
      foundDesign = allDesigns.find(t => t.name.toLowerCase().includes(explicitName.toLowerCase()))
      foundInBrandTemplates = foundDesign ? brandTemplates.some(t => t.id === foundDesign.id) : false
    }
    if (!foundDesign) {
      for (const design of allDesigns) {
        const designNameLower = design.name.toLowerCase()
        if (textLower.includes(designNameLower)) {
          foundDesign = design
          foundInBrandTemplates = brandTemplates.some(t => t.id === design.id)
          break
        }
        const keyParts = designNameLower.split(/\s+/).filter(p => p.length > 2)
        if (keyParts.filter(p => textLower.includes(p)).length >= 2) {
          foundDesign = design
          foundInBrandTemplates = brandTemplates.some(t => t.id === design.id)
          break
        }
      }
    }
    if (!foundDesign && /openai\s*gko|openai gko/i.test(text)) {
      foundDesign = brandTemplates.find(t => /openai\s*gko/i.test(t.name))
      foundInBrandTemplates = !!foundDesign
    }
    const intentUserDesign =
      askedForDesign &&
      !askedForBrandTemplate &&
      !/\bbrand\s*template\b/i.test(textLower) &&
      (/\bmy\s+design\b/.test(textLower) ||
        /\bexisting\s+design\b/.test(textLower) ||
        /\b(use|using|with|from)\s+(?:my\s+)?design\b/.test(textLower))
    return { foundDesign, foundInBrandTemplates, explicitName, askedForBrandTemplate, askedForDesign, intentUserDesign }
  }

  const handleTemplateSearch = (e) => {
    e?.preventDefault?.()
    if (searchQuery.trim()) {
      setSearchSubmitted(true)
    }
  }

  const handleSearchQueryChange = (value) => {
    setSearchQuery(value)
    if (!value.trim()) setSearchSubmitted(false)
    setSearchByNameNoMatch(false)
  }
  const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0)
  // Match if at least 1 word from the search query appears in the design/template name
  const searchResults = isSearching
    ? allItems.filter(item => {
        const nameLower = item.name.toLowerCase()
        return queryWords.some(word => nameLower.includes(word))
      })
    : []

  // Mock designs from Canva that aren't in the user's list
  const canvaOnlyDesigns = [
    { id: 'canva-1', name: 'Modern Pitch Deck', type: 'Presentation', thumb: slideThumbs[5], pages: createPages(), source: 'canva' },
    { id: 'canva-2', name: 'Creative Portfolio', type: 'Document', thumb: slideThumbs[6], pages: createPages(), source: 'canva' },
    { id: 'canva-3', name: 'Social Media Kit', type: 'Social post', thumb: slideThumbs[7], pages: createPages(6), source: 'canva' },
    { id: 'canva-4', name: 'Annual Report 2024', type: 'Document', thumb: slideThumbs[8], pages: createPages(), source: 'canva' },
    { id: 'canva-5', name: 'Product Launch Deck', type: 'Presentation', thumb: slideThumbs[9], pages: createPages(), source: 'canva' },
    { id: 'canva-6', name: 'Team Onboarding', type: 'Presentation', thumb: slideThumbs[10], pages: createPages(8), source: 'canva' },
  ]
  const existingNames = new Set(allItems.map(i => i.name.toLowerCase()))
  const canvaNewResults = isSearching
    ? canvaOnlyDesigns.filter(
        item => queryWords.some(word => item.name.toLowerCase().includes(word)) &&
        !existingNames.has(item.name.toLowerCase())
      )
    : []

  // When search has no results, add create option in the active tab (Brand template or Your designs based on user's prompt)
  const searchQueryResult = isSearching && searchResults.length === 0 && canvaNewResults.length === 0
    ? [{
        id: 'search-query-result',
        name: searchQuery.trim(),
        type: createTab === 'brand-template' ? 'Brand template' : 'Presentation',
        thumb: slideThumbs[0],
        pages: createPages(),
        source: 'search'
      }]
    : []

  // Tab-specific search results: brand templates vs your designs (canva designs go to Your designs)
  const brandTemplateSearchResults = searchResults.filter(item => brandTemplates.some(b => b.id === item.id))
  const yourDesignsSearchResults = searchResults.filter(item => yourDesigns.some(d => d.id === item.id))
  const brandTemplateSearchCount = brandTemplateSearchResults.length + (createTab === 'brand-template' ? searchQueryResult.length : 0)
  const yourDesignsSearchCount = yourDesignsSearchResults.length + canvaNewResults.length + (createTab === 'your-designs' ? searchQueryResult.length : 0)

  const brandTemplateCount = preSelectedDesign
    ? (brandTemplates.some(b => b.id === preSelectedDesign.id) ? 1 : 0)
    : (isSearching ? brandTemplateSearchCount : brandTemplates.length)
  const yourDesignsCount = preSelectedDesign
    ? (yourDesigns.some(d => d.id === preSelectedDesign.id) ? 1 : 0)
    : (isSearching ? yourDesignsSearchCount : yourDesigns.length)

  const clearSecondaryLoadTimer = () => {
    if (secondaryLoadTimerRef.current != null) {
      clearTimeout(secondaryLoadTimerRef.current)
      secondaryLoadTimerRef.current = null
    }
  }

  const scrollWizardTileCarousel = (ref) => {
    const el = ref.current
    if (!el) return
    const step = Math.min(320, Math.max(180, el.clientWidth * 0.72))
    el.scrollBy({ left: step, behavior: 'smooth' })
  }

  const newCanvaThreadId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const snapshotPreviousTailWidget = (thread) => {
    const idx = [...thread].map((e, i) => (e.type === 'widget' ? i : -1)).filter((i) => i >= 0).pop()
    if (idx == null) return thread
    const w = thread[idx]
    if (w.frozen) return thread
    const next = [...thread]
    const enriched = { ...w, frozen: true }
    if (w.variant === 'create-from-existing' && createExistingItem) {
      enriched.cfeSnapshot = { ...createExistingItem }
      enriched.cfeContentModeSnap = createExistingContentMode
    }
    if (w.variant === 'generate-from-scratch') {
      enriched.outlineToneSnap = outlineTone
      enriched.scratchContentModeSnap = w.scratchContentMode ?? createExistingContentMode
    }
    if (w.variant === 'widget-1') {
      enriched.widget1Snap = {
        designMode: wizardScratchStyleMode,
        contentChoice,
        brandTemplateChoiceId:
          contentChoice === 'reference-brand-template' ? wizardChosenBrandTemplateId : undefined,
      }
    }
    if (w.variant === 'remix' && remixItem) {
      enriched.remixSnap = {
        id: remixItem.id,
        name: remixItem.name,
        thumb: remixItem.thumb,
        type: remixItem.type,
      }
    }
    next[idx] = enriched
    return next
  }

  const runAfterSecondaryLoad = (applySecondaryWidget, { clearRemix = true } = {}) => {
    clearSecondaryLoadTimer()
    if (clearRemix) setRemixItem(null)
    setSecondaryPanelLoading(true)
    secondaryLoadTimerRef.current = window.setTimeout(() => {
      secondaryLoadTimerRef.current = null
      applySecondaryWidget()
      setSecondaryPanelLoading(false)
    }, SECONDARY_PANEL_LOAD_MS)
  }

  useEffect(() => () => clearSecondaryLoadTimer(), [])

  useEffect(() => {
    if (wizardScratchStyleMode === 'brand-kit' && wizardSelectedBrandKitId === 'none') {
      setWizardSelectedBrandKitId('')
    }
  }, [wizardScratchStyleMode, wizardSelectedBrandKitId])

  // When user switches to a different brand kit, clear the previously chosen brand template
  useEffect(() => {
    setWizardReferenceTemplateId('')
    setWizardApplyBrandTab('brand-template')
  }, [wizardSelectedBrandKitId])

  useEffect(() => {
    if (wizardStep < 3) {
      setCanvaThread([])
      setSecondaryPanelLoading(false)
      setRemixItem(null)
    }
  }, [wizardStep])

  useEffect(() => {
    const widgets = canvaThread.filter((e) => e.type === 'widget')
    const tail = widgets[widgets.length - 1]
    if (!tail) {
      if (canvaThread.some((e) => e.type === 'chooser')) setWidgetStep('options')
      return
    }
    if (tail.variant === 'generate-from-scratch') setWidgetStep('generate-from-scratch')
    else if (tail.variant === 'create-from-existing') setWidgetStep('create-from-existing')
    else if (tail.variant === 'generating') setWidgetStep('generating')
    else if (tail.variant === 'remix') setWidgetStep('remix')
    else if (tail.variant === 'widget-1') setWidgetStep('widget-1')
  }, [canvaThread])

  useEffect(() => {
    if (!secondaryPanelLoading) {
      setSecondaryLoadPhaseIndex(0)
      return
    }
    setSecondaryLoadPhaseIndex(0)
    const t1 = window.setTimeout(() => setSecondaryLoadPhaseIndex(1), SECONDARY_LOAD_PHASE_MS)
    const t2 = window.setTimeout(() => setSecondaryLoadPhaseIndex(2), SECONDARY_LOAD_PHASE_MS * 2)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [secondaryPanelLoading])

  const navigateToTemplateDesign = (text, { foundDesign, foundInBrandTemplates, explicitName, askedForBrandTemplate, askedForDesign, intentUserDesign }) => {
    const mentionedBrandTemplate = /\bbrand\s*template\b/i.test(text)
    // Detect "my design" use-case: user referenced a design (not a brand template)
    const isMyDesignPrompt = askedForDesign && !askedForBrandTemplate && !mentionedBrandTemplate
    setNoUserBrandTemplates(isMyDesignPrompt)
    // When user said "brand template X" but we found a design in your-designs (e.g. "Brand Guidelines"), respect intent: show brand-template tab with search
    const preferBrandTemplateSearch = explicitName && mentionedBrandTemplate && foundDesign && !foundInBrandTemplates
    if (foundDesign && !preferBrandTemplateSearch) {
      setPreSelectedDesign(null)
      setFlowStep('create-from-existing')
      setCanvaThread([])
      runAfterSecondaryLoad(() => {
        setCreateExistingItem(foundDesign)
        setWidgetStep('create-from-existing')
        setCanvaThread([{ id: newCanvaThreadId(), type: 'widget', variant: 'create-from-existing' }])
        // If no brand templates, force to your-designs tab
        setCreateTab(isMyDesignPrompt ? 'your-designs' : (foundInBrandTemplates ? 'brand-template' : 'your-designs'))
      }, { clearRemix: false })
    } else if (explicitName || preferBrandTemplateSearch || intentUserDesign) {
      const matchByName = explicitName
        ? allItems.find((t) => t.name.toLowerCase().includes(explicitName.toLowerCase()))
        : null
      setPreSelectedDesign(null)
      setFlowStep('create-from-existing')
      setSearchQuery('')
      setSearchSubmitted(false)
      setSearchByNameNoMatch(false)
      setCanvaThread([])
      runAfterSecondaryLoad(() => {
        setCreateExistingItem(foundDesign || matchByName || (isMyDesignPrompt || intentUserDesign ? yourDesigns[0] : brandTemplates[0]))
        setWidgetStep('create-from-existing')
        setCanvaThread([{ id: newCanvaThreadId(), type: 'widget', variant: 'create-from-existing' }])
        setCreateTab(isMyDesignPrompt || intentUserDesign ? 'your-designs' : (mentionedBrandTemplate || askedForBrandTemplate ? 'brand-template' : 'your-designs'))
        if (explicitName && !foundDesign && !matchByName && (isMyDesignPrompt || intentUserDesign)) {
          setSearchQuery(explicitName)
          setSearchSubmitted(true)
        }
      }, { clearRemix: false })
    } else {
      setPreSelectedDesign(null)
      setFlowStep('options')
      setCanvaThread([])
      runAfterSecondaryLoad(() => {
        setCanvaThread([{ id: newCanvaThreadId(), type: 'chooser' }])
      })
    }
  }

  const applyContentChoiceToState = (cc, chatText) => {
    if (cc === 'preserve-chat') {
      setCreateExistingContentMode('preserve')
      setRemixContent(chatText)
      return
    }
    if (cc === 'reference-brand-template') {
      setCreateExistingContentMode('preserve')
      setRemixContent(chatText)
      return
    }
    if (cc === 'condense-outline') {
      setCreateExistingContentMode('condense')
      setRemixContent(stubCondenseFromChat(chatText))
      return
    }
    setCreateExistingContentMode('generate-outline')
    setRemixContent(DEFAULT_REMIX_DOCUMENT)
  }

  const handleCaptureSubmit = (e) => {
    e.preventDefault()
    const text = capturePrompt.trim()
    if (!text) return
    lastHomePromptRef.current = text
    setSubmittedPrompt(text)
    setCapturePrompt('')
    setContentChoice('')
    setWizardScratchStyleMode('apply-brand')
    setWizardReferenceTemplateId('byte-1')
    setWizardChosenBrandTemplateId('')
    setScratchStyleBrandTemplate(null)
    setScratchStyleMode(null)
    setScratchSelectedStyle(null)
    setScratchSelectedBrandKit(null)
    setWizardSelectedStyleId('')
    setWizardSelectedBrandKitId('byte')
    setCreateExistingContentMode('preserve')
    setScratchOutlineContent('detailed')
    setScratchOutlineLength('standard')
    setWizardStep(3)
    setCanvaThread([])
    runAfterSecondaryLoad(() => {
      setCanvaThread([{ id: newCanvaThreadId(), type: 'widget', variant: 'widget-1' }])
    }, { clearRemix: false })
  }

  const widget1DesignIncomplete =
    !wizardScratchStyleMode ||
    (wizardScratchStyleMode === 'apply-brand' && !wizardSelectedBrandKitId) ||
    (wizardScratchStyleMode === 'select-style' && !wizardSelectedStyleId) ||
    (wizardScratchStyleMode === 'reference-design' && !wizardReferenceTemplateId)

  const widget1ContinueDisabled = widget1DesignIncomplete

  const handleWizardContinue = (contentChoiceArg) => {
    const activeContentChoice = contentChoiceArg ?? contentChoice
    const chatText = submittedPrompt.trim() || lastHomePromptRef.current.trim()
    if (!chatText || widget1DesignIncomplete) return
    setContentChoice(activeContentChoice)
    setNoUserBrandTemplates(false)
    applyContentChoiceToState(activeContentChoice, chatText)
    setWizardStep(3)
    setPreSelectedDesign(null)

    setScratchStyleMode(wizardScratchStyleMode)
    if (wizardScratchStyleMode === 'apply-brand') {
      const kitTemplates = BRAND_KIT_TEMPLATES[wizardSelectedBrandKitId] || []
      const refTemplate = kitTemplates.find(t => t.id === wizardReferenceTemplateId) ?? null
      setScratchStyleBrandTemplate(refTemplate)
      setScratchSelectedBrandKit({
        id: wizardSelectedBrandKitId,
        label: findBrandKitLabel(wizardSelectedBrandKitId),
      })
      setScratchSelectedStyle(null)
    } else if (wizardScratchStyleMode === 'select-style' && wizardSelectedStyleId) {
      setScratchSelectedStyle({
        id: wizardSelectedStyleId,
        label: findStyleCardLabel(wizardSelectedStyleId),
      })
      setScratchStyleBrandTemplate(null)
      setScratchSelectedBrandKit(null)
    } else {
      setScratchStyleBrandTemplate(null)
      setScratchSelectedStyle(null)
      setScratchSelectedBrandKit(null)
    }
    setFlowStep('options')
    setCreateExistingItem(null)

    if (activeContentChoice === 'preserve-chat') {
      runAfterSecondaryLoad(() => {
        setLoadedSlideCount(0)
        setMainPreviewUnblurred(false)
        setVisiblePageSlotsCount(0)
        setCanvaThread((t) => {
          const withSnap = snapshotPreviousTailWidget(t)
          return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'generating' }]
        })
      })
      return
    }
    if (activeContentChoice === 'generate-outline') {
      runAfterSecondaryLoad(() => {
        setCreateExistingContentMode('generate-outline')
        setRemixContent(DEFAULT_REMIX_DOCUMENT)
        setCanvaThread((t) => {
          const withSnap = snapshotPreviousTailWidget(t)
          return [
            ...withSnap,
            {
              id: newCanvaThreadId(),
              type: 'widget',
              variant: 'generate-from-scratch',
              scratchContentMode: 'generate-outline',
            },
          ]
        })
      })
      return
    }
    runAfterSecondaryLoad(() => {
      setCanvaThread((t) => {
        const withSnap = snapshotPreviousTailWidget(t)
        return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'generate-from-scratch' }]
      })
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = prompt.trim()
    if (!text) return
    lastHomePromptRef.current = text
    setSubmittedPrompt(text)
    const result = processTemplateDesignPrompt(text)
    if (result.foundDesign || result.explicitName || result.intentUserDesign) {
      navigateToTemplateDesign(text, result)
    } else {
      setScreen('next')
    }
    setPrompt('')
  }

  const handleUrlSearch = (e) => {
    e.preventDefault()
    if (urlSearchQuery.trim()) {
      setUrlSearchResult({
        id: 'url-result',
        name: `Design from ${urlSearchQuery.trim()}`,
        type: 'Presentation',
        thumb: slideThumbs[0],
        pages: createPages(),
        source: 'url'
      })
    }
  }

  const popRemixWidgetFromThread = () => {
    setRemixItem(null)
    setEditDocumentFullscreenOpen(false)
    setCanvaThread((t) => {
      const idxs = t.map((e, i) => (e.type === 'widget' && e.variant === 'remix' ? i : -1)).filter((i) => i >= 0)
      const i = idxs[idxs.length - 1]
      if (i == null) return t
      return t.slice(0, i).concat(t.slice(i + 1))
    })
  }

  const handleRemixClick = (item) => {
    setRemixItem(item)
    setPreviewItem(null)
    runAfterSecondaryLoad(() => {
      setCanvaThread((t) => {
        const withSnap = snapshotPreviousTailWidget(t)
        return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'remix' }]
      })
    }, { clearRemix: false })
  }

  const handleGenerateDesign = () => {
    const widgets = canvaThread.filter((e) => e.type === 'widget')
    const tail = widgets[widgets.length - 1]

    // Create-from-existing: "Generate outline from chat" → open the outline (scratch) step first.
    if (tail?.variant === 'create-from-existing' && createExistingContentMode === 'generate-outline') {
      const chatText = submittedPrompt.trim()
      if (chatText) applyContentChoiceToState('generate-outline', chatText)
      else {
        setCreateExistingContentMode('generate-outline')
        setRemixContent(DEFAULT_REMIX_DOCUMENT)
      }
      setFlowStep('options')
      runAfterSecondaryLoad(() => {
        setCreateExistingContentMode('generate-outline')
        setRemixContent(DEFAULT_REMIX_DOCUMENT)
        setCanvaThread((t) => {
          const withSnap = snapshotPreviousTailWidget(t)
          return [
            ...withSnap,
            {
              id: newCanvaThreadId(),
              type: 'widget',
              variant: 'generate-from-scratch',
              scratchContentMode: 'generate-outline',
            },
          ]
        })
      })
      return
    }

    // Scratch outline step (Widget 1 → outline): Generate design → live generation (same loading handoff as other widgets).
    const onScratchOutlineStep =
      tail?.variant === 'generate-from-scratch' &&
      (tail.scratchContentMode === 'generate-outline' || createExistingContentMode === 'generate-outline')
    if (onScratchOutlineStep) {
      runAfterSecondaryLoad(() => {
        setCanvaThread((t) => {
          const withSnap = snapshotPreviousTailWidget(t)
          return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'generating' }]
        })
      })
      return
    }

    clearSecondaryLoadTimer()
    setSecondaryPanelLoading(false)
    setLoadedSlideCount(0)
    setMainPreviewUnblurred(false)
    setVisiblePageSlotsCount(0)
    setCanvaThread((t) => {
      const withSnap = snapshotPreviousTailWidget(t)
      return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'generating' }]
    })
  }

  const generatingPages = remixItem?.pages || createExistingItem?.pages || createPages()

  useEffect(() => {
    if (widgetStep !== 'generating') return
    const totalSlides = generatingPages.length
    const DELAY_PURPLE_GRADIENT = 3000 // white + purple gradient for a few seconds
    const DELAY_AFTER_DESIGN_LOAD = 600 // brief pause before adding boxes
    const DELAY_BETWEEN_PAGE_SLOTS = 400 // add purple gradient box below
    const DELAY_BETWEEN_THUMBNAILS = 500 // load thumbnail into box

    let elementTimer = null
    let slotsIntervalId = null
    let thumbsIntervalId = null
    let slotsStartTimer = null
    let thumbsStartTimer = null

    // Phase 1: White + purple gradient for a few seconds, then load design on large thumbnail
    const phase1Timer = setTimeout(() => {
      setLoadedSlideCount(1)
      // Unblur the design
      elementTimer = setTimeout(() => {
        setMainPreviewUnblurred(true)
      }, 400)
      // Phase 2: Add purple gradient boxes below one by one
      slotsStartTimer = setTimeout(() => {
        setVisiblePageSlotsCount(1)
        let slots = 1
        slotsIntervalId = setInterval(() => {
          slots += 1
          setVisiblePageSlotsCount((c) => Math.min(c + 1, totalSlides))
          if (slots >= totalSlides) {
            if (slotsIntervalId) clearInterval(slotsIntervalId)
          }
        }, DELAY_BETWEEN_PAGE_SLOTS)
      }, DELAY_AFTER_DESIGN_LOAD)
      // Phase 3: Load thumbnails into boxes one by one
      thumbsStartTimer = setTimeout(() => {
        let loaded = 1
        thumbsIntervalId = setInterval(() => {
          loaded += 1
          if (loaded > totalSlides + 1) {
            if (thumbsIntervalId) clearInterval(thumbsIntervalId)
            return
          }
          setLoadedSlideCount(loaded)
        }, DELAY_BETWEEN_THUMBNAILS)
      }, DELAY_AFTER_DESIGN_LOAD + DELAY_BETWEEN_THUMBNAILS)
    }, DELAY_PURPLE_GRADIENT)

    return () => {
      clearTimeout(phase1Timer)
      if (elementTimer) clearTimeout(elementTimer)
      if (slotsStartTimer) clearTimeout(slotsStartTimer)
      if (thumbsStartTimer) clearTimeout(thumbsStartTimer)
      if (slotsIntervalId) clearInterval(slotsIntervalId)
      if (thumbsIntervalId) clearInterval(thumbsIntervalId)
    }
  }, [widgetStep, generatingPages.length])

  // Sync generating state to localStorage so Canva editor can pick it up when opened
  useEffect(() => {
    if (widgetStep === 'generating' && generatingPages.length > 0) {
      try {
        localStorage.setItem('canva-from-chatgpt', JSON.stringify({
          pages: generatingPages,
          loadedSlideCount,
          mainPreviewUnblurred,
          visiblePageSlotsCount
        }))
      } catch (_) {}
    }
  }, [widgetStep, generatingPages, loadedSlideCount, mainPreviewUnblurred, visiblePageSlotsCount])

  useEffect(() => {
    if (widgetStep !== 'create-from-existing' && widgetStep !== 'remix') setCreateExistingPickerOpen(false)
  }, [widgetStep])

  useEffect(() => {
    if (!createExistingPickerOpen) setPickerSearchQuery('')
  }, [createExistingPickerOpen])

  useEffect(() => {
    if (!createExistingPickerOpen) return
    const onPointerDown = (e) => {
      if (createExistingPickerRef.current && !createExistingPickerRef.current.contains(e.target)) {
        setCreateExistingPickerOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setCreateExistingPickerOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [createExistingPickerOpen])

  const FollowUpActions = () => (
    <div className="chatgpt-follow-up-actions">
      <button type="button" className="chatgpt-follow-up-icon" aria-label="Copy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <button type="button" className="chatgpt-follow-up-icon" aria-label="Thumbs up">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
      </button>
      <button type="button" className="chatgpt-follow-up-icon" aria-label="Thumbs down">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
      </button>
      <button type="button" className="chatgpt-follow-up-icon" aria-label="Share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      </button>
      <button type="button" className="chatgpt-follow-up-icon" aria-label="Regenerate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </button>
      <button type="button" className="chatgpt-follow-up-icon" aria-label="More">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1.25"/><circle cx="12" cy="12" r="1.25"/><circle cx="19" cy="12" r="1.25"/></svg>
      </button>
    </div>
  )

  const ChatGptFollowUp = ({ text }) => (
    <div className="chatgpt-follow-up">
      <p className="chatgpt-follow-up-text">{text}</p>
      <FollowUpActions />
    </div>
  )

  const renderCanvaWidgetLoadingBody = () => (
    <div
      className="canva-secondary-loading-chat"
      role="status"
      aria-live="polite"
      aria-label={SECONDARY_LOAD_MESSAGES[secondaryLoadPhaseIndex]}
    >
      <span className="chatgpt-loading-dot" aria-hidden />
      <span className="canva-secondary-loading-chat-message">
        {SECONDARY_LOAD_MESSAGES[secondaryLoadPhaseIndex]}
      </span>
    </div>
  )

  /** Full thread row during widget handoff: pulsing dot + cycling status only (no Canva header or action icons). */
  const renderCanvaWidgetLoadingSegment = () => (
    <div className="canva-thread-segment canva-thread-segment--latest">
      <div className="canva-tool-thread-block">{renderCanvaWidgetLoadingBody()}</div>
    </div>
  )

  const widgetEntries = canvaThread.filter((e) => e.type === 'widget')
  const lastWidgetEntry = widgetEntries[widgetEntries.length - 1]
  const lastWidgetId = lastWidgetEntry?.id
  const hasChooserInThread = canvaThread.some((e) => e.type === 'chooser')
  const chooserInteractive = hasChooserInThread && !secondaryPanelLoading && !remixItem
  const tailVariant = lastWidgetEntry?.variant
  const tailScratchContentMode = lastWidgetEntry?.scratchContentMode ?? createExistingContentMode

  const canvaFollowUpHelperText =
    tailVariant === 'widget-1'
      ? 'Choose design direction and how chat shapes content, then continue.'
      : tailVariant === 'generating'
      ? "Your design is being created. You can open it in Canva to watch it unfold."
      : tailVariant === 'remix'
        ? "Review the content and click Edit to make changes in full screen, then click Generate design."
        : tailVariant === 'generate-from-scratch'
          ? tailScratchContentMode === 'generate-outline'
            ? 'Set audience and deck length, review the outline, then click Generate design.'
            : 'Adjust Casual, Balanced, or Playful if you like, then click Generate design.'
          : tailVariant === 'create-from-existing'
            ? "Choose a template or design, set how chat content is used, then click Generate design."
            : hasChooserInThread
              ? "Choose how you'd like to get started above, or pick another option anytime."
              : "Scroll up to review earlier steps or continue below."

  const chooserFollowUpText = "Choose how you'd like to get started above, or pick another option anytime."

  const followUpForLiveWidget = (w) => {
    if (w.variant === 'widget-1') {
      return 'Choose design direction and how chat shapes content, then continue.'
    }
    if (w.variant === 'generate-from-scratch') {
      const mode = w.scratchContentMode ?? createExistingContentMode
      if (mode === 'generate-outline') {
        return 'Set audience and deck length, review the outline, then click Generate design.'
      }
      return "Adjust Casual, Balanced, or Playful if you like, then click Generate design."
    }
    if (w.variant === 'create-from-existing') {
      return "Choose a template or design, adjust content treatment if needed, then click Generate design."
    }
    if (w.variant === 'remix') {
      return "Review the content and click Edit to make changes in full screen, then click Generate design."
    }
    return ''
  }

  const followUpForFrozenWidget = (entry) => {
    switch (entry.variant) {
      case 'widget-1':
        return 'Design and content choices were set here — continue below.'
      case 'generate-from-scratch':
        return entry.scratchContentModeSnap === 'generate-outline'
          ? 'Outline from chat was set in this step — newer actions are below.'
          : 'Outline and tone were set in this step — newer actions are below.'
      case 'create-from-existing': {
        const mode =
          entry.cfeContentModeSnap === 'condense'
            ? 'Condense outline'
            : entry.cfeContentModeSnap === 'preserve'
              ? 'Preserve chat content'
              : entry.cfeContentModeSnap === 'generate-outline'
                ? 'Generate outline from chat'
                : ''
        const modePart = mode ? ` (${mode})` : ''
        return `Design "${entry.cfeSnapshot?.name ?? 'selected'}"${modePart} was set here — continue below.`
      }
      case 'remix':
        return `${entry.remixSnap?.name ?? 'This design'} was opened for AI edits — continue below.`
      case 'generating':
        return 'Generation ran here — newer activity is below.'
      default:
        return 'Saved step above — continue below.'
    }
  }

  const createFromExistingDeckItem = createExistingItem ?? brandTemplates[0]

  const isGeneratingFromYourDesign =
    widgetStep === 'generating' &&
    noUserBrandTemplates &&
    !!createExistingItem &&
    yourDesigns.some((d) => d.id === createExistingItem.id)

  const selectCreateExistingItem = (item, tab) => {
    setCreateExistingItem(item)
    setCreateTab(tab)
    setCreateExistingPickerOpen(false)
  }

  const showCanvaStack = wizardStep >= 3 && (secondaryPanelLoading || canvaThread.length > 0)
  const showCanvaFallbackFollowUp = wizardStep >= 3 && !showCanvaStack
  const canvaScrollKey = `${canvaThread.map((e) => e.id).join('-')}-${lastWidgetId ?? ''}-${secondaryPanelLoading ? 1 : 0}`

  const renderCreateFromExistingInteractive = (disableGenerateActions) => (
                    <div className="canva-widget-with-header">
                    <div className="options-container">
                      <div className="generate-from-scratch-widget create-from-existing-widget">
  
                        <div className="generate-from-scratch-header generate-from-scratch-header--title-only">
                          <h2 className="generate-widget-title">Create from existing design</h2>
                        </div>
                        <div className="outline-section-label">Select a design</div>
                        <div className="create-existing-picker create-existing-picker--full" ref={createExistingPickerRef}>
                          <button
                            type="button"
                            className={`tone-pill tone-pill--guided create-existing-picker-trigger ${createExistingPickerOpen ? 'active' : ''}`}
                            aria-expanded={createExistingPickerOpen}
                            aria-haspopup="listbox"
                            aria-label={`${createFromExistingDeckItem.name}. Open to choose another template or design.`}
                            onClick={() => setCreateExistingPickerOpen((o) => !o)}
                          >
                            <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 9h18" />
                              <path d="M9 21V9" />
                            </svg>
                            <span className="create-existing-picker-trigger-label">{createFromExistingDeckItem.name}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="tone-pill-chevron create-existing-picker-chevron">
                              <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          {createExistingPickerOpen ? (
                            <div className="create-existing-picker-panel create-existing-picker-panel--full" role="listbox" aria-label="Templates and designs">
                              <div className="segmented-control create-existing-picker-tabs">
                                <button
                                  type="button"
                                  className={`segmented-tab ${createTab === 'brand-template' ? 'active' : ''}`}
                                  onClick={() => handleTabClick('brand-template')}
                                >
                                  Brand Template ({noUserBrandTemplates ? 0 : brandTemplates.length})
                                </button>
                                <button
                                  type="button"
                                  className={`segmented-tab ${createTab === 'your-designs' ? 'active' : ''}`}
                                  onClick={() => handleTabClick('your-designs')}
                                >
                                  Your designs ({yourDesigns.length})
                                </button>
                              </div>
                              <form
                                className="template-search-bar picker-search-bar"
                                onSubmit={(e) => e.preventDefault()}
                              >
                                <svg className="template-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                  type="text"
                                  className="template-search-input"
                                  placeholder={`Search ${createTab === 'brand-template' ? 'Brand Templates' : 'your designs'}…`}
                                  value={pickerSearchQuery}
                                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  autoComplete="off"
                                />
                                {pickerSearchQuery && (
                                  <button
                                    type="button"
                                    className="picker-search-clear"
                                    onClick={(e) => { e.stopPropagation(); setPickerSearchQuery(''); }}
                                    aria-label="Clear search"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                  </button>
                                )}
                              </form>
                              <div className="template-list create-existing-picker-list">
                                {noUserBrandTemplates && createTab === 'brand-template' ? (
                                  <div className="picker-empty-state">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(13,13,13,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                                      <path d="M3 9h18"/>
                                      <path d="M9 21V9"/>
                                    </svg>
                                    <p className="picker-empty-title">No Brand Templates set up</p>
                                    <p className="picker-empty-desc">Create a Brand Template in Canva to use your brand colours, fonts and logos automatically.</p>
                                    <a
                                      href="https://www.canva.com/brand/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="picker-empty-link"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Set up a Brand Template in Canva →
                                    </a>
                                  </div>
                                ) : (() => {
                                  const baseList = createTab === 'brand-template' ? brandTemplates : yourDesigns
                                  const filtered = pickerSearchQuery.trim()
                                    ? baseList.filter(item => item.name.toLowerCase().includes(pickerSearchQuery.toLowerCase()))
                                    : baseList
                                  if (filtered.length === 0) {
                                    return <p className="picker-no-results">No results for "{pickerSearchQuery}"</p>
                                  }
                                  return filtered.map((item) => {
                                    const isSelected =
                                      !!createExistingItem &&
                                      item.id === createExistingItem.id &&
                                      item.name === createExistingItem.name
                                    return (
                                      <div
                                        key={`${createTab}-${item.id}-${item.name}`}
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`template-item ${isSelected ? 'template-item-selected' : ''}`}
                                        onClick={() => selectCreateExistingItem(item, createTab)}
                                      >
                                        <div className="template-item-main">
                                          <div className="template-thumb-wrap">
                                            <div className={`template-thumb ${item.thumb ? '' : 'template-thumb-blank'}`}>
                                              {item.thumb ? <img src={item.thumb} alt="" /> : null}
                                            </div>
                                            {isSelected && (
                                              <div className="picker-thumb-selected-badge" aria-hidden>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                  <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                              </div>
                                            )}
                                          </div>
                                          <div className="template-info">
                                            <p className="template-name">{item.name}</p>
                                            <p className="template-type">{item.type}</p>
                                          </div>
                                        </div>
                                        <div className="template-item-actions-right">
                                          <div className="template-item-actions" onClick={(e) => e.stopPropagation()}>
                                          <button
                                            type="button"
                                            className="template-action-btn template-action-preview"
                                            onClick={() => {
                                              setPreviewItem(item)
                                              setPreviewFromPicker(true)
                                              setCreateExistingPickerOpen(false)
                                            }}
                                          >
                                            Preview
                                          </button>
                                          <button
                                            type="button"
                                            className="template-action-btn template-action-remix"
                                            onClick={() => {
                                              selectCreateExistingItem(item, createTab)
                                            }}
                                          >
                                            Select
                                          </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                                })()}
                              </div>
  
                            </div>
                          ) : null}
                        </div>
                        <div className="outline-section-label">Content treatment</div>
                        <div className="segmented-control create-existing-content-mode create-existing-content-mode--three" role="group" aria-label="Content treatment">
                          <button
                            type="button"
                            className={`segmented-tab ${createExistingContentMode === 'preserve' ? 'active' : ''}`}
                            onClick={() => setCreateExistingContentMode('preserve')}
                          >
                            Preserve chat content
                          </button>
                          <button
                            type="button"
                            className={`segmented-tab ${createExistingContentMode === 'generate-outline' ? 'active' : ''}`}
                            onClick={() => setCreateExistingContentMode('generate-outline')}
                          >
                            Generate outline from chat
                          </button>
                          <button
                            type="button"
                            className={`segmented-tab ${createExistingContentMode === 'condense' ? 'active' : ''}`}
                            onClick={() => setCreateExistingContentMode('condense')}
                          >
                            Condense outline
                          </button>
                        </div>
                        <div className="generate-widget-footer generate-widget-footer--cta-only">
                          <button type="button" className="generate-design-btn" onClick={handleGenerateDesign} disabled={disableGenerateActions || secondaryPanelLoading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Generate design
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
  )


  useLayoutEffect(() => {
    if (wizardStep < 3) return
    const el = chatScrollRef.current
    if (!el) return
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight
    }
    scrollToBottom()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      scrollToBottom()
      raf2 = requestAnimationFrame(scrollToBottom)
    })
    const timeouts = [0, 120, 400, 700].map((ms) => window.setTimeout(scrollToBottom, ms))
    if (!secondaryPanelLoading && tailVariant === 'generating') {
      const seg = canvaLatestSegmentRef.current
      if (seg) {
        requestAnimationFrame(() => {
          seg.scrollIntoView({ block: 'end', behavior: 'smooth' })
        })
      }
    }
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      timeouts.forEach(clearTimeout)
    }
  }, [
    wizardStep,
    secondaryPanelLoading,
    widgetStep,
    canvaScrollKey,
    showCanvaStack,
    tailVariant,
  ])

  return (
    <div className="chatgpt-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9006A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9006 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"/>
          </svg>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-item" aria-label="Edit">
            <img src="/svg/startIcon.svg" alt="" width={20} height={20} />
          </button>
          <button className="sidebar-item" aria-label="Search">
            <img src="/svg/startIcon-1.svg" alt="" width={20} height={20} />
          </button>
          <button className="sidebar-item" aria-label="History">
            <img src="/svg/startIcon-2.svg" alt="" width={20} height={20} />
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Header */}
        <header className={`header${wizardStep === 1 ? ' header--prompt-home' : ''}`}>
          <div className="header-dropdown">
            <span className="header-model-name">ChatGPT</span>
            <span className="header-model-version">5</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {wizardStep !== 1 ? (
            <div className="header-actions">
              <button type="button" className="header-btn share-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Share
              </button>
              <button type="button" className="header-btn icon-btn" aria-label="More options">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="6" cy="12" r="1.5"/>
                  <circle cx="18" cy="12" r="1.5"/>
                </svg>
              </button>
            </div>
          ) : null}
        </header>

        {/* Chat pane — step 1 matches Figma Prompt-to-Deck home (centered hero + composer) */}
        <div className={`chat-pane${wizardStep === 1 ? ' chat-pane--home' : ''}`}>
          <div className={`chat-inner${wizardStep === 1 ? ' chat-inner--home' : ''}`} ref={chatScrollRef}>
            {wizardStep === 1 ? (
              <div className="home-hero">
                <h1 className="home-hero-title">What can I help you with?</h1>
                <form className="composer composer--home" onSubmit={handleCaptureSubmit}>
                  <div className="composer-home-content">
                    <div className="composer-home-value-row">
                      <input
                        type="text"
                        className="composer-input composer-input--home"
                        placeholder="Ask anything"
                        value={capturePrompt}
                        onChange={(e) => setCapturePrompt(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="composer-home-action-bar">
                      <div className="composer-home-action-left">
                        <button type="button" className="composer-home-icon-btn" aria-label="Add">
                          <img src="/svg/Icon.svg" alt="" width={20} height={20} />
                        </button>
                      </div>
                      <div className="composer-home-action-right">
                        <button type="button" className="composer-home-voice-btn" aria-label="Voice input">
                          <img src="/svg/_Composer-action/Icon.svg" alt="" width={20} height={20} />
                        </button>
                        <button type="submit" className="send-btn composer-home-send" aria-label="Send">
                          <img src="/svg/_Composer-action/Send.svg" alt="" width={36} height={36} />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
            <div className={`conversation${wizardStep === 1 ? ' conversation--hidden' : ''}`}>
              {wizardStep >= 3 && (submittedPrompt || remixItem) && (
                <div className="message-row user">
                  <div className="message-bubble">
                    <p>{remixItem ? `Edit ${remixItem.name} with AI` : submittedPrompt}</p>
                  </div>
                </div>
              )}

              {/* Canva section - stacked chooser + widgets */}
              {wizardStep >= 3 && (
              <div className="app-content">
                {showCanvaStack ? (
                <div className="canva-widget-stack">
                  {canvaThread.length === 0 && secondaryPanelLoading ? (
                    renderCanvaWidgetLoadingSegment()
                  ) : (
                  <>
                  {canvaThread.map((entry) => {
                    if (entry.type === 'chooser') {
                      if (remixItem) return null
                      return (
                  <div key={entry.id} className="canva-thread-segment">
                  <div className="app-attribution">
                    <div className="canva-logo">
                      <img src="/Canva_Icon_logo.png" alt="Canva" width={24} height={24} />
                    </div>
                    <span>Canva</span>
                  </div>
                  <div className={`options-container${chooserInteractive ? '' : ' options-container--stacked-past'}`}>
                    <h2 className="section-title">Choose how you would like to get started</h2>
                    <div className="cards-row">
                      <div className="card" onClick={() => {
                        if (!chooserInteractive) return
                        setCreateExistingContentMode('preserve')
                        runAfterSecondaryLoad(() => {
                          setCanvaThread((t) => {
                            const withSnap = snapshotPreviousTailWidget(t)
                            return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'generate-from-scratch' }]
                          })
                          setCreateExistingItem(null)
                        })
                      }}>
                        <div className="card-thumbnail card-thumb-1">
                          <div className="card-illustration card-illustration-blank card-illustration-blue" />
                        </div>
                        <div className="card-content">
                          <p className="card-title">Generate from scratch</p>
                          <p className="card-desc">Instantly create a full presentation from your prompt.</p>
                        </div>
                      </div>
                      <div className="card" onClick={() => {
                        if (!chooserInteractive) return
                        setFlowStep('create-from-existing')
                        runAfterSecondaryLoad(() => {
                          setCanvaThread((t) => {
                            const withSnap = snapshotPreviousTailWidget(t)
                            return [...withSnap, { id: newCanvaThreadId(), type: 'widget', variant: 'create-from-existing' }]
                          })
                          setCreateExistingItem(brandTemplates[0])
                          setPreSelectedDesign(null)
                        })
                      }}>
                        <div className="card-thumbnail card-thumb-2">
                          <div className="card-illustration card-illustration-blank card-illustration-orange" />
                        </div>
                        <div className="card-content">
                          <p className="card-title">Create from existing design</p>
                          <p className="card-desc">Start with a Canva design or template and customize it.</p>
                        </div>
                      </div>
                      <div className="card card-autofill-coming-soon" onClick={() => {}}>
                        <div className="card-thumbnail card-thumb-3">
                          <div className="card-illustration card-illustration-blank card-illustration-green">
                            <span className="card-coming-soon-banner">Coming soon</span>
                          </div>
                        </div>
                        <div className="card-content">
                          <p className="card-title">Autofill Brand Template</p>
                          <p className="card-desc">Automatically fill a Brand Template with your content.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    <p className="chatgpt-follow-up-text">{chooserFollowUpText}</p>
                    <FollowUpActions />
                  </div>
                  </div>
                      )
                    }
                    if (entry.type === 'widget') return null
                    return null
                  })}
                  {widgetEntries.map((w, idx) => {
                    const isLast = idx === widgetEntries.length - 1

                    if (w.variant === 'widget-1') {
                      return (
                        <div key={w.id} ref={isLast ? canvaLatestSegmentRef : null} className={`canva-thread-segment${isLast ? ' canva-thread-segment--latest' : ''}`}>
                          <div className="canva-tool-thread-block">
                            <div className="app-content widget1-figma">
                              <p className="widget1-connected-heading">Connected to app</p>
                              <div className="widget1-canva-caption">
                                <img
                                  src="/figma-widget1-design/b74983a16a516ac191fc93d18bf330550319e45f.png"
                                  alt=""
                                  className="widget1-canva-caption-icon"
                                  width={14}
                                  height={14}
                                />
                                <span className="widget1-canva-caption-text">Canva</span>
                              </div>
                              <h2 className="widget1-section-heading">Select the Style and Brand of the design</h2>
                              <div className="widget1-style-pills">
                                {[
                                  { value: 'no-style-preference', label: 'No preference', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                  )},
                                  { value: 'select-style', label: 'Select a Style', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                                  )},
                                  { value: 'apply-brand', label: 'Apply Brand', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                                  )},
                                  { value: 'reference-design', label: 'Use existing design', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 17.5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/></svg>
                                  )},
                                ].map(({ value, label, icon }) => (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`widget1-style-pill${wizardScratchStyleMode === value ? ' widget1-style-pill--active' : ''}`}
                                    onClick={() => {
                                      setWizardScratchStyleMode(value)
                                      if (value !== 'reference-design') setWizardReferenceTemplateId('')
                                      setWizardSelectedStyleId('')
                                      setWizardSelectedBrandKitId('')
                                    }}
                                  >
                                    {icon}
                                    <span>{label}</span>
                                  </button>
                                ))}
                              </div>
                              <div className="widget1-figma-card">
                                <div className="widget1-card-top">
                                  {wizardScratchStyleMode === 'select-style' ? (
                                    <div className="widget1-field-row widget1-field-row--hint">
                                      <div className="widget1-field-row-label">
                                        <span className="widget1-select-one-hint">Select one</span>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                                {wizardScratchStyleMode === 'select-style' ? (
                                  <div className="widget1-styles-rail">
                                    <div className="widget1-styles-rail-scroll" ref={wizardStyleCarouselRef}>
                                      <div className="widget1-styles-rail-track">
                                        {WIZARD_WIDGET1_STYLE_CARDS_ORDERED.map((card) => (
                                          <button
                                            key={card.id}
                                            type="button"
                                            className={`wizard-style-card widget1-style-card${
                                              wizardSelectedStyleId === card.id ? ' wizard-style-card--selected' : ''
                                            }`}
                                            onClick={() => setWizardSelectedStyleId(card.id)}
                                          >
                                            <div className="wizard-style-thumb widget1-style-thumb">
                                              {card.surprise ? (
                                                <>
                                                  <div className="wizard-style-surprise-tiles">
                                                    <div className="wizard-style-surprise-tile wizard-style-surprise-tile--a widget1-surprise-tile" />
                                                    <div className="wizard-style-surprise-tile wizard-style-surprise-tile--b widget1-surprise-tile" />
                                                  </div>
                                                  <span className="wizard-style-magic-icon" aria-hidden>
                                                    <svg
                                                      width="20"
                                                      height="20"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="#8b3dff"
                                                      strokeWidth="1.8"
                                                      strokeLinecap="round"
                                                    >
                                                      <path d="M12 3l1.2 3.6L17 9l-3.8 1.2L12 14l-1.2-3.8L7 9l3.8-1.2L12 3z" />
                                                    </svg>
                                                  </span>
                                                </>
                                              ) : (
                                                <div className="wizard-style-tile-stack widget1-style-tile-stack">
                                                  <div className="wizard-style-mini-tile wizard-style-mini-tile--tilt-a widget1-mini-tile">
                                                    <img src={card.img1} alt="" />
                                                  </div>
                                                  <div className="wizard-style-mini-tile wizard-style-mini-tile--tilt-b widget1-mini-tile">
                                                    <img src={card.img2} alt="" />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <span className="wizard-style-card-label widget1-style-card-label">{card.label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="widget1-styles-rail-edge">
                                      <div className="widget1-styles-rail-fade" aria-hidden />
                                      <button
                                        type="button"
                                        className="widget1-styles-rail-arrow"
                                        aria-label="Scroll styles"
                                        onClick={() => scrollWizardTileCarousel(wizardStyleCarouselRef)}
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          aria-hidden
                                        >
                                          <path d="M9 6l6 6-6 6" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ) : null}
                                {wizardScratchStyleMode === 'apply-brand' ? (() => {
                                  const activeKit = WIZARD_BRAND_KIT_CARDS.find(k => k.id === wizardSelectedBrandKitId)
                                  const kitTemplates = BRAND_KIT_TEMPLATES[wizardSelectedBrandKitId] || []
                                  const renderThumb = (palette, idx) => {
                                    const [c1, c2, c3 = '#fff'] = palette || ['#e0e0e0', '#c0c0c0']
                                    const heights = ['30%', '38%', '25%']
                                    const widths = ['55%', '45%', '62%']
                                    return (
                                      <div style={{ width: '100%', height: '100%', background: c1, position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: heights[idx % 3], background: c2 }} />
                                        <div style={{ position: 'absolute', bottom: 8, left: 8, width: widths[idx % 3], height: 3, background: c3, borderRadius: 2, opacity: 0.8 }} />
                                        <div style={{ position: 'absolute', bottom: 14, left: 8, width: '40%', height: 3, background: c3, borderRadius: 2, opacity: 0.5 }} />
                                      </div>
                                    )
                                  }
                                  const renderItem = (t, id, useRealThumb, idx) => {
                                    const isSelected = wizardReferenceTemplateId === id
                                    return (
                                      <div
                                        key={id}
                                        className={`template-item outline-template-item${isSelected ? ' template-item-selected' : ''}`}
                                        onClick={() => setWizardReferenceTemplateId(id)}
                                      >
                                        <div className="template-item-main">
                                          <div className="template-thumb-wrap">
                                            <div className="template-thumb">
                                              {useRealThumb && t.thumb
                                                ? <img src={t.thumb} alt="" />
                                                : renderThumb(activeKit?.palette, idx)}
                                            </div>
                                            {isSelected && (
                                              <div className="picker-thumb-selected-badge" aria-hidden>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                              </div>
                                            )}
                                          </div>
                                          <div className="template-info">
                                            <p className="template-name">{t.name}</p>
                                            <p className="template-type">{t.type}</p>
                                          </div>
                                        </div>
                                        <div className="template-item-actions-right">
                                          <div className="template-item-actions" onClick={e => e.stopPropagation()}>
                                            <button type="button" className="template-action-btn template-action-preview" onClick={() => { setPreviewItem(t); setPreviewFromPicker(false) }}>Preview</button>
                                            <button type="button" className="template-action-btn template-action-remix" onClick={() => setWizardReferenceTemplateId(id)}>Select</button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }

                                  if (!wizardSelectedBrandKitId) {
                                    return (
                                      <>
                                        <div className="widget1-field-row widget1-field-row--hint">
                                          <div className="widget1-field-row-label">
                                            <span className="widget1-select-one-hint">Select one</span>
                                          </div>
                                        </div>
                                        <div className="widget1-styles-rail widget1-styles-rail--brand">
                                          <div className="widget1-styles-rail-scroll" ref={wizardBrandKitCarouselRef}>
                                            <div className="widget1-styles-rail-track">
                                              {WIZARD_BRAND_KIT_CARDS.map((kit) => (
                                                <button
                                                  key={kit.id}
                                                  type="button"
                                                  className="wizard-brand-kit-card widget1-brand-kit-card"
                                                  onClick={() => setWizardSelectedBrandKitId(kit.id)}
                                                >
                                                  <div className={`wizard-brand-kit-thumb widget1-brand-kit-thumb ${kit.thumbClass}`}>
                                                    {kit.img ? <img className="wizard-brand-kit-hero" src={kit.img} alt="" /> : null}
                                                  </div>
                                                  <span className="wizard-brand-kit-label widget1-style-card-label">{kit.label}</span>
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="widget1-styles-rail-edge">
                                            <div className="widget1-styles-rail-fade" aria-hidden />
                                            <button
                                              type="button"
                                              className="widget1-styles-rail-arrow"
                                              aria-label="Scroll brand kits"
                                              onClick={() => scrollWizardTileCarousel(wizardBrandKitCarouselRef)}
                                            >
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                <path d="M9 6l6 6-6 6" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  }

                                  return (
                                    <div className="widget1-reference-block widget1-apply-brand-section">
                                      <div className="widget1-brand-back-row">
                                        <button
                                          type="button"
                                          className="widget1-brand-back-btn"
                                          onClick={() => { setWizardSelectedBrandKitId(''); setWizardReferenceTemplateId('') }}
                                        >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
                                          </svg>
                                          Back to All Brand Kits
                                        </button>
                                      </div>
                                      <div className="widget1-brand-template-select-hint">
                                        <span className="widget1-select-one-hint">Select a Brand Template to use as reference</span>
                                      </div>
                                      {kitTemplates.length === 0 ? (
                                        <div className="widget1-brand-empty-state">
                                          <div className="widget1-brand-empty-icon" aria-hidden>
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" stroke="#8b3dff" strokeWidth="1.5"/>
                                              <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z" stroke="#c47aff" strokeWidth="1"/>
                                            </svg>
                                          </div>
                                          <h3 className="widget1-brand-empty-title">Create faster with Brand Templates</h3>
                                          <p className="widget1-brand-empty-desc">Create a Brand Template so you can reuse it every time to stay on brand</p>
                                          <a href="https://www.canva.com/brand/" target="_blank" rel="noopener noreferrer" className="widget1-brand-empty-btn">
                                            Go to Brand Kit
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                            </svg>
                                          </a>
                                        </div>
                                      ) : (
                                        <div className="outline-template-list">
                                          {kitTemplates.map((t, idx) => renderItem(t, t.id, false, idx))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })() : null}
                                {wizardScratchStyleMode === 'reference-design' ? (
                                  <div className="widget1-reference-block">
                                    <div className="outline-brand-template-picker">
                                      <div className="widget1-brand-template-select-hint">
                                        <span className="widget1-select-one-hint">Select one</span>
                                      </div>
                                      <div className="outline-template-search-wrap">
                                        <svg className="outline-template-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                        </svg>
                                        <input
                                          className="outline-template-search-input"
                                          type="text"
                                          placeholder="Search designs…"
                                          value={widget1TemplateSearch}
                                          onChange={e => setWidget1TemplateSearch(e.target.value)}
                                        />
                                      </div>
                                      <div className="outline-template-list">
                                        {yourDesigns.filter(d => !widget1TemplateSearch || d.name.toLowerCase().includes(widget1TemplateSearch.toLowerCase())).slice(0, 3).map((d, idx) => {
                                          const id = `design-${d.id}`
                                          const isSelected = wizardReferenceTemplateId === id
                                          return (
                                            <div
                                              key={id}
                                              className={`template-item outline-template-item${isSelected ? ' template-item-selected' : ''}`}
                                              onClick={() => setWizardReferenceTemplateId(id)}
                                            >
                                              <div className="template-item-main">
                                                <div className="template-thumb-wrap">
                                                  <div className="template-thumb">
                                                    {d.thumb ? <img src={d.thumb} alt="" /> : null}
                                                  </div>
                                                  {isSelected && (
                                                    <div className="picker-thumb-selected-badge" aria-hidden>
                                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="template-info">
                                                  <p className="template-name">{d.name}</p>
                                                  <p className="template-type">{d.type}</p>
                                                </div>
                                              </div>
                                              <div className="template-item-actions-right">
                                                <div className="template-item-actions" onClick={e => e.stopPropagation()}>
                                                  <button type="button" className="template-action-btn template-action-preview" onClick={() => { setPreviewItem(d); setPreviewFromPicker(false) }}>Preview</button>
                                                  <button type="button" className="template-action-btn template-action-remix" onClick={() => setWizardReferenceTemplateId(id)}>Select</button>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                                <div className="widget1-card-actions widget1-card-actions--dual">
                                  <button
                                    type="button"
                                    className="widget1-figma-secondary"
                                    onClick={() => handleWizardContinue('generate-outline')}
                                    disabled={widget1ContinueDisabled || secondaryPanelLoading || !isLast}
                                  >
                                    Generate and review outline
                                  </button>
                                  <button
                                    type="button"
                                    className="widget1-figma-primary widget1-figma-primary--canva"
                                    onClick={() => handleWizardContinue('preserve-chat')}
                                    disabled={widget1ContinueDisabled || secondaryPanelLoading || !isLast}
                                  >
                                    Generate design
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                            <p className="chatgpt-follow-up-text">{followUpForLiveWidget(w)}</p>
                            <FollowUpActions />
                          </div>
                        </div>
                      )
                    }

                    if (w.variant === 'generating') {
                      return (
                  <div key={w.id} ref={isLast ? canvaLatestSegmentRef : null} className={`canva-thread-segment${isLast ? ' canva-thread-segment--latest' : ''}`}>
                  <div className="app-attribution">
                    <div className="canva-logo">
                      <img src="/Canva_Icon_logo.png" alt="Canva" width={24} height={24} />
                    </div>
                    <span>Canva</span>
                  </div>
                  <div className="canva-tool-thread-block">
                  <div className="canva-widget-with-header">
                  <div className="options-container">
                    <div className="generating-widget">

                      {(() => {
                        const openInCanva = () => {
                          const vw = window.innerWidth
                          const vh = window.innerHeight
                          try {
                            localStorage.setItem('canva-from-chatgpt', JSON.stringify({
                              pages: generatingPages,
                              loadedSlideCount,
                              mainPreviewUnblurred,
                              visiblePageSlotsCount
                            }))
                          } catch (_) {}
                          window.open('/canva-editor/index.html?from=chatgpt', '_blank', `width=${vw},height=${vh},left=0,top=0`)
                        }
                        return (
                          <>
                            <div className="generating-live-banner">
                              <div className="generating-live-banner-left">
                                <span className="generating-live-dot" aria-hidden />
                                <span className="generating-live-text">Live generation is happening in Canva. Open it to watch your design unfurl.</span>
                              </div>
                              <button type="button" className="generating-open-canva-btn generating-open-canva-btn--banner" onClick={openInCanva}>
                                Open in Canva
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                              </button>
                            </div>
                            <div className="generating-preview-area">
                              <div className={`generating-gradient-bg ${loadedSlideCount >= 1 ? 'faded' : ''}`} />
                              {loadedSlideCount >= 1 && (
                                <div className="generating-preview-bg">
                                  <img
                                    src={generatingPages[0]?.thumb}
                                    alt=""
                                    className={`generating-preview-bg-img ${mainPreviewUnblurred ? 'unblurred' : ''}`}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="generating-slides-row">
                              {generatingPages.slice(0, visiblePageSlotsCount).map((page, index) => (
                                <div key={page.id} className="generating-slide-thumb">
                                  {index + 2 <= loadedSlideCount ? (
                                    <img src={page.thumb} alt={page.label} />
                                  ) : (
                                    <div className="generating-slide-gradient" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  </div>
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    {w?.variant === 'generating' && isGeneratingFromYourDesign ? (
                      <p className="chatgpt-follow-up-text">
                        Your design is being created. You can open it in Canva to watch it unfold. We’ve also converted{' '}
                        <strong>{createExistingItem?.name}</strong>
                        {' '}into a Brand Template for you.{' '}
                        <a href="#" className="chatgpt-follow-up-inline-link" onClick={(e) => e.preventDefault()}>View in Canva →</a>
                      </p>
                    ) : (
                      <p className="chatgpt-follow-up-text">{canvaFollowUpHelperText}</p>
                    )}
                    <FollowUpActions />
                  </div>
                  </div>
                      )
                    }

                    return (
                  <div key={w.id} ref={isLast ? canvaLatestSegmentRef : null} className={`canva-thread-segment${isLast ? ' canva-thread-segment--latest' : ''}`}>
                  <div className="app-attribution">
                    <div className="canva-logo">
                      <img src="/Canva_Icon_logo.png" alt="Canva" width={24} height={24} />
                    </div>
                    <span>Canva</span>
                  </div>
                  <div className="canva-tool-thread-block">
                  {w.variant === 'remix' && remixItem ? (
                  <div className="canva-widget-with-header">
                  <div className="options-container">
                    <div className="remix-with-ai-widget">

                      <div className="remix-widget-header">
                        <button type="button" className="back-btn" onClick={() => { popRemixWidgetFromThread(); }} aria-label="Back">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        <h2 className="remix-widget-title">Edit with AI</h2>
                      </div>
                      <div className="remix-template-card">
                        <div className="remix-template-thumb">
                          <img src={remixItem.thumb} alt="" />
                        </div>
                        <div className="remix-template-info">
                          <p className="remix-template-name">{remixItem.name}</p>
                          <p className="remix-template-type">{remixItem.type}</p>
                        </div>
                        <div className="remix-template-actions">
                          <button type="button" className="remix-btn-outline" onClick={() => { popRemixWidgetFromThread(); }}>Change selection</button>
                          <button type="button" className="remix-btn-outline" onClick={() => {
                            const pages = remixItem.pages || createPages()
                            setSelectedPageIds(new Set(pages.map(p => p.id)))
                            setChooseSlidesItem(remixItem)
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Choose slides
                          </button>
                        </div>
                      </div>
                      <div className="remix-review-section">
                        <h3 className="remix-review-label">Review the content</h3>
                        <div className="remix-editable-document">
                          <div className="remix-doc-header">
                            <span className="remix-doc-title-label">Editable Document</span>
                            <div className="remix-doc-actions">
                              {USE_INLINE_EDIT_DOCUMENT ? (
                                /* Enhance flow - kept for potential restore */
                                <button type="button" className="remix-doc-action remix-doc-action-enhance">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                                  </svg>
                                  Enhance the writing with AI
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="remix-edit-doc-btn"
                                  onClick={() => setEditDocumentFullscreenOpen(true)}
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="remix-doc-content">
                            <div className="remix-doc-scroll-inner">
                              <h4 className="remix-doc-main-title">Deploy 2026 deck</h4>
                              {USE_INLINE_EDIT_DOCUMENT ? (
                                <textarea
                                  className="remix-doc-textarea"
                                  value={remixContent}
                                  onChange={(e) => setRemixContent(e.target.value)}
                                  placeholder="Start typing here..."
                                  spellCheck="true"
                                />
                              ) : (
                                <div className={`remix-doc-preview ${!remixContent ? 'remix-doc-preview-empty' : ''}`} onClick={() => setEditDocumentFullscreenOpen(true)}>
                                  {remixContent || 'Start typing here...'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="remix-widget-footer">
                        <button type="button" className="remix-generate-btn" onClick={handleGenerateDesign} disabled={secondaryPanelLoading || !isLast}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Generate design
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                  ) : null}
                  {w.variant === 'generate-from-scratch' ? (
                  <div className="canva-widget-with-header">
                  <div className="options-container options-container--guided-scratch">
                    <div className="generate-from-scratch-widget generate-from-scratch-widget--guided">
                      {(() => {
                        const effectiveScratchContentMode = w.scratchContentMode ?? createExistingContentMode
                        const scratchOutlineVisibleCount =
                          scratchOutlineLength === 'short'
                            ? 5
                            : generateFromScratchOutline.length
                        const visibleOutline = generateFromScratchOutline.slice(0, scratchOutlineVisibleCount)
                        const scratchHeader = (
                          <>
                            {scratchStyleMode === 'apply-brand' ? (
                              <p className="scratch-style-brand-ref scratch-style-brand-ref--mode">
                                <span className="scratch-style-brand-ref-label">Style & Brand</span>
                                <span className="scratch-style-brand-ref-name">
                                  {scratchSelectedBrandKit?.label ?? ''}
                                  {scratchStyleBrandTemplate ? ` · ${scratchStyleBrandTemplate.name}` : ''}
                                </span>
                              </p>
                            ) : null}
                            {scratchStyleMode === 'select-style' && scratchSelectedStyle ? (
                              <p className="scratch-style-brand-ref scratch-style-brand-ref--mode">
                                <span className="scratch-style-brand-ref-label">Presentation style</span>
                                <span className="scratch-style-brand-ref-name">{scratchSelectedStyle.label}</span>
                              </p>
                            ) : null}
                          </>
                        )
                        return effectiveScratchContentMode === 'generate-outline' ? (
                          <>
                            <div className="generate-from-scratch-header generate-from-scratch-header--title-only">
                              <h2 className="generate-widget-title">Edit outline</h2>
                              {scratchHeader}
                            </div>
                            <div className="scratch-outline-meta-row">
                              <div className="wizard-config-field">
                                <label className="wizard-config-label" htmlFor="scratch-outline-content">Text Content</label>
                                <select
                                  id="scratch-outline-content"
                                  className="wizard-config-select"
                                  value={scratchOutlineContent}
                                  onChange={(e) => setScratchOutlineContent(e.target.value)}
                                >
                                  {SCRATCH_OUTLINE_CONTENT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="outline-section-label">Outline</div>
                            <div className="outline-items outline-items--guided">
                              {visibleOutline.map((item) => (
                                <div key={item.num} className="outline-item outline-item--guided">
                                  <div className="outline-item-num outline-item-num--guided">{item.num}</div>
                                  <div className="outline-item-content">
                                    <p className="outline-item-title outline-item-title--guided">{item.title}</p>
                                    <p className="outline-item-desc outline-item-desc--guided">{item.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="generate-widget-footer generate-widget-footer--guided">
                              <button type="button" className="generate-design-btn generate-design-btn--guided" onClick={handleGenerateDesign} disabled={secondaryPanelLoading || !isLast}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                                Generate design
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="generate-from-scratch-header generate-from-scratch-header--title-only">
                              <h2 className="generate-widget-title">Edit outline</h2>
                              {scratchHeader}
                            </div>
                            <div className="outline-section-label">Customise the outline</div>
                            <div className="tone-pills tone-pills--guided">
                              <button type="button" className={`tone-pill tone-pill--guided ${outlineTone === 'casual' ? 'active' : ''}`} onClick={() => setOutlineTone('casual')}>
                                <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Casual
                                <svg className="tone-pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <button type="button" className={`tone-pill tone-pill--guided ${outlineTone === 'balanced' ? 'active' : ''}`} onClick={() => setOutlineTone('balanced')}>
                                <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <rect x="3" y="3" width="18" height="18" rx="3" />
                                  <line x1="7" y1="8" x2="17" y2="8" />
                                  <line x1="7" y1="12" x2="17" y2="12" />
                                  <line x1="7" y1="16" x2="13" y2="16" />
                                </svg>
                                Balanced
                                <svg className="tone-pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <button type="button" className={`tone-pill tone-pill--guided ${outlineTone === 'playful' ? 'active' : ''}`} onClick={() => setOutlineTone('playful')}>
                                <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
                                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none" />
                                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none" />
                                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none" />
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.47-1.125-.29-.289-.47-.687-.47-1.125a1.64 1.64 0 0 1 1.648-1.688h1.96c3.073 0 5.684-2.539 5.684-5.664C22 6.216 17.5 2 12 2z" />
                                </svg>
                                Playful
                                <svg className="tone-pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <button type="button" className="tone-pill tone-pill--guided">
                                <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Byte
                                <svg className="tone-pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <button type="button" className="tone-pill tone-pill--guided tone-pill-update">
                                <svg className="tone-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M23 4v6h-6" />
                                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                </svg>
                                Update
                              </button>
                            </div>
                            <div className="outline-section-label">Review the outline content</div>
                            <div
                              className="outline-content-preview"
                              onClick={() => setEditDocumentFullscreenOpen(true)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditDocumentFullscreenOpen(true); } }}
                            >
                              <div className="outline-content-preview-header">
                                <span className="outline-content-preview-title">Editable document</span>
                                <button
                                  type="button"
                                  className="outline-content-preview-open-btn"
                                  onClick={(e) => { e.stopPropagation(); setEditDocumentFullscreenOpen(true); }}
                                >
                                  Edit
                                </button>
                              </div>
                              <div className="outline-content-preview-body">
                                <p className="outline-content-preview-doc-title">Deploy 2026 deck</p>
                                <p className="outline-content-preview-text">{remixContent}</p>
                                <div className="outline-preview-fade" />
                              </div>
                            </div>
                            <div className="generate-widget-footer generate-widget-footer--cta-only">
                              <button type="button" className="generate-design-btn generate-design-btn--guided" onClick={handleGenerateDesign} disabled={secondaryPanelLoading || !isLast}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                                Generate design
                              </button>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  </div>
                  ) : null}
                  {w.variant === 'create-from-existing' ? (
                  renderCreateFromExistingInteractive(!isLast)
                  ) : null}
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    <p className="chatgpt-follow-up-text">{followUpForLiveWidget(w)}</p>
                    <FollowUpActions />
                  </div>
                  </div>
                    )
                  })}
                  {secondaryPanelLoading &&
                  (widgetEntries.length > 0 || hasChooserInThread) &&
                  widgetEntries[widgetEntries.length - 1]?.variant !== 'generating' ? (
                    renderCanvaWidgetLoadingSegment()
                  ) : null}
                  </>
                )}
                </div>
                ) : null}
                {showCanvaFallbackFollowUp ? (
                  <ChatGptFollowUp text={canvaFollowUpHelperText} />
                ) : null}
              </div>
              )}
            </div>
          </div>

          {/* Step 1 composer is inline in home hero (Figma). Step 3+: sticky composer with Canva tag. */}
          {wizardStep >= 3 && (
          <div className="composer-wrapper">
            <form className="composer" onSubmit={handleSubmit}>
              <div className="composer-content">
                <div className="composer-value">
                  <input
                    type="text"
                    className="composer-input"
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="composer-actions">
                <div className="composer-left">
                  <button type="button" className="composer-icon-btn" aria-label="Add">
                    <img src="/svg/Icon.svg" alt="" width={20} height={20} />
                  </button>
                  <div className="canva-tag">
                    <img src="/Canva_Icon_logo.png" alt="" className="canva-tag-icon" width={16} height={16} />
                    <span>Canva</span>
                    <button type="button" className="canva-tag-close" aria-label="Remove">
                      <img src="/svg/close.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                </div>
                <div className="composer-right">
                  <button type="button" className="composer-icon-btn" aria-label="Voice input">
                    <img src="/svg/_Composer-action/Icon.svg" alt="" width={20} height={20} />
                  </button>
                  <button type="submit" className="send-btn" aria-label="Send">
                    <img src="/svg/_Composer-action/Send.svg" alt="" width={36} height={36} />
                  </button>
                </div>
              </div>
            </form>
          </div>
          )}
        </div>
      </main>

      {/* Choose slides fullscreen - select pages to edit */}
      {chooseSlidesItem && (
        <div className="preview-fullscreen choose-slides-fullscreen">
          <header className="preview-header">
            <div className="preview-header-left">
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setChooseSlidesItem(null)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h1 className="preview-title">Select slides to edit</h1>
            </div>
          </header>
          <main className="preview-main">
            <div className="preview-pages-grid">
              {(chooseSlidesItem.pages || createPages()).map((page) => {
                const isSelected = selectedPageIds.has(page.id)
                return (
                  <div
                    key={page.id}
                    className={`preview-page-card choose-slides-page-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedPageIds(prev => {
                        const next = new Set(prev)
                        if (next.has(page.id)) next.delete(page.id)
                        else next.add(page.id)
                        return next
                      })
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedPageIds(prev => {
                          const next = new Set(prev)
                          if (next.has(page.id)) next.delete(page.id)
                          else next.add(page.id)
                          return next
                        })
                      }
                    }}
                  >
                    <p className="preview-page-label">{page.label}</p>
                    <div className="preview-page-thumb choose-slides-thumb">
                      <div className="choose-slides-checkbox" aria-hidden>
                        {isSelected ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect width="20" height="20" rx="4" fill="#8b3dff"/>
                            <path d="M5 10l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="1" y="1" width="18" height="18" rx="4" fill="white" stroke="rgba(13, 13, 13, 0.2)" strokeWidth="2"/>
                          </svg>
                        )}
                      </div>
                      <img src={page.thumb} alt={page.label} />
                    </div>
                  </div>
                )
              })}
            </div>
          </main>
          <footer className="preview-footer">
            <button
              type="button"
              className="preview-remix-btn choose-slides-remix-btn"
              onClick={() => {
                setChooseSlidesItem(null)
                /* selected pages could be passed to edit flow */
              }}
            >
              Edit {selectedPageIds.size} slide{selectedPageIds.size !== 1 ? 's' : ''} with AI
            </button>
            <div className="preview-composer">
              <button type="button" className="preview-composer-icon" aria-label="Add">
                <img src="/svg/Icon.svg" alt="" width={20} height={20} />
              </button>
              <input type="text" className="preview-composer-input" placeholder="Ask anything" />
              <button type="button" className="preview-composer-send" aria-label="Send">
                <img src="/svg/_Composer-action/Send.svg" alt="" width={36} height={36} />
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Full-screen edit document - edit content in full screen */}
      {editDocumentFullscreenOpen &&
        (remixItem ||
          (widgetStep === 'generate-from-scratch' &&
            (lastWidgetEntry?.scratchContentMode ?? createExistingContentMode) !== 'generate-outline')) && (
        <div className="preview-fullscreen edit-document-fullscreen">
          <header className="preview-header">
            <div className="preview-header-left">
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setEditDocumentFullscreenOpen(false)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h1 className="preview-title">Editable Document</h1>
            </div>
          </header>
          <main className="preview-main edit-document-main">
            <div className="edit-document-content">
              <h4 className="remix-doc-main-title">Deploy 2026 deck</h4>
              <textarea
                className="remix-doc-textarea edit-document-textarea"
                value={remixContent}
                onChange={(e) => setRemixContent(e.target.value)}
                placeholder="Start typing here..."
                spellCheck="true"
              />
            </div>
          </main>
          <footer className="preview-footer">
            <button
              type="button"
              className="preview-remix-btn"
              onClick={() => setEditDocumentFullscreenOpen(false)}
            >
              Done
            </button>
            <div className="preview-composer edit-document-composer">
              <button type="button" className="preview-composer-icon" aria-label="Add">
                <img src="/svg/Icon.svg" alt="" width={20} height={20} />
              </button>
              <input
                type="text"
                className="preview-composer-input"
                placeholder="Ask anything"
                autoFocus
              />
              <button type="button" className="preview-composer-send" aria-label="Send">
                <img src="/svg/_Composer-action/Send.svg" alt="" width={36} height={36} />
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Full-screen design preview - all pages in grid */}
      {previewItem && (
        <div className="preview-fullscreen">
          <header className="preview-header">
            <div className="preview-header-left">
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => {
                  setPreviewItem(null)
                  if (previewFromPicker) {
                    setPreviewFromPicker(false)
                    setCreateExistingPickerOpen(true)
                  }
                }}
                aria-label="Close preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h1 className="preview-title">{previewItem.name}</h1>
            </div>
          </header>
          <main className="preview-main">
            <div className="preview-pages-grid">
              {(previewItem.pages || createPages()).map((page) => (
                <div key={page.id} className="preview-page-card">
                  <p className="preview-page-label">{page.label}</p>
                  <div className="preview-page-thumb">
                    <img src={page.thumb} alt={page.label} />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* Next screen placeholder - shown when user submits */}
      {screen === 'next' && (
        <div className="next-screen-overlay">
          <div className="next-screen-message">
            <p>You submitted: "{prompt}"</p>
            <p className="next-screen-note">Next screen will be built when you're ready.</p>
            <button onClick={() => setScreen('home')}>Back to home</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
