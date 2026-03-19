import React, { useState, useEffect } from "react";
import { useNavMenuStyleStore } from "../../../stores/navMenuStyle";

import menuIconSelected from "@/components/SideNav/EditSidebarPanel/assets/menu-icon-selected.svg";
import menuIconUnselected from "@/components/SideNav/EditSidebarPanel/assets/menu-icon-unselected.svg";
import scrollIconSelected from "@/components/SideNav/EditSidebarPanel/assets/scroll-icon-selected.svg";
import scrollIconUnselected from "@/components/SideNav/EditSidebarPanel/assets/scroll-icon-unselected.svg";
import switchOn from "@/components/SideNav/EditSidebarPanel/assets/switch-on.svg";
import switchOff from "@/components/SideNav/EditSidebarPanel/assets/switch-off.svg";

// AVA COME BACK TO THIS
// import AddPageIcon from "@/components/SideNav/EditSidebarPanel/assets/add-menu-item-button.svg?react";
import LofiAddPageIcon from "@/components/SideNav/EditSidebarPanel/assets/lofi-add-menu-item-button.svg?react";

import "./style.css";

// Navigation menu item interface
interface NavMenuItem {
  id: string;
  name: string;
  icon: string;
}

const EditSidebarPanel: React.FC = () => {
  const {
    hideEditPanel,
    overflowType,
    setOverflowType,
    applyToAll,
    setApplyToAll,
    getEffectiveShowLogo,
    setShowLogo,
    isEditPanelInSidebar,
  } = useNavMenuStyleStore();
  const [activeTab, setActiveTab] = useState<"properties" | "items">("properties");
  const [scrollVisibilityToggle, setScrollVisibilityToggle] = useState(true);

  // Get effective logo visibility from store
  const logoToggle = getEffectiveShowLogo();

  // Navigation menu items - start empty, will be populated from canvases
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);

  // State for add menu popup
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState({ top: 0, left: 0 });
  const [externalLinkToggle, setExternalLinkToggle] = useState(false);
  const addMenuRef = React.useRef<HTMLDivElement>(null);

  // State for inline editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const editInputRef = React.useRef<HTMLInputElement>(null);

  // Effect to initialize menu items from existing canvases
  useEffect(() => {
    // Custom event to request current canvases from MainContainer
    const requestCanvasesEvent = new CustomEvent("request-canvases");
    window.dispatchEvent(requestCanvasesEvent);

    // Listen for response with all canvases
    const handleCanvasesResponse = (event: CustomEvent) => {
      const { canvases } = event.detail;
      if (canvases && Array.isArray(canvases)) {
        // Map canvases to menu items
        const canvasMenuItems = canvases.map(canvas => ({
          id: String(canvas.id),
          name: canvas.title || canvas.pageName || `Page ${canvas.id}`,
          icon: "page",
        }));

        // Replace all menu items with canvas items only
        setMenuItems(canvasMenuItems);
      }
    };

    window.addEventListener("canvases-response", handleCanvasesResponse as EventListener);

    return () => {
      window.removeEventListener("canvases-response", handleCanvasesResponse as EventListener);
    };
  }, []);

  // Effect to refresh canvas data when edit panel becomes visible
  useEffect(() => {
    if (isEditPanelInSidebar) {
      // Request fresh canvas data when panel becomes visible
      const requestCanvasesEvent = new CustomEvent("request-canvases");
      window.dispatchEvent(requestCanvasesEvent);
    }
  }, [isEditPanelInSidebar]);

  // Effect to sync with canvases from MainContainer when mounted and when they change
  useEffect(() => {
    // Function to sync menu items when canvases change
    const handleCanvasChange = (event: CustomEvent) => {
      // Get the updated canvas data from the event
      const { canvas } = event.detail;

      if (canvas) {
        // Convert canvas data to a menu item
        const menuItem = {
          id: String(canvas.id),
          name: canvas.title || canvas.pageName || `Page ${canvas.id}`,
          icon: "page",
        };

        // Use functional update to avoid dependency on menuItems
        setMenuItems(prevMenuItems => {
          // Check if this menu item already exists
          const existingItemIndex = prevMenuItems.findIndex(item => item.id === menuItem.id);

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedMenuItems = [...prevMenuItems];
            updatedMenuItems[existingItemIndex] = menuItem;
            return updatedMenuItems;
          } else {
            // Add new item
            return [...prevMenuItems, menuItem];
          }
        });
      }
    };

    // Add event listeners for canvas changes
    window.addEventListener("canvas-added", handleCanvasChange as EventListener);
    window.addEventListener("canvas-updated", handleCanvasChange as EventListener);

    return () => {
      // Clean up event listeners
      window.removeEventListener("canvas-added", handleCanvasChange as EventListener);
      window.removeEventListener("canvas-updated", handleCanvasChange as EventListener);
    };
  }, []); // Remove dependency on menuItems

  // Handle clicks outside the add menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };

    if (isAddMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddMenuOpen]);

  // Handle overflow type change
  const handleOverflowTypeChange = (type: "menu" | "scroll") => {
    setOverflowType(type);
  };

  // Handle clicking the Add button to open the popup menu
  const handleAddButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Add menu item functionality disabled for website navigation
    // setIsAddMenuOpen(!isAddMenuOpen);
  };

  // Add new menu item
  const handleAddMenuItem = () => {
    const newItem: NavMenuItem = {
      id: `item-${Date.now()}`,
      name: "New Item",
      icon: "default",
    };
    setMenuItems([...menuItems, newItem]);

    // Dispatch custom event to notify other components
    const event = new CustomEvent("menu-item-added", {
      detail: { menuItem: newItem },
    });
    window.dispatchEvent(event);

    // Close the popup menu
    setIsAddMenuOpen(false);
  };

  // Handle adding a new page from the popup
  const handleAddNewPage = () => {
    // Generate a timestamp-based ID for uniqueness
    const timestamp = Date.now();
    const newPageId = `page-${timestamp}`;

    // Create new page item for menu
    const newItem: NavMenuItem = {
      id: newPageId,
      name: `Page ${menuItems.length + 1}`,
      icon: "page",
    };

    setMenuItems([...menuItems, newItem]);

    // First, dispatch an event to request a new canvas creation in MainContainer
    const newCanvasEvent = new CustomEvent("new-canvas-requested", {
      detail: {
        pageTitle: newItem.name,
        id: menuItems.length + 1, // Use a numeric ID for the canvas
        timestamp: timestamp,
      },
    });
    window.dispatchEvent(newCanvasEvent);

    // Then, dispatch the menu item event for any other components
    const menuEvent = new CustomEvent("menu-item-added", {
      detail: { menuItem: newItem, type: "page" },
    });
    window.dispatchEvent(menuEvent);

    // Close the popup menu
    setIsAddMenuOpen(false);
  };

  // Handle adding an external link from the popup
  const handleAddExternalLink = () => {
    // Create new external link item
    const newItem: NavMenuItem = {
      id: `link-${Date.now()}`,
      name: "External Link",
      icon: "link",
    };

    setMenuItems([...menuItems, newItem]);

    // Dispatch custom event to notify other components
    const event = new CustomEvent("menu-item-added", {
      detail: { menuItem: newItem, type: "link", isExternal: true },
    });
    window.dispatchEvent(event);

    // Close the popup menu
    setIsAddMenuOpen(false);
  };

  // Handle removing all navigation functionality
  const handleRemoveAll = () => {
    // Remove all navigation menu items functionality
    // Dispatch custom event to notify MainContainer to hide the navigation bar
    const removeNavEvent = new CustomEvent("navigation-menu-remove-all");
    window.dispatchEvent(removeNavEvent);

    // Close the edit panel
    hideEditPanel();
  };

  // Handle starting inline edit for menu item name
  const handleStartEdit = (item: NavMenuItem) => {
    setEditingItemId(item.id);
    setEditingValue(item.name);
  };

  // Handle saving the edited name
  const handleSaveEdit = () => {
    if (editingItemId && editingValue.trim()) {
      // Update the menu item name locally
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItemId ? { ...item, name: editingValue.trim() } : item
        )
      );

      // Dispatch event to notify other components about the name change
      const event = new CustomEvent("menu-item-renamed", {
        detail: {
          itemId: editingItemId,
          newName: editingValue.trim(),
          type: "page",
        },
      });
      window.dispatchEvent(event);

      // If this is a canvas page, also update the canvas title
      // Check if the ID represents a canvas (either numeric string or starts with "page-")
      const numericId = parseInt(editingItemId);
      if (!isNaN(numericId) || editingItemId.startsWith("page-")) {
        const canvasUpdateEvent = new CustomEvent("canvas-title-update", {
          detail: {
            canvasId: !isNaN(numericId) ? numericId : editingItemId, // Use numeric ID for existing canvases
            newTitle: editingValue.trim(),
          },
        });
        window.dispatchEvent(canvasUpdateEvent);
      }
    }

    // Exit edit mode
    setEditingItemId(null);
    setEditingValue("");
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingValue("");
  };

  // Handle key press in edit input
  const handleEditKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSaveEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      handleCancelEdit();
    }
  };

  // Focus the input when editing starts
  React.useEffect(() => {
    if (editingItemId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingItemId]);

  return (
    <div className="edit-sidebar-panel">
      <div className="edit-sidebar-header">
        <h2>Navigation Menu</h2>
        <button className="close-button" onClick={hideEditPanel}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="edit-tabs">
        <button
          className={`edit-tab ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          Properties
        </button>
        <button
          className={`edit-tab ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          Items
        </button>
        <div
          className="tab-indicator"
          style={{ left: activeTab === "properties" ? "0" : "50%" }}
        ></div>
      </div>

      <div className="edit-sidebar-content">
        {activeTab === "properties" && (
          <>
            <div className="edit-option">
              <div className="edit-option-label">Logo</div>
              <div className="edit-toggle">
                <img
                  src={logoToggle ? switchOn : switchOff}
                  alt="Toggle switch"
                  className="toggle-switch-img"
                  onClick={() => setShowLogo(!logoToggle)}
                />
              </div>
            </div>

            <div className="edit-option">
              <div className="edit-option-label">Visible when scrolling</div>
              <div className="edit-toggle">
                <img
                  src={scrollVisibilityToggle ? switchOn : switchOff}
                  alt="Toggle switch"
                  className="toggle-switch-img"
                  onClick={() => setScrollVisibilityToggle(!scrollVisibilityToggle)}
                />
              </div>
            </div>

            <div className="edit-option">
              <div className="edit-option-label">Overflow items</div>
            </div>

            <div className="overflow-options">
              <div className="overflow-option" onClick={() => handleOverflowTypeChange("menu")}>
                <img
                  src={overflowType === "menu" ? menuIconSelected : menuIconUnselected}
                  alt="Menu Icon"
                  className="overflow-icon-img"
                />
                <div className="overflow-label">Menu Icon</div>
              </div>
              <div className="overflow-option" onClick={() => handleOverflowTypeChange("scroll")}>
                <img
                  src={overflowType === "scroll" ? scrollIconSelected : scrollIconUnselected}
                  alt="Scroll Icon"
                  className="overflow-icon-img"
                />
                <div className="overflow-label">Scroll</div>
              </div>
            </div>

            <div className="edit-section-divider"></div>

            <div className="edit-option">
              <div className="edit-option-label">Apply changes to all</div>
              <div className="edit-toggle">
                <img
                  src={applyToAll ? switchOn : switchOff}
                  alt="Toggle switch"
                  className="toggle-switch-img"
                  onClick={() => setApplyToAll(!applyToAll)}
                />
              </div>
            </div>

            <div className="edit-section-divider"></div>

            <div className="edit-option">
              <div className="edit-option-label">Show menu on</div>
              <div className="pages-dropdown">
                <div className="dropdown-value">All pages (4)</div>
              </div>
            </div>

            <div className="remove-section">
              <button className="remove-button" onClick={handleRemoveAll}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Remove all</span>
              </button>
            </div>
          </>
        )}

        {activeTab === "items" && (
          <div className="items-content">
            {menuItems.length > 0 ? (
              <div className="menu-items-list">
                {menuItems.map(item => (
                  <div key={item.id} className="items-menu-item">
                    <div className="items-menu-item-container-left">
                      <div className="menu-item-icon">
                        <img
                          src="@assets/icons/navigation-icons/items-menu/page-icon.svg"
                          alt="Page Icon"
                        />
                      </div>
                      <div className="menu-item-page-name">
                        <div className="menu-item-page-name-icon"></div>
                        {editingItemId === item.id ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={handleEditKeyPress}
                            className="menu-item-name-input"
                          />
                        ) : (
                          <div className="menu-item-name" onClick={() => handleStartEdit(item)}>
                            {item.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="items-menu-item-container-right">
                      <div className="menu-item-more-icon">
                        <img
                          src="@assets/icons/navigation-icons/items-menu/more-menu-item-button-no-border.svg"
                          alt="More Options"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="edit-notice">
                <div className="edit-notice-lofi-icon">
                  <div className="edit-notice-lofi-icon-img"></div>
                  <div className="edit-notice-lofi-icon-text" style={{ width: "100px" }}></div>
                </div>
                <div className="edit-notice-lofi-icon">
                  <div className="edit-notice-lofi-icon-img"></div>
                  <div className="edit-notice-lofi-icon-text" style={{ width: "160px" }}></div>
                </div>
                <div className="edit-notice-lofi-icon">
                  <div className="edit-notice-lofi-icon-img"></div>
                  <div className="edit-notice-lofi-icon-text" style={{ width: "120px" }}></div>
                </div>
                <div className="edit-notice-lofi-icon">
                  <div className="edit-notice-lofi-icon-img"></div>
                  <div className="edit-notice-lofi-icon-text" style={{ width: "130px" }}></div>
                </div>
              </div>
            )}

            <div className="menu-item-add-button-container">
              <button className="menu-item-add-button" onClick={handleAddButtonClick}>
                <LofiAddPageIcon />
              </button>
            </div>

            {/* Add Item Popup */}
            {isAddMenuOpen && (
              <div className="add-item-popup" ref={addMenuRef}>
                <div className="add-item-option" onClick={handleAddNewPage}>
                  <img
                    src="@assets/icons/navigation-icons/items-menu/add-new-page-button.svg"
                    alt="Add Page Icon"
                  />
                </div>

                <div className="add-item-option" onClick={handleAddExternalLink}>
                  <img
                    src="@assets/icons/navigation-icons/items-menu/add-external-link-button.svg"
                    alt="Add external link Icon"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSidebarPanel;
