import PageScroller from './pageScroller';

window.onload = () => {
    var scroller = new PageScroller('.page-scroller', {
        scrollingSpeed: 100,
    });
    scroller.setScrollDelay(300);
    scroller.init();
}