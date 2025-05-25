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

    // Initialise the Knowbot instance.
    this._init();
  }

  _init() {
    // Render UI elements.
    this._render();

    // Cache element references after rendering.
    this.el.button = document.getElementById(this.id.button);
    this.el.closeButton = document.getElementById(this.id.closeButton);
    this.el.iframeWrapper = document.getElementById(this.id.iframeWrapper);

    // Set up event listeners.
    this._eventListeners();
  }

  _eventListeners() {
    // Show the iframe when the button is clicked.
    if (this.options.button) {
      this.el.button.addEventListener("click", () => {
        this._openKnowbot();
      });
    }

    // Close the iframe and restore floating button.
    if (this.el.closeButton) {
      this.el.closeButton.addEventListener("click", () => {
        this._closeKnowbot();
      });
    }

    // Set up scroll position based display.
    window.addEventListener("scroll", () => {
      if (
        window.pageYOffset >= this.options.buttonWindowScrollDistance ||
        window.innerHeight >= this.options.buttonWindowMinHeight
      ) {
        document.body.classList.add("knowbot-active");
      } else {
        document.body.classList.remove("knowbot-active");
      }
    });

    // Initial scroll check.
    if (
      window.pageYOffset >= this.options.buttonWindowScrollDistance ||
      window.innerHeight >= this.options.buttonWindowMinHeight
    ) {
      document.body.classList.add("knowbot-active");
    } else {
      document.body.classList.remove("knowbot-active");
    }
  }

  _openKnowbot() {
    // Create iframe if it doesn't already exist.
    if (!document.getElementById(this.id.iframe)) {
      let iframe = document.createElement("iframe");
      iframe.id = this.id.iframe;
      iframe.src = this.options.url;
      iframe.setAttribute("aria-hidden", "true");
      this.el.iframeWrapper.appendChild(iframe);
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
  }

  _closeKnowbot() {
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
  }

  _render() {
    // Start building the HTML.
    let html = ``;

    // Add floating button if enabled.
    if (this.options.button) {
      html += `
        <knowbot-button id="${this.id.button}" role="button" tabindex="0" aria-label="${this.options.buttonAriaLabel}">
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
                    aria-label="${this.options.closeButtonAriaLabel}"
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

    // Add HTML to the end of the document body.
    document.body.insertAdjacentHTML("beforeend", html);

    // Set up static buttons if enabled.
    /*if (this.options.staticButton) {
      let staticButtons = document.querySelectorAll(
        this.options.staticButtonSelector,
      );
      staticButtons.forEach((button) => {
        button.innerHTML = this.options.staticbutton;
        button.classList.add("knowbot-open");

        // Add click event listener to static buttons
        button.addEventListener("click", (event) => {
          this._openKnowbot();
          event.preventDefault();
        });
      });
      }*/
  }
}

// Default options.
Knowbot.defaults = {
  url: "",
  customButton: ".knowbot",
  button: "Ask Me !",
  buttonAriaLabel: "Ask Knowbot a question",
  buttonTextColor: false,
  buttonTextColorHover: false,
  buttonBgColor: false,
  buttonBgColorHover: false,
  buttonWindowMinHeight: 600,
  buttonWindowScrollDistance: 150,
  closeText: "Close",
  closeAriaLabel: "Close Knowbot",
};

// Support module based instances.
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
