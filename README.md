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
| `buttonWindowMinHeight` | `number` | `600` | The window has to be at least this tall to show the floating button |
| `buttonWindowScrollDistance` | `number` | `150` | Show floating button as long as window is scrolled this far |
| `closeAriaLabel` | `string` | `'Close Knowbot'` | Close button screenreader friendly text |
