/*!
 * Knowbot JavaScript Library
 * Version: 1.0.2
 * https://www.knowbot.uk
 * Copyright Mike Hudson Foundation
 *
 * Integrate Knowbot with your website.
 * Works as both global script and ES6 module.
 *
 * Author: Ben Knowles, digitalgarden.co
 * Released under the GPLv3 license
 */

class Knowbot {
  constructor(options = {}) {
    // Merge user-provided options over the default options.
    this.options = { ...Knowbot.defaults, ...options };

    // Validate options.
    this._validateOptions();

    // DOM element IDs and selectors.
    this.id = {
      button: "knowbot-button",
      closeButton: "knowbot-close",
      iframeWrapper: "knowbot-iframe-wrapper",
      iframe: "knowbot-iframe",
      container: "knowbot-container",
    };

    // Cache DOM element references.
    this.el = {};

    // Mobile breakpoint.
    this._mobileBreakpoint = 688; // Device pixel width. Needs to match CSS media query.

    // Scrolling enabled.
    this._scrollingEnabled = true; // Store the scrolling status.

    // Timeout duration.
    this.timeoutDuration = 3600000; // 60 minutes.

    // Timer reference.
    this.timer = undefined;

    // Track open state.
    this.isOpen = false;

    // Cache body classList.
    this._bodyClassList = document.body.classList;

    // Throttle/debounce timers.
    this._scrollThrottleTimer = null;
    this._interactionDebounceTimer = null;

    // Scroll prevention storage.
    this._originalScrollY = 0;
    this._originalBodyStyle = {};

    // Initialize the Knowbot instance.
    this._init();
  }

  _validateOptions() {
    // Validate options object.
    if (typeof this.options !== "object" || this.options === null) {
      throw new Error("Knowbot: Options must be an object.");
    }

    // Validate required URL.
    this._validateUrl();

    // Validate string options.
    this._validateStringOptions();

    // Validate boolean options.
    this._validateBooleanOptions();

    // Validate numeric options.
    this._validateNumericOptions();

    // Validate excludePaths array.
    this._validateExcludePaths();

    // Validate boolean/mixed options.
    this._validateMixedOptions();
  }

  _validateUrl() {
    // Check if URL is provided.
    if (
      !this.options.url ||
      typeof this.options.url !== "string" ||
      this.options.url.trim() === ""
    ) {
      throw new Error(
        "Knowbot: URL option is required and must be a non-empty string.",
      );
    }

    // Validate URL format.
    try {
      new URL(this.options.url);
    } catch (error) {
      throw new Error(
        `Knowbot: Invalid URL format provided: "${this.options.url}". Please provide a valid URL.`,
      );
    }
  }

  _validateStringOptions() {
    const stringOptions = [
      "buttonAriaLabel",
      "buttonTextColor",
      "buttonTextColorHover",
      "buttonBgColor",
      "buttonBgColorHover",
      "buttonFontFamily",
      "buttonFontWeight",
      "buttonFontSize",
      "buttonFontSizeLarge",
      "buttonBorderColor",
      "buttonBorderColorHover",
      "buttonBorderRadius",
      "buttonBoxShadow",
      "buttonPadding",
      "iframeBorderColor",
      "iframeBorderRadius",
      "iframeBoxShadow",
      "iframeCloseAriaLabel",
    ];

    stringOptions.forEach((option) => {
      if (
        this.options[option] !== undefined &&
        typeof this.options[option] !== "string"
      ) {
        throw new Error(
          `Knowbot: Option "${option}" must be a string, received ${typeof this.options[option]}.`,
        );
      }
    });
  }

  _validateBooleanOptions() {
    const booleanOptions = [
      "iframeResetOnClose",
      "disableBackgroundScrollOnMobile",
    ];

    booleanOptions.forEach((option) => {
      if (
        this.options[option] !== undefined &&
        typeof this.options[option] !== "boolean"
      ) {
        throw new Error(
          `Knowbot: Option "${option}" must be a boolean, received ${typeof this.options[option]}.`,
        );
      }
    });
  }

  _validateNumericOptions() {
    const numericOptions = [
      "buttonConditionWindowMinHeight",
      "buttonConditionScrollDistance",
      "iframeOpacity",
    ];

    numericOptions.forEach((option) => {
      if (this.options[option] !== undefined) {
        if (
          typeof this.options[option] !== "number" ||
          isNaN(this.options[option]) ||
          this.options[option] < 0 ||
          (option === "iframeOpacity" &&
            (this.options[option] < 0.95 || this.options[option] > 1))
        ) {
          throw new Error(
            option === "iframeOpacity"
              ? `Knowbot: Option "${option}" must be between 0.95 and 1, received ${this.options[option]}.`
              : `Knowbot: Option "${option}" must be a non-negative number, received ${this.options[option]}.`,
          );
        }
      }
    });
  }

  _validateExcludePaths() {
    // Validate excludePaths array.
    if (this.options.excludePaths !== undefined) {
      if (!Array.isArray(this.options.excludePaths)) {
        throw new Error(
          `Knowbot: Option "excludePaths" must be an array, received ${typeof this.options.excludePaths}.`,
        );
      }
      this.options.excludePaths.forEach((path, index) => {
        if (typeof path !== "string") {
          throw new Error(
            `Knowbot: All items in "excludePaths" must be strings, item at index ${index} is ${typeof path}.`,
          );
        }
      });
    }
  }

  _validateMixedOptions() {
    // Validate button option (string or false).
    if (
      this.options.button !== undefined &&
      this.options.button !== false &&
      typeof this.options.button !== "string"
    ) {
      throw new Error(
        `Knowbot: Option "button" must be a string or false, received ${typeof this.options.button}.`,
      );
    }

    // Check for unknown options.
    const validOptions = Object.keys(Knowbot.defaults);
    Object.keys(this.options).forEach((option) => {
      if (!validOptions.includes(option)) {
        console.warn(`Knowbot: Unknown option "${option}" will be ignored.`);
      }
    });
  }

  _init() {
    // Render UI elements.
    this._render();

    // Cache element references after rendering.
    this.el.button = document.getElementById(this.id.button);
    this.el.closeButton = document.getElementById(this.id.closeButton);
    this.el.iframe = undefined; // Dynamically set later.
    this.el.iframeWrapper = document.getElementById(this.id.iframeWrapper);
    this.el.launchers = document.querySelectorAll(
      '[href="#knowbot"], .knowbot',
    );

    // Initial scroll check.
    this._updateActiveClass();

    // Set up event listeners.
    this._eventListeners();
  }

  _eventListeners() {
    // Open Knowbot when the floating button is clicked.
    if (this.options.button) {
      this.el.button.addEventListener("click", () => {
        this._openKnowbot();
      });
    }

    // Open Knowbot when a launcher button or link is clicked.
    if (this.el.launchers) {
      this.el.launchers.forEach((launcher) => {
        launcher.addEventListener("click", (e) => {
          this._openKnowbot();
          e.preventDefault();
        });
      });
    }

    // Close the iframe and restore floating button.
    if (this.el.closeButton) {
      this.el.closeButton.addEventListener("click", () => {
        this._closeKnowbot();
      });
    }

    // Set up scroll position based display with throttling.
    window.addEventListener("scroll", () => {
      this._throttledScrollHandler();
    });

    // Add user interaction listeners to reset timer when Knowbot is open with debouncing.
    window.addEventListener("mousemove", () => {
      this._debouncedInteractionEvent();
    });
    window.addEventListener("touchstart", () => {
      this._debouncedInteractionEvent();
    });
    window.addEventListener("keydown", () => {
      this._debouncedInteractionEvent();
    });
  }

  _throttledScrollHandler() {
    // Throttle scroll events to improve performance.
    if (this._scrollThrottleTimer) return;

    this._scrollThrottleTimer = setTimeout(() => {
      this._updateActiveClass();
      this._scrollThrottleTimer = null;
    }, 16); // ~60fps
  }

  _debouncedInteractionEvent() {
    // Debounce user interactions to prevent excessive timer resets.
    clearTimeout(this._interactionDebounceTimer);
    this._interactionDebounceTimer = setTimeout(() => {
      this._interactionEvent();
    }, 100); // 100ms debounce
  }

  _interactionEvent() {
    // Reset timer if Knowbot is open.
    if (this.isOpen) {
      this._startOrResetTimer();
    }
  }

