A simple and easy to use vanilla javasript library to create fullscreen scrolling websites without dependenсes.

# Browser support

**Desktop:**
* Chrome
* Safari
* Firefox
* IE 10+
* Opera

**Mobile:**
* Chrome
* Safari
* Firefox

# Usage

- add markup
```html
<div class="page-scroller">
  <div class="page-scroller__section" data-anchor="section1">Section 1</div>
  <div class="page-scroller__section" data-anchor="section2">Section 2</div>
</div>
```
- import PageScroller in your js file

```js 
import PageScroller from './pageScroller'; 
```

- import styles in your css file

## Initialization

```js
var scroller = new PageScroller('.page-scroller', {
    /* your parameters */
});
    scroller.init();
```

### Creating a scrollable section

If you want to have section with her own scroll bar, just add class ``` page-scroller__section_scrollable ```.

### Example

```html
<div class="page-scroller__section page-scroller__section_scrollable" data-anchor="section4">
    <div class="content">
        <div class="header">
            <h1>Section 4 with your scroll</h1>
        </div>
        <div class="page">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia recusandae pariatur nostrum magnam quo, iure nemo commodi accusantium eos dolore. Earum molestiae eaque fugiat sed expedita repellendus repellat odio inventore.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia recusandae pariatur nostrum magnam quo, iure nemo commodi accusantium eos dolore. Earum molestiae eaque fugiat sed expedita repellendus repellat odio inventore.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia recusandae pariatur nostrum magnam quo, iure nemo commodi accusantium eos dolore. Earum molestiae eaque fugiat sed expedita repellendus repellat odio inventore.</p>
        </div>
    </div>
</div>
```

# Options

- ```scrollingSpeed```: (default: 700) Speed in milliseconds for the scrolling transitions.

- ```loopTop```: (default: false) Defines whether scrolling up in the first section should scroll to the last one or not.
    
- ```loopBootom```: (default: false) Defines whether scrolling down in the last section should scroll to the first one or not.

- ```keyboardScrolling```: (default: true) Defines if the content can be navigated using the keyboard.

- ```animationAnchor```: (default: false) Defines whether the load of the site when given an anchor (#) will scroll with animation to its destination or will directrly load on the given section.

- ```direction```: (default: vertical) Defines direction scroll (vertical or horizontal).

- ```navigation``` (default: false) Defines show navigation.

# Methods

- ```moveSectionUp()```: Scrolls one sectio up.

- ```moveSectionDown()```: Scrolls one section down.

- ```moveTo(numberSection)```: Scrolls the page to the section with specified number (count starts since 1).

- ```setScrollDelay(value)```: Set scroll delay.

- ```setAllowScrolling(boolean)```: Add or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touchy gestures.

- ```scrollToAnchor(boolean)```: Scrolls the page to the section with anchor from location hash. The parameter means to scroll to section with or without animation. 
Usage example 
```js
window.location.hash = '#section5';
scroller.scrollToAnchor(true);
```

# Callbacks

- ```afterLoad(anchorLink, index)```: Callback fired once the sections have been loaded, after the scrolling has ended.

- ```onLeave(index, nextIndex, direction)```: Callback fired once the use leaves a section, in the transition to the new section.

- ```afterRender()```: Callback fired just after the structure of the page is generated.