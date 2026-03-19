import { create } from "zustand";

type TextAlignment = "flex-end" | "center" | "flex-start";
type OverflowType = "menu" | "scroll";

interface InstanceStyle {
  isUppercase?: boolean;
  textAlignment?: TextAlignment;
  transparency?: number;
  menuBgColor?: string;
  overflowType?: OverflowType;
  showLogo?: boolean;
  menuType?: string;
}

interface NavMenuStyleState {
  // Global styles (used when applyToAll is true)
  isUppercase: boolean;
  toggleCase: () => void;
  textAlignment: TextAlignment;
  cycleAlignment: () => void;
  transparency: number;
  setTransparency: (value: number) => void;
  menuBgColor: string;
  setMenuBgColor: (color: string) => void;
  overflowType: OverflowType;
  setOverflowType: (type: OverflowType) => void;
  showLogo: boolean;
  setShowLogo: (value: boolean) => void;
  menuType: string;
  setMenuType: (type: string) => void;

  // Apply to all toggle
  applyToAll: boolean;
  setApplyToAll: (value: boolean) => void;

  // Current canvas ID for instance-specific styling
  currentCanvasId: number | null;
  setCurrentCanvasId: (id: number | null) => void;

  // Instance-specific styles
  instanceStyles: Record<number, InstanceStyle>;

  // Methods to get effective styles (either global or instance-specific)
  getEffectiveIsUppercase: () => boolean;
  getEffectiveTextAlignment: () => TextAlignment;
  getEffectiveTransparency: () => number;
  getEffectiveMenuBgColor: () => string;
  getEffectiveOverflowType: () => OverflowType;
  getEffectiveShowLogo: () => boolean;
  getEffectiveMenuType: () => string;

  // UI state
  isTransparencyPanelOpen: boolean;
  toggleTransparencyPanel: () => void;
  isColourPanelOpen: boolean;
  toggleColourPanel: () => void;
  isColourPanelInSidebar: boolean;
  showColourPanelInSidebar: () => void;
  hideColourPanel: () => void;
  isEditPanelInSidebar: boolean;
  showEditPanelInSidebar: () => void;
  hideEditPanel: () => void;
  maxVisibleItems: number;
}

export const useNavMenuStyleStore = create<NavMenuStyleState>((set, get) => ({
  // Global styles (used when applyToAll is true)
  isUppercase: false,
  toggleCase: () =>
    set(state => {
      const newValue = !state.isUppercase;
      if (state.applyToAll) {
        return { isUppercase: newValue };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              isUppercase: newValue,
            },
          },
        };
      }
      return {};
    }),

  textAlignment: "flex-end",
  cycleAlignment: () =>
    set(state => {
      const newAlignment =
        state.textAlignment === "flex-end"
          ? "center"
          : state.textAlignment === "center"
            ? "flex-start"
            : "flex-end";

      if (state.applyToAll) {
        return { textAlignment: newAlignment };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              textAlignment: newAlignment,
            },
          },
        };
      }
      return {};
    }),

  transparency: 100,
  setTransparency: value =>
    set(state => {
      if (state.applyToAll) {
        return { transparency: value };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              transparency: value,
            },
          },
        };
      }
      return {};
    }),

  menuBgColor: "#FFFFFF",
  setMenuBgColor: color =>
    set(state => {
      if (state.applyToAll) {
        return { menuBgColor: color };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              menuBgColor: color,
            },
          },
        };
      }
      return {};
    }),

  overflowType: "menu",
  setOverflowType: type =>
    set(state => {
      if (state.applyToAll) {
        return { overflowType: type };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              overflowType: type,
            },
          },
        };
      }
      return {};
    }),

  showLogo: false,
  setShowLogo: value =>
    set(state => {
      if (state.applyToAll) {
        return { showLogo: value };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              showLogo: value,
            },
          },
        };
      }
      return {};
    }),

  menuType: "basic",
  setMenuType: type =>
    set(state => {
      if (state.applyToAll) {
        return { menuType: type };
      } else if (state.currentCanvasId !== null) {
        return {
          instanceStyles: {
            ...state.instanceStyles,
            [state.currentCanvasId]: {
              ...state.instanceStyles[state.currentCanvasId],
              menuType: type,
            },
          },
        };
      }
      return {};
    }),

  // Apply to all toggle
  applyToAll: true, // Default to true for backward compatibility
  setApplyToAll: value =>
    set(state => {
      // If toggling from false to true, copy current canvas styles to global
      if (!state.applyToAll && value && state.currentCanvasId !== null) {
        const currentInstanceStyle = state.instanceStyles[state.currentCanvasId];

        if (currentInstanceStyle) {
          // Copy all instance-specific styles to global styles
          return {
            applyToAll: value,
            isUppercase: currentInstanceStyle.isUppercase ?? state.isUppercase,
            textAlignment: currentInstanceStyle.textAlignment ?? state.textAlignment,
            transparency: currentInstanceStyle.transparency ?? state.transparency,
            menuBgColor: currentInstanceStyle.menuBgColor ?? state.menuBgColor,
            overflowType: currentInstanceStyle.overflowType ?? state.overflowType,
            showLogo: currentInstanceStyle.showLogo ?? state.showLogo,
            menuType: currentInstanceStyle.menuType ?? state.menuType,
          };
        }
      }

      return { applyToAll: value };
    }),

  // Current canvas ID for instance-specific styling
  currentCanvasId: null,
  setCurrentCanvasId: id => set({ currentCanvasId: id }),

  // Instance-specific styles
  instanceStyles: {},

  // Methods to get effective styles (either global or instance-specific)
  getEffectiveIsUppercase: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.isUppercase;
    }
    return state.instanceStyles[state.currentCanvasId]?.isUppercase ?? state.isUppercase;
  },

  getEffectiveTextAlignment: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.textAlignment;
    }
    return state.instanceStyles[state.currentCanvasId]?.textAlignment ?? state.textAlignment;
  },

  getEffectiveTransparency: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.transparency;
    }
    return state.instanceStyles[state.currentCanvasId]?.transparency ?? state.transparency;
  },

  getEffectiveMenuBgColor: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.menuBgColor;
    }
    return state.instanceStyles[state.currentCanvasId]?.menuBgColor ?? state.menuBgColor;
  },

  getEffectiveOverflowType: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.overflowType;
    }
    return state.instanceStyles[state.currentCanvasId]?.overflowType ?? state.overflowType;
  },

  getEffectiveShowLogo: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.showLogo;
    }
    return state.instanceStyles[state.currentCanvasId]?.showLogo ?? state.showLogo;
  },

  getEffectiveMenuType: () => {
    const state = get();
    if (state.applyToAll || state.currentCanvasId === null) {
      return state.menuType;
    }
    return state.instanceStyles[state.currentCanvasId]?.menuType ?? state.menuType;
  },

  // UI state
  isTransparencyPanelOpen: false,
  toggleTransparencyPanel: () =>
    set(state => ({
      isTransparencyPanelOpen: !state.isTransparencyPanelOpen,
      isColourPanelOpen: false,
      isColourPanelInSidebar: false,
      isEditPanelInSidebar: false,
    })),
  isColourPanelOpen: false,
  toggleColourPanel: () =>
    set(state => ({
      isColourPanelOpen: !state.isColourPanelOpen,
      isTransparencyPanelOpen: false,
      isColourPanelInSidebar: false,
      isEditPanelInSidebar: false,
    })),
  isColourPanelInSidebar: false,
  showColourPanelInSidebar: () =>
    set({
      isColourPanelInSidebar: true,
      isColourPanelOpen: false,
      isTransparencyPanelOpen: false,
      isEditPanelInSidebar: false,
    }),
  hideColourPanel: () =>
    set({
      isColourPanelInSidebar: false,
      isColourPanelOpen: false,
    }),
  isEditPanelInSidebar: false,
  showEditPanelInSidebar: () =>
    set({
      isEditPanelInSidebar: true,
      isColourPanelInSidebar: false,
      isColourPanelOpen: false,
      isTransparencyPanelOpen: false,
    }),
  hideEditPanel: () =>
    set({
      isEditPanelInSidebar: false,
    }),
  maxVisibleItems: 5,
}));