  _openKnowbot() {
    // Set open state.
    this.isOpen = true;

    // Add knowbot-open class to body.
    this._bodyClassList.add("knowbot-open");

    // Create iframe if it doesn't already exist.
    if (!this.el.iframe) {
      const iframe = document.createElement("iframe");
      iframe.id = this.id.iframe;
      iframe.src = this.options.url;
      iframe.setAttribute("aria-hidden", "true");
      this.el.iframeWrapper.appendChild(iframe);
      this.el.iframe = iframe;
    } else if (this.el.iframe.src !== this.options.url) {
      // Restore iframe src if it was reset by timer.
      this.el.iframe.src = this.options.url;
    }

    // Show iframe wrapper.
    this.el.iframeWrapper.style.display = "block";

    // Accessibility.
    this.el.iframe.setAttribute("aria-hidden", "false");

    // Show close button.
    this.el.closeButton.style.display = "block";

    // Hide floating button.
    if (this.options.button) {
      this.el.button.style.display = "none";
    }

    // Disable background scrolling (Safari-compatible) on mobile viewports.
    if (this.options.disableBackgroundScrollOnMobile) {
      if (window.innerWidth <= this._mobileBreakpoint) {
        this._disableBackgroundScroll();
      }
    }

    // Start timer.
    this._startOrResetTimer();

    // Update active class.
    this._updateActiveClass();
  }

  _closeKnowbot() {
    // Set closed state.
    this.isOpen = false;

    // Remove knowbot-open class from body.
    this._bodyClassList.remove("knowbot-open");

    // Hide iframe wrapper.
    this.el.iframeWrapper.style.display = "none";

    // Accessibility.
    this.el.iframe.setAttribute("aria-hidden", "true");

    // Hide close button.
    this.el.closeButton.style.display = "none";

    // Show floating button.
    if (this.options.button) {
      this.el.button.style.display = "block";
    }

    // Enable background scrolling if it was disabled.
    this._enableBackgroundScroll();

    // Update active class.
    this._updateActiveClass();

    // Reset iframe.
    if (this.options.iframeResetOnClose) {
      this._resetIframe();
    }
  }

  _render() {
    // Start building the HTML.
    let html = ``;

    // Add floating button if enabled.
    if (this.options.button) {
      html += `
        <knowbot-button
            id="${this.id.button}"
            role="button"
            tabindex="0"
            aria-label="${this.options.buttonAriaLabel}"
            style=""
        >
            <span>${this.options.button}</span>
        </knowbot-button>
      `;
    }

    // Iframe wrapper and close button.
    html += `
        <div id="${this.id.container}">
            <div id="${this.id.iframeWrapper}">
                <knowbot-button
                    id="${this.id.closeButton}"
                    role="button"
                    tabindex="0"
                    style="display: none"
                    aria-label="${this.options.iframeCloseAriaLabel}"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"
                        ></path>
                    </svg>
                </knowbot-button>
            </div>
        </div>
    `;

    // CSS variables
    html += `
        <style type="text/css">
            #knowbot-button {
              --knowbot-button-bg-color: ${this.options.buttonBgColor};
              --knowbot-button-bg-color-hover: ${this.options.buttonBgColorHover};
              --knowbot-button-text-color: ${this.options.buttonTextColor};
              --knowbot-button-text-color-hover: ${this.options.buttonTextColorHover};
              --knowbot-button-font-family: ${this.options.buttonFontFamily};
              --knowbot-button-font-weight: ${this.options.buttonFontWeight};
              --knowbot-button-font-size: ${this.options.buttonFontSize};
              --knowbot-button-font-size-large: ${this.options.buttonFontSizeLarge};
              --knowbot-button-border-color: ${this.options.buttonBorderColor};
              --knowbot-button-border-color-hover: ${this.options.buttonBorderColorHover};
              --knowbot-button-border-radius: ${this.options.buttonBorderRadius};
              --knowbot-button-box-shadow: ${this.options.buttonBoxShadow};
              --knowbot-button-padding: ${this.options.buttonPadding};
            }

            #knowbot-iframe {
              --knowbot-iframe-border-color: ${this.options.iframeBorderColor};
              --knowbot-iframe-border-radius: ${this.options.iframeBorderRadius};
              --knowbot-iframe-box-shadow: ${this.options.iframeBoxShadow};
              --knowbot-iframe-opacity: ${this.options.iframeOpacity};
            }
        </style>
    `;

    // Add HTML to the end of the document body.
    document.body.insertAdjacentHTML("beforeend", html);
  }

  _updateActiveClass() {
    const shouldBeActive =
      this.isOpen ||
      (this._checkScrollConditions() && !this._isCurrentPathExcluded());

    // Only modify DOM if state actually changed.
    if (shouldBeActive && !this._bodyClassList.contains("knowbot-active")) {
      this._bodyClassList.add("knowbot-active");
    } else if (
      !shouldBeActive &&
      this._bodyClassList.contains("knowbot-active")
    ) {
      this._bodyClassList.remove("knowbot-active");
    }
  }

  _checkScrollConditions() {
    // Cache scroll condition results to avoid repeated calculations.
    const currentScroll = window.pageYOffset;
    const currentHeight = window.innerHeight;

    return (
      currentScroll >= this.options.buttonConditionScrollDistance ||
      currentHeight >= this.options.buttonConditionWindowMinHeight
    );
  }

  _isCurrentPathExcluded() {
    // Check if current URL path is in excludePaths array.
    if (
      !this.options.excludePaths ||
      !Array.isArray(this.options.excludePaths)
    ) {
      return false;
    }

    const currentPath = window.location.pathname;
    return this.options.excludePaths.some((excludePath) => {
      // Support both exact matches and wildcard patterns.
      if (excludePath.endsWith("*")) {
        return currentPath.startsWith(excludePath.slice(0, -1));
      }
      return currentPath === excludePath;
    });
  }

  _startOrResetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // On timeout clear iframe connection and close Knowbot.
      this._resetIframe();
      this._closeKnowbot();
    }, this.timeoutDuration);
  }

  _resetIframe() {
    if (this.el.iframe) {
      this.el.iframe.src = "about:blank";
    }
  }

  _disableBackgroundScroll() {
    // Update the current scrolling status.
    this._scrollingEnabled = false;

    // Store current scroll position and body styles.
    this._originalScrollY = window.pageYOffset;
    this._originalBodyStyle.position = document.body.style.position;
    this._originalBodyStyle.top = document.body.style.top;
    this._originalBodyStyle.width = document.body.style.width;
    this._originalBodyStyle.overflow = document.body.style.overflow;

    // Apply styles to prevent scrolling (Safari-compatible).
    document.body.style.position = "fixed";
    document.body.style.top = `-${this._originalScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  _enableBackgroundScroll() {
    if (!this._scrollingEnabled) {
      // Update the current scrolling status.
      this._scrollingEnabled = true;

      // Restore original body styles.
      document.body.style.position = this._originalBodyStyle.position || "";
      document.body.style.top = this._originalBodyStyle.top || "";
      document.body.style.width = this._originalBodyStyle.width || "";
      document.body.style.overflow = this._originalBodyStyle.overflow || "";

      // Restore scroll position.
      if (this._originalScrollY > 0) {
        window.scrollTo(0, this._originalScrollY);
      }
    }
  }
}

// Default options.
Knowbot.defaults = {
  url: "", // Required server URL.
  button: "Ask Me !", // text or false to disable.
  buttonAriaLabel: "Ask Knowbot a question", // accessible text for screen readers.
  buttonTextColor: "#FFFFFF",
  buttonTextColorHover: "#2F2B36",
  buttonBgColor: "#7B62DF",
  buttonBgColorHover: "#FFFFFF",
  buttonBorderColor: "#7B62DF",
  buttonBorderColorHover: "#2F2B36",
  buttonBorderRadius: "10px",
  buttonBoxShadow: "0 0.3rem 0.6rem rgba(2, 2, 3, 0.2)",
  buttonFontFamily: "sans-serif",
  buttonFontWeight: "bold",
  buttonFontSize: "16px",
  buttonFontSizeLarge: "18px",
  buttonPadding: "0.875em 1.3rem 0.825em",
  buttonConditionWindowMinHeight: 400,
  buttonConditionScrollDistance: 150,
  iframeBorderColor: "#777777",
  iframeBorderRadius: "20px",
  iframeBoxShadow: "0 0.625rem 1.875rem rgba(2, 2, 3, 0.28)",
  iframeCloseAriaLabel: "Close Knowbot",
  iframeOpacity: 1,
  iframeResetOnClose: false,
  disableBackgroundScrollOnMobile: false,
  excludePaths: [], // Array of URL paths where Knowbot should not be active
};

// Support module-based instances.
try {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Knowbot;
  }
  if (typeof exports !== "undefined") {
    exports.Knowbot = Knowbot;
  }
} catch (e) {
  // Module not required.
}

// Also add to global scope when in browser context.
if (typeof window !== "undefined") {
  window.Knowbot = Knowbot;
}
