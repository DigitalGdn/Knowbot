# Knowbot - AI for nonprofits

## Installation

Getting Knowbot onto your website is simple! You'll add a few lines of code to your website's HTML.

**1. Link the Stylesheet**: This tells the browser how Knowbot should look. Add this line inside the `<head>` section of your HTML:
```
<!-- Knowbot CSS (from CDN) -->
<link rel="stylesheet" href="./knowbot.css" media="screen" />
```

**2. Include the JavaScript**: This adds Knowbot's functionality. Add this line, also preferably within `<head>` (or before your closing `</body>` tag, but before the configuration script below):
```
<!-- Knowbot JavaScript (from CDN) -->
<script src="./knowbot.js"></script>
```

**3. Configure Knowbot**: This is where you tell Knowbot how to behave and look on your site. Add the following `<script>` block. You can place this within your `<head>` (as shown in [example.html](example.html) or just before your closing `</body>` tag, but it must come after you've included knowbot.js.
```
<!-- Knowbot Configuration -->
<script>
    // This line makes sure your page is ready before Knowbot tries to set up.
    document.addEventListener("DOMContentLoaded", () => {
        // This creates your Knowbot
        const knowbot = new Knowbot({
            // === YOUR CONFIGURATION OPTIONS GO HERE ===
            // You MUST provide the 'url'
            url: "Server URL provided by MHF",

            // --- Optional settings below ---
            // Example: Change the button text
            // button: "Ask Us Anything!",

            // Example: Change the button's background color
            // buttonBgColor: "blue",

            // Example: Disable the button on your /admin pages
            // excludePaths: ["/admin/*"]

            // Add more options from the table below, separated by commas
        });
    });
</script>
```

#### How to Add Your Configuration Options:

- Look at the [configuration options](#configuration-options table) further down this page.
- To use an option, add it inside the curly braces `{ ... }` after `new Knowbot(`.
- Each option is a key: value pair (e.g., `button: "Help"`).
- Separate multiple options with a comma (`,`).
- Strings (text) need to be in quotes (e.g., `"Ask Me !"` or `'#FF0000'`).
- Booleans are `true` or `false` (without quotes).
- Numbers are written directly (e.g., `400`).
- Arrays (lists) are in square brackets [] (e.g., `['/contact', '/about']`).

#### Important for Rookies:

- The url option is required. You'll get this from MHF.
- If you don't specify an optional setting, Knowbot will use its default value (see the "Default" column in the table).
- JavaScript is case-sensitive! `buttonTextColor` (correct) is different from `buttontextcolor` (incorrect).
- Make sure your CDN links for knowbot.css and knowbot.js are correct.

## Ways users can launch Knowbot

You can use one or both of the following methods:

### 1. Floating button (automatic/default)

An 'Ask Me' floating button is displayed in the bottom right of the screen by default. [Configuration options](#configuration-options) let you easily customise or disable this.

### 2. Button/link (custom)

You can add your own link or button to your website header or page content.

To connect it to Knowbot assign the class `.knowbot` or set the link to `#knowbot`.

We handle the logic but the styling of the button is up to you.

## Configuration options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `url` | `''` | Server URL (provided by MHF) - **Required** |
| `button` | `string` \| `boolean` | `'Ask Me !'` | Text to show in the floating button or false to disable |
| `buttonAriaLabel` | `string` | `'Ask Knowbot a question'` | Floating button screen reader friendly text |
| `buttonTextColor` | `string` | `'#ffffff'` | Button text colour |
| `buttonTextColorHover` | `string` | `'#2f2b36'` | Button text colour on hover |
| `buttonBgColor` | `string` | `'#2f2b36'` | Button background colour |
| `buttonBgColorHover` | `string` | `'#f7f7f7'` | Button background colour on hover |
| `buttonBorderColor` | `string` | `'#2f2b36'` | Button border colour |
| `buttonBorderColorHover` | `string` | `'#2f2b36'` | Button border colour on hover |
| `buttonBorderRadius` | `string` | `'10px'` | Button border radius |
| `buttonBoxShadow` | `string` | `'0 0.3rem 0.6rem rgba(2, 2, 3, 0.2)'` | Button box shadow |
| `buttonFontFamily` | `string` | `'inherit'` | Button font family, defaults to your page body font |
| `buttonFontWeight` | `string` | `'bold'` | Button font weight |
| `buttonFontSize` | `string` | `'16px'` | Button font size for small/medium screens |
| `buttonFontSizeLarge` | `string` | `'18px'` | Button font size for large screens |
| `buttonPadding` | `string` | `'0.9em 1.3rem 0.8em'` | Button padding |
| `buttonConditionWindowMinHeight` | `number` | `400` | The window has to be at least this tall to show the floating button |
| `buttonConditionScrollDistance` | `number` | `150` | Show floating button after a certain scroll position |
| `iframeBorderColor` | `string` | `'#777777'` | iFrame border colour |
| `iframeBorderRadius` | `string` | `'20px'` | iFrame border radius |
| `iframeBoxShadow` | `string` | `'0 0.625rem 1.875rem rgba(2, 2, 3, 0.28)'` | iFrame box shadow |
| `iframeCloseAriaLabel` | `string` | `'Close Knowbot'` | Close button screen reader friendly text |
| `iframeOpacity` | `number` | `1` | iFrame opacity between 0.95 and 1 |
| `iframeResetOnClose` | `boolean` | `false` | Whether to reset the iframe on close |
| `excludePaths` | `string[]` | `[]` | Disable Knowbot on certain pages |

## FAQs

**Can I use my existing CSS variables for colours?**

Yes, you can pass these as a string for example `'var(--accent)'`.

**Can I disable Knowbot on certain pages?**

Yes, pass an array of paths to `excludePaths` to disable Knowbot on certain pages. You can use `*` for wildcard matching at the end of the path. For example `['/example/*']` to disable Knowbot on a parent page and its sub-pages. To add an additional exclusion, an example would be `['/example/*', '/another-example/*']`.

**I have a question, how should I contact you?**

Please visit [knowbot.uk](https://www.knowbot.uk]) and use the contact form.
