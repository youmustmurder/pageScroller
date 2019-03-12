import PageScroller from './pageScroller';

window.onload = () => {
    var scroller = new PageScroller('.page-scroller', {
        scrollDelay: 0,
        loopBottom: true,
        loopTop: true
    });
    scroller.init();
}