import PageScroller from './pageScroller';

window.onload = () => {
    var scroller = new PageScroller('.page-scroller', {
        loopBottom: true,
    });
    scroller.init();
}