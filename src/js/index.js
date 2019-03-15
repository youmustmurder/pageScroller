import PageScroller from './pageScroller';

window.onload = () => {
    var scroller = new PageScroller('.page-scroller', {
        navigation: true
    });
    scroller.init();
    window.location.hash = '#section5';
    scroller.scrollToAnchor(true);
}