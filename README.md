# Knowbot

## Examples

### Floating button

### Custom button

You can add your own link or button to your website header or page content.

Assign the class `.knowbot` to connect it to Knowbot.

We handle the logic but the styling of the button is up to you.

Alternatively, you can set the link to `#knowbot`.

### Both static and floating buttons

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `url` | `''` | Server URL (provided by MHF) - **Required** |
| `button` | `text` \| `boolean` | `'Ask Me !'` | Text to show in the floating button or false to disable |
| `buttonAriaLabel` | `string` | `'Ask Knowbot a question'` | Floating button screenreader friendly text |
| `buttonTextColor` | `string` | `'#ffffff'` | Button text colour |
| `buttonTextColorHover` | `string` | `'#2f2b36'` | Button text colour on hover |
| `buttonBgColor` | `string` | `'#2f2b36'` | Button background colour |
| `buttonBgColorHover` | `string` | `'#f7f7f7'` | Button background colour on hover |
| `buttonFontFamily` | `string` | `'sans-serif'` | Button font family |
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
