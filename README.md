# Knowbot

## Installation

Add this code to your website HTML within `<head>`:

```
<!-- Knowbot CSS -->
<link rel="stylesheet" href="./knowbot.css" media="screen" />

<!-- Knowbot JavaScript -->
<script src="./knowbot.js"></script>

<!-- Knowbot Configuration -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const knowbot = new Knowbot({
            url: "Server URL provided by MHF",
        });
    });
</script>
```

## Floating button

An 'Ask Me' button is displayed in the bottom right of the screen by default.

You can customise or disable this. Please see [configuration options](#configuration-options).

## Custom button/link

You can add your own link or button to your website header or page content.

To connect it to Knowbot assign the class `.knowbot` or set the link to `#knowbot`.

We handle the logic but the styling of the button is up to you.

## Configuration options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `url` | `''` | Server URL (provided by MHF) - **Required** |
| `button` | `string` \| `boolean` | `'Ask Me !'` | Text to show in the floating button or false to disable |
| `buttonAriaLabel` | `string` | `'Ask Knowbot a question'` | Floating button screenreader friendly text |
| `buttonTextColor` | `string` | `'#ffffff'` | Button text colour |
| `buttonTextColorHover` | `string` | `'#2f2b36'` | Button text colour on hover |
| `buttonBgColor` | `string` | `'#2f2b36'` | Button background colour |
| `buttonBgColorHover` | `string` | `'#f7f7f7'` | Button background colour on hover |
| `buttonFontFamily` | `string` | `'inherit'` | Button font family, defaults to your page body font |
| `buttonFontWeight` | `string` | `'bold'` | Button font weight |
| `buttonFontSize` | `string` | `'16px'` | Button font size for small/medium screens |
| `buttonFontSizeLarge` | `string` | `'18px'` | Button font size for large screens |
| `buttonBorderColor` | `string` | `'#2f2b36'` | Button border colour |
| `buttonBorderColorHover` | `string` | `'#2f2b36'` | Button border colour on hover |
| `buttonBorderRadius` | `string` | `'10px'` | Button border radius |
| `buttonBoxShadow` | `string` | `'0 0.3rem 0.6rem rgba(2, 2, 3, 0.2)'` | Button box shadow |
| `buttonPadding` | `string` | `'0.9em 1.3rem 0.8em'` | Button padding |
| `buttonConditionWindowMinHeight` | `number` | `600` | The window has to be at least this tall to show the floating button |
| `buttonConditionScrollDistance` | `number` | `150` | Show floating button after a certain scroll position |
| `iframeBorderColor` | `string` | `'#777777'` | iFrame border colour |
| `iframeBorderRadius` | `string` | `'20px'` | iFrame border radius |
| `iframeBoxShadow` | `string` | `'0 0.625rem 1.875rem rgba(2, 2, 3, 0.28)'` | iFrame box shadow |
| `closeAriaLabel` | `string` | `'Close Knowbot'` | Close button screenreader friendly text |
| `excludePaths` | `string[]` | `[]` | Disable Knowbot on certain pages |

## FAQs

**Can I use my existing CSS variables for colours?**

Yes, you can pass these as a string for example `'var(--accent)'`.

**Can I disable Knowbot on certain pages?**

Yes, pass an array of paths to `excludePaths` to disable Knowbot on certain pages. You can use `*` for wildcard matching at the end of the path. For example `['/example/*']` to disable Knowbot on a parent page and its sub-pages. To add an additional exclusion, an example would be `['/example/*', '/another-example/*']`.
