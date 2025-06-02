/*!
 * Knowbot JavaScript Library
 * Version: 0.1
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

    // Timeout duration.
    this.timeoutDuration = 3600000; // 60 minutes.

    // Timer reference.
    this.timer = undefined;

    // Track open state.
    this.isOpen = false;

    // Initialise the Knowbot instance.
    this._init();
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

    // Scroll position conditional display.
    window.addEventListener("scroll", () => {
      this._updateActiveClass();
    });

    // User interaction listeners to reset timer when Knowbot is open.
    window.addEventListener("mousemove", () => {
      this._interactionEvent();
    });
    window.addEventListener("touchstart", () => {
      this._interactionEvent();
    });
    window.addEventListener("keydown", () => {
      this._interactionEvent();
    });
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

    // Show close button.
    this.el.closeButton.style.display = "block";

    // Hide floating button.
    if (this.options.button) {
      this.el.button.style.display = "none";
    }

    // Disable background scrolling.
    document.body.style.overflow = "hidden";

    // Start timer.
    this._startOrResetTimer();

    // Update active class.
    this._updateActiveClass();
  }

  _closeKnowbot() {
    // Set closed state.
    this.isOpen = false;

    // Hide iframe wrapper.
    this.el.iframeWrapper.style.display = "none";

    // Hide close button.
    this.el.closeButton.style.display = "none";

    // Show floating button.
    if (this.options.button) {
      this.el.button.style.display = "block";
    }

    // Enable background scrolling.
    document.body.style.overflow = "";

    // Update active class.
    this._updateActiveClass();
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
                    aria-label="${this.options.closeAriaLabel}"
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
            }
        </style>
    `;

    // Add HTML to the end of the document body.
    document.body.insertAdjacentHTML("beforeend", html);
  }

  _updateActiveClass() {
    // Always show active class when Knowbot is open.
    if (this.isOpen) {
      document.body.classList.add("knowbot-active");
    } else {
      // When closed, check scroll and window conditions.
      if (
        window.pageYOffset >= this.options.buttonConditionScrollDistance ||
        window.innerHeight >= this.options.buttonConditionWindowMinHeight
      ) {
        document.body.classList.add("knowbot-active");
      } else {
        document.body.classList.remove("knowbot-active");
      }
    }
  }

  _startOrResetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // On timeout clear iframe connection and close Knowbot.
      if (this.el.iframe) {
        this.el.iframe.src = "about:blank";
        this._closeKnowbot();
      }
    }, this.timeoutDuration);
  }
}

// Default options.
Knowbot.defaults = {
  url: "", // Required server URL.
  button: "Ask Me !", // text or false to disable.
  buttonAriaLabel: "Ask Knowbot a question", // accessible text for screen readers.
  buttonTextColor: "#f7f7f7",
  buttonTextColorHover: "#2f2b36",
  buttonBgColor: "#2f2b36",
  buttonBgColorHover: "#f7f7f7",
  buttonFontFamily: "sans-serif",
  buttonFontWeight: "bold",
  buttonFontSize: "16px",
  buttonFontSizeLarge: "18px",
  buttonBorderColor: "#2f2b36",
  buttonBorderColorHover: "#2f2b36",
  buttonBorderRadius: "10px",
  buttonBoxShadow: "0 0.3rem 0.6rem rgba(2, 2, 3, 0.2)",
  buttonPadding: "0.9em 1.3rem 0.8em",
  buttonConditionWindowMinHeight: 400,
  buttonConditionScrollDistance: 150,
  iframeBorderColor: "#777777",
  iframeBorderRadius: "20px",
  iframeBoxShadow: "0 0.625rem 1.875rem rgba(2, 2, 3, 0.28)",
  closeAriaLabel: "Close Knowbot",
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
