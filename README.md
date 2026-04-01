# Custom Homepage

A minimal, terminal-style personal browser homepage built with vanilla HTML, CSS and JS.

![preview](preview.png)

## Features

- Time-aware greeting that types itself out on load (good morning / afternoon / evening / good night)
- Custom blinking cursor that hides while typing
- Live clock
- Organised bookmark columns with hover-to-reveal links
- Persistent bookmarks via localStorage — add, edit and delete links and categories without touching the code
- `/settings` command to open the bookmark manager
- Animated gear-free, distraction-free layout

## Setup

1. Clone or download the repo
2. Create a folder called `assets` in the root directory
3. Add your own background image or gif to the `assets/` folder and name it `background.gif`
   (or update the filename in `style.css`)
4. Optionally add a `favicon.ico` to the `assets/` folder for the tab icon
5. Set `index.html` as your browser's homepage

## Usage

- Type `/settings` in the header and hit Enter to manage bookmarks

## Notes

- The `assets/` folder is not included in this repo due to file size
- You will need to provide your own `background.gif` and `favicon.ico`
