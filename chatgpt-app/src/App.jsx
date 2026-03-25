import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [outlinePrompt, setOutlinePrompt] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState('') // Prompt user submitted - shown on next screen
  const DECK_PROMPT = "Create a pitch deck for Deploy 2026" // From Figma - prompt that generated the outline
  const [screen, setScreen] = useState('home') // 'home' | 'next' - ready for next screen
  const [flowStep, setFlowStep] = useState('outline') // 'outline' | 'options' | 'create-from-existing'
  const [widgetStep, setWidgetStep] = useState('options') // 'options' | 'create-from-existing' | 'generate-from-scratch' | 'generating' | 'remix'
  const [loadedSlideCount, setLoadedSlideCount] = useState(0) // slides loaded in generating view
  const [mainPreviewUnblurred, setMainPreviewUnblurred] = useState(false)
  const [visiblePageSlotsCount, setVisiblePageSlotsCount] = useState(0) // page slots shown below (loading states)
  const [preSelectedDesign, setPreSelectedDesign] = useState(null) // legacy / outline navigation
  const [createExistingItem, setCreateExistingItem] = useState(null) // selected template or design in create-from-existing flow
  const [createExistingPickerOpen, setCreateExistingPickerOpen] = useState(false)
  const createExistingPickerRef = useRef(null)
  const chatScrollRef = useRef(null)
  const canvaLatestSegmentRef = useRef(null)
  const [pickerSearchQuery, setPickerSearchQuery] = useState('')
  const [secondaryPanelLoading, setSecondaryPanelLoading] = useState(false)
  const [secondaryLoadPhaseIndex, setSecondaryLoadPhaseIndex] = useState(0)
  const secondaryLoadTimerRef = useRef(null)
  const SECONDARY_LOAD_MESSAGES = ['Calling the tool', 'Called the tool', 'Talked to canva']
  /** ~2.5s total before widget + Canva header appear (three phased lines). */
  const SECONDARY_LOAD_PHASE_MS = 850
  const SECONDARY_PANEL_LOAD_MS = SECONDARY_LOAD_PHASE_MS * SECONDARY_LOAD_MESSAGES.length
  const [canvaThread, setCanvaThread] = useState([]) // { id, type: 'chooser' | 'widget', variant?, cfeSnapshot?, outlineToneSnap?, remixSnap? }
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
  const [remixContent, setRemixContent] = useState(`Deploy 2026 — Pitch Deck

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
Clear recommendations and what you need from the audience. Make the ask specific, actionable, and easy to say yes to. Funding amount and use of funds if applicable, partnership or pilot opportunities, next meeting or follow-up, contact information.`)

  // Clear search only when user clicks a tab (not when we navigate from prompt)
  const handleTabClick = (tab) => {
    setSearchQuery('')
    setSearchSubmitted(false)
    setSearchByNameNoMatch(false)
    setCreateTab(tab)
  }
  const [urlSearchResult, setUrlSearchResult] = useState(null)
  const [outlineTone, setOutlineTone] = useState(null) // 'casual' | 'balanced' | 'playful' | null = none selected

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
    }
    if (w.variant === 'generate-from-scratch') {
      enriched.outlineToneSnap = outlineTone
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
    if (flowStep === 'outline') {
      setCanvaThread([])
      setSecondaryPanelLoading(false)
      setRemixItem(null)
    }
  }, [flowStep])

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

  const handleOutlineSubmit = (e) => {
    e.preventDefault()
    const text = outlinePrompt.trim()
    if (!text) return
    setSubmittedPrompt(text)
    const result = processTemplateDesignPrompt(text)
    navigateToTemplateDesign(text, result)
    setOutlinePrompt('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = prompt.trim()
    if (!text) return
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
    clearSecondaryLoadTimer()
    setLoadedSlideCount(0)
    setMainPreviewUnblurred(false)
    setVisiblePageSlotsCount(0)
    runAfterSecondaryLoad(() => {
      setCanvaThread((t) => [...t, { id: newCanvaThreadId(), type: 'widget', variant: 'generating' }])
    }, { clearRemix: false })
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

  const widgetEntries = canvaThread.filter((e) => e.type === 'widget')
  const lastWidgetEntry = widgetEntries[widgetEntries.length - 1]
  const lastWidgetId = lastWidgetEntry?.id
  const hasChooserInThread = canvaThread.some((e) => e.type === 'chooser')
  const chooserInteractive = hasChooserInThread && !secondaryPanelLoading && !remixItem
  const tailVariant = lastWidgetEntry?.variant

  const canvaFollowUpHelperText =
    tailVariant === 'generating'
      ? "Your design is being created. You can open it in Canva to watch it unfold."
      : tailVariant === 'remix'
        ? "Review the content and click Edit to make changes in full screen, then click Generate design."
        : tailVariant === 'generate-from-scratch'
          ? "Adjust Casual, Balanced, or Playful if you like, then click Generate design."
          : tailVariant === 'create-from-existing'
            ? "Choose a template or design, review the content, then open Edit for full screen or generate when ready."
            : hasChooserInThread
              ? "Choose how you'd like to get started above, or pick another option anytime."
              : "Scroll up to review earlier steps or continue below."

  const chooserFollowUpText = "Choose how you'd like to get started above, or pick another option anytime."

  const followUpForLiveWidget = (w) => {
    if (w.variant === 'generate-from-scratch') {
      return "Adjust Casual, Balanced, or Playful if you like, then click Generate design."
    }
    if (w.variant === 'create-from-existing') {
      return "Choose a template or design, review the content, then open Edit for full screen or generate when ready."
    }
    if (w.variant === 'remix') {
      return "Review the content and click Edit to make changes in full screen, then click Generate design."
    }
    return ''
  }

  const followUpForFrozenWidget = (entry) => {
    switch (entry.variant) {
      case 'generate-from-scratch':
        return 'Outline and tone were set in this step — newer actions are below.'
      case 'create-from-existing':
        return `Design "${entry.cfeSnapshot?.name ?? 'selected'}" was chosen here — continue below.`
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

  const showCanvaStack = flowStep !== 'outline' && (secondaryPanelLoading || canvaThread.length > 0)
  const showCanvaFallbackFollowUp = flowStep !== 'outline' && !showCanvaStack
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
                                  Brand template ({noUserBrandTemplates ? 0 : brandTemplates.length})
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
                                  placeholder={`Search ${createTab === 'brand-template' ? 'brand templates' : 'your designs'}…`}
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
                                    <p className="picker-empty-title">No brand templates set up</p>
                                    <p className="picker-empty-desc">Create a brand template in Canva to use your brand colours, fonts and logos automatically.</p>
                                    <a
                                      href="https://www.canva.com/brand/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="picker-empty-link"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Set up a brand template in Canva →
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
                            <p className="outline-content-preview-text">{remixContent || 'Start typing here...'}</p>
                            <div className="outline-preview-fade" />
                          </div>
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
    if (flowStep === 'outline') return
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
    flowStep,
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
        <header className="header">
          <div className="header-dropdown">
            <span>ChatGPT 5</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-actions">
            <button className="header-btn share-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share
            </button>
            <button className="header-btn icon-btn" aria-label="More options">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="6" cy="12" r="1.5"/>
                <circle cx="18" cy="12" r="1.5"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Chat pane */}
        <div className="chat-pane">
          <div className="chat-inner" ref={chatScrollRef}>
            <div className="conversation">
              {/* Outline page - deck outline (from ChatGPT, not Canva). Figma prompt shown as user message. */}
              {flowStep === 'outline' && (
                <>
                  <div className="message-row user">
                    <div className="message-bubble">
                      <p>{DECK_PROMPT}</p>
                    </div>
                  </div>
                  <div className="app-content outline-response">
                    <div className="outline-container">
                      <h2 className="outline-title">Deck Outline</h2>
                      <p className="outline-subtitle">Generated by ChatGPT</p>
                      <div className="outline-sections">
                        <section className="outline-section">
                          <h3 className="outline-section-title">1. Cover — Deploy 2026</h3>
                          <p className="outline-section-desc">Opening slide with event branding, date, and venue. Establish the Deploy 2026 identity and set the tone for the presentation.</p>
                          <ul className="outline-section-points">
                            <li>Event logo and tagline</li>
                            <li>Date and location</li>
                            <li>Presenter name and title</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">2. Agenda — Key topics overview</h3>
                          <p className="outline-section-desc">Outline the main themes and structure of the presentation so the audience knows what to expect and can follow along.</p>
                          <ul className="outline-section-points">
                            <li>Problem statement and market context</li>
                            <li>Solution and product overview</li>
                            <li>Product demo and key features</li>
                            <li>Team, traction, and ask</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">3. Problem — Market opportunity</h3>
                          <p className="outline-section-desc">Address the challenges and gaps in the current landscape. Articulate the pain points your target audience faces and the market opportunity that exists.</p>
                          <ul className="outline-section-points">
                            <li>Current state and pain points</li>
                            <li>Market size and growth potential</li>
                            <li>Why now? Timing and trends</li>
                            <li>Competitive landscape gaps</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">4. Solution — Product overview</h3>
                          <p className="outline-section-desc">Introduce your offering and how it solves the identified problems. Position your solution clearly and differentiate from alternatives.</p>
                          <ul className="outline-section-points">
                            <li>Product vision and value proposition</li>
                            <li>Core capabilities and benefits</li>
                            <li>Target customer and use cases</li>
                            <li>Key differentiators</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">5. Product demo — Key features</h3>
                          <p className="outline-section-desc">Walk through the most important capabilities and differentiators. Show, don’t tell—demonstrate how the product works in practice.</p>
                          <ul className="outline-section-points">
                            <li>Feature highlights with screenshots or mockups</li>
                            <li>User flow and key workflows</li>
                            <li>Integration and ecosystem</li>
                            <li>Roadmap preview</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">6. Team — Leadership & expertise</h3>
                          <p className="outline-section-desc">Highlight the people behind the vision and their relevant experience. Build trust and credibility through the team’s track record.</p>
                          <ul className="outline-section-points">
                            <li>Founder and key leadership bios</li>
                            <li>Relevant experience and achievements</li>
                            <li>Advisors and board</li>
                            <li>Why this team can execute</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">7. Traction — Metrics & milestones</h3>
                          <p className="outline-section-desc">Share progress, validation, and proof points to build credibility. Use concrete numbers and milestones to demonstrate momentum.</p>
                          <ul className="outline-section-points">
                            <li>Key metrics (users, revenue, growth)</li>
                            <li>Customer logos and testimonials</li>
                            <li>Partnerships and milestones</li>
                            <li>Recognition and awards</li>
                          </ul>
                        </section>
                        <section className="outline-section">
                          <h3 className="outline-section-title">8. Ask — Next steps & call to action</h3>
                          <p className="outline-section-desc">Clear recommendations and what you need from the audience. Make the ask specific, actionable, and easy to say yes to.</p>
                          <ul className="outline-section-points">
                            <li>Funding amount and use of funds (if applicable)</li>
                            <li>Partnership or pilot opportunities</li>
                            <li>Next meeting or follow-up</li>
                            <li>Contact information</li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                  <ChatGptFollowUp text="Refine the outline above or ask for changes. When ready, choose how you'd like to create your deck." />
                </>
              )}
              {flowStep !== 'outline' && (submittedPrompt || remixItem) && (
                <div className="message-row user">
                  <div className="message-bubble">
                    <p>{remixItem ? `Edit ${remixItem.name} with AI` : submittedPrompt}</p>
                  </div>
                </div>
              )}

              {/* Canva section - stacked chooser + widgets */}
              {flowStep !== 'outline' && (
              <div className="app-content">
                {showCanvaStack ? (
                <div className="canva-widget-stack">
                  {canvaThread.length === 0 && secondaryPanelLoading ? (
                  <div className="canva-tool-thread-block">
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
                  </div>
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
                          <p className="card-title">Autofill brand template</p>
                          <p className="card-desc">Automatically fill a brand template with your content.</p>
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
                    const lastW = widgetEntries[widgetEntries.length - 1]
                    const penultimate = widgetEntries.length >= 2 ? widgetEntries[widgetEntries.length - 2] : null
                    const keepCreateFromExistingFullAboveGen =
                      w.variant === 'create-from-existing' &&
                      lastW?.variant === 'generating' &&
                      penultimate &&
                      w.id === penultimate.id

                    if (!isLast) {
                      if (keepCreateFromExistingFullAboveGen) {
                        return (
                  <div key={w.id} className="canva-thread-segment">
                  <div className="app-attribution">
                    <div className="canva-logo">
                      <img src="/Canva_Icon_logo.png" alt="Canva" width={24} height={24} />
                    </div>
                    <span>Canva</span>
                  </div>
                  <div className="canva-tool-thread-block">
                    {renderCreateFromExistingInteractive(true)}
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    <p className="chatgpt-follow-up-text">Choose a template or design, review the content, then open Edit for full screen or generate when ready.</p>
                    <FollowUpActions />
                  </div>
                  </div>
                        )
                      }
                      return (
                  <div key={w.id} className="canva-thread-segment">
                  <div className="app-attribution">
                    <div className="canva-logo">
                      <img src="/Canva_Icon_logo.png" alt="Canva" width={24} height={24} />
                    </div>
                    <span>Canva</span>
                  </div>
                  <div className="options-container options-container--stacked-past">
                    {w.variant === 'generate-from-scratch' ? (
                      <>
                        <h2 className="section-title">Generate from scratch</h2>
                        <p className="canva-stack-frozen-desc">
                          {w.outlineToneSnap
                            ? `Tone: ${w.outlineToneSnap}. Outline configured — you opened another path below.`
                            : 'Outline and tone configured — you opened another path below.'}
                        </p>
                      </>
                    ) : null}
                    {w.variant === 'create-from-existing' ? (
                      <>
                        <h2 className="section-title">Create from existing design</h2>
                        <p className="canva-stack-frozen-desc">
                          Starting from <strong>{w.cfeSnapshot?.name ?? 'your design'}</strong>.
                        </p>
                      </>
                    ) : null}
                    {w.variant === 'remix' ? (
                      <>
                        <h2 className="section-title">Edit with AI</h2>
                        <p className="canva-stack-frozen-desc">{w.remixSnap?.name ?? 'Design'} — saved above.</p>
                      </>
                    ) : null}
                    {w.variant === 'generating' ? (
                      <>
                        <h2 className="section-title">Live generation</h2>
                        <p className="canva-stack-frozen-desc">Generation ran here — newer activity is below.</p>
                      </>
                    ) : null}
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    <p className="chatgpt-follow-up-text">{followUpForFrozenWidget(w)}</p>
                    <FollowUpActions />
                  </div>
                  </div>
                      )
                    }

                    if (w.variant === 'generating') {
                      return (
                  <div key={w.id} ref={canvaLatestSegmentRef} className="canva-thread-segment canva-thread-segment--latest">
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
                        {' '}into a brand template for you.{' '}
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
                  <div key={w.id} className="canva-thread-segment canva-thread-segment--latest">
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
                        <button type="button" className="remix-generate-btn" onClick={handleGenerateDesign} disabled={secondaryPanelLoading}>
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

                      <div className="generate-from-scratch-header generate-from-scratch-header--title-only">
                        <h2 className="generate-widget-title">Generate from scratch</h2>
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
                        <button type="button" className="generate-design-btn generate-design-btn--guided" onClick={handleGenerateDesign} disabled={secondaryPanelLoading}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                          Generate design
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                  ) : null}
                  {w.variant === 'create-from-existing' ? (
                  renderCreateFromExistingInteractive(false)
                  ) : null}
                  </div>
                  <div className="chatgpt-follow-up chatgpt-follow-up--post-widget">
                    <p className="chatgpt-follow-up-text">{followUpForLiveWidget(w)}</p>
                    <FollowUpActions />
                  </div>
                  </div>
                    )
                  })}
                  {secondaryPanelLoading && widgetEntries.length > 0 && widgetEntries[widgetEntries.length - 1]?.variant !== 'generating' ? (
                  <div className="canva-tool-thread-block">
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
                  </div>
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

          {/* Composer - outline prompt or main chat */}
          <div className="composer-wrapper">
            {flowStep === 'outline' ? (
              <form className="composer" onSubmit={handleOutlineSubmit}>
                <div className="composer-content">
                  <div className="composer-value">
                    <input
                      type="text"
                      className="composer-input"
                      placeholder="Ask anything"
                      value={outlinePrompt}
                      onChange={(e) => setOutlinePrompt(e.target.value)}
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
            ) : (
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
            )}
          </div>
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
      {editDocumentFullscreenOpen && (remixItem || createExistingItem || widgetStep === 'generate-from-scratch') && (
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
