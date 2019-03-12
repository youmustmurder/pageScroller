function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i=0; i<children.length; i++) {
         if (children[i]==node) return num;
         if (children[i].nodeType==1) num++;
    }
    return -1;
}

class PageScroller {
    constructor(container, opts = {}) {
        this.container = (typeof(container) == 'string') ? document.querySelector(container) : container;
        this.lastScrolledDestiny;
        this.lastAnimation = 0;
        this.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.touchEndY = 0;
        this.touchEndX = 0;
        this.scrollDelay = 600;
        this.scrollings = [];
        this.options = {
            direction: 'vertical',
            menu: null,
            verticalCentered: true,
            anchors: [],
            scrollingSpeed: 700,
            easing: 'easeInQuart',
            loopBottom: false,
            loopTop: false,
            navigation: {
                textColor: '#000',
                bulletsColor: '#000',
                position: 'right',
                tooltips: []
            },
            normalScrollElements: null,
            normallScrollElementTouchThreshold: 5,
            touchSensitivity: 5,
            keyboardScrolling: true,
            sectionSelector: '.page-scroller__section',
            animationAnchor: false,
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            ...opts
        };
        this.prevTime = new Date().getTime();
        this.zIndex = this.container.querySelectorAll(this.options.sectionSelector).length; 
    }

    init = () => {
        this.container.style.overflow = 'hidden';

        this.setAllowScrolling(true);

        let sections = this.container.querySelectorAll(this.options.sectionSelector);

        Array.prototype.forEach.call(sections, (section, index) => {
            section.setAttribute('data-index', index);
            section.style.zIndex = this.zIndex;

            (!index && this.container.querySelectorAll(this.options.sectionSelector+'.active').length === 0) ? section.classList.add('active') : null;

            (typeof this.options.anchors[index] !== 'undefined') ? section.setAttribute('data-anchor', this.options.anchors[index]) : null;

            (this.options.verticalCentered && !section.classList.contains('scrollable')) ? this.addTableClass(section) : null;

            --this.zIndex;
        });
    }
    
    setScrollingSpeed = (value) => {
        this.options.scrollingSpeed = value;
    }

    setMouseWheelScrolling = (value) => {
        (value) ? this.addMouseWheelHandler() : this.removeMouseWheelHandler();
    }

    setAllowScrolling = (value) => {
        if (value) {
            this.setMouseWheelScrolling(true);
            this.addTouchHandler();
        } else {
            this.setMouseWheelScrolling(false);
            this.removeTouchHandler();
        }
    }

    addMouseWheelHandler = () => {
        this.container.addEventListener('mousewheel', this.mouseWheelHandler, false);
        this.container.addEventListener('wheel', this.mouseWheelHandler, false);
    }

    removeMouseWheelHandler = () => {
        this.container.removeEventListener('mousewheel', this.mouseWheelHandler, false);
        this.container.removeEventListener('wheel', this.mouseWheelHandler, false);
    }

    addTouchHandler = () => {
        if (this.isTouch) {
            container.off('touchstart pointerdown').on('touchstart pointerdown', this.touchStartHandler);
            container.off('touchmove pointermove').on('touchmove pointermove', this.touchMoveHandler);
        }
    }

    removeTouchHandler = () => {
        if (isTouch) {
            container.off('touchstart pointerdown');
            container.off('touchmove pointermove');
        }
    }

    isReallyTouch = (e) => {
        return typeof e.poinetType === 'undefined' || e.poinetType != 'mouse';
    }

    /*
        get pageX, pageY
    */
    getEventsPage = (e) => {
        var events = new Array();

        events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
        events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);
    }

    touchStartHandler = (event) => {
        var e = event.originalEvent;

        if (this.isReallyTouch(e)) {
            var touchEvents = this.getEventsPage(e);
            this.touchStartY = touchEvents.y;
            this.touchStartX = touchEvents.x;
        }
    }

    checkParentForNormalScrollElement = (el, hop = 0) => {
        var parent = el.parentNode();

        if (hop < this.options.normallScrollElementTouchThreshold && parent == this.options.normalScrollElements) {
            return true;
        } else if (hop == this.options.normallScrollElementTouchThreshold) {
            return false;
        } else {
            return this.checkParentForNormalScrollElement(parent, ++hop);
        }
    }

    isScrollable = (activeSection) => {
        return (activeSection.classList.contains('scrollable')) ? activeSection : undefined;
    }

    isMoving = () => {
        var timeNow = new Date().getTime();
        return (timeNow - this.lastAnimation < this.scrollDelay + this.options.scrollingSpeed) ? true : false;
    }

    touchMoveHandler = (event) => {
        var e = event.originalEvent;

        if (!this.checkParentForNormalScrollElement(event.target) && this.isReallyTouch(e)) {
            var activeSection = container.querySelector(this.opts.sectionSelector + '.active'),
                scrollable = this.isScrollable(activeSection);

            if (!scrollable.length) {
                event.preventDefault();
            }

            if (!this.isMoving()) {
                var touchEvents = this.getEventsPage(e);
                this.touchEndY = touchEvents.y;
                this.touchEndX = touchEvents.x;
                let containerRect = this.container.getBoundingClientRect().width;

                if (this.options.direction === 'horizontal' && Math.abs(this.touchStartX - this.touchEndX) > (Math.abs(this.touchStartY - this.touchEndY))) {
                    if (Math.abs(this.touchStartX - this.touchEndX) > (containerRect.width / 100 * this.options.touchSensitivity)) {
                        if (this.touchStartX > this.touchEndX) {
                            this.scrolling('down', scrollable);
                        } else if (this.touchEndX > this.touchStartX) {
                            this.scrolling('up', scrollable);
                        }
                    }
                } else {
                    if (Math.abs(this.touchStartY - this.touchEndY) > (containerRect.height / 100 * this.options.touchSensitivity)) {
                        if (this.touchStartY > this.touchEndY) {
                            this.scrolling('down', scrollable);
                        } else if (this.touchEndY > this.touchStartY) {
                            this.scrolling('up', scrollable);
                        }
                    }
                }
            }
        }
    }

    scrolling = (type, scrollable) => {
        var check,
            scrollSection;

        if (type == 'down') {
            check = 'bottom';
            scrollSection = this.moveSectionDown;
        } else {
            check = 'top';
            scrollSection = this.moveSectionUp;
        }

        if (typeof scrollable != 'undefined') {
            if (this.isScrolled(check, scrollable)) {
                scrollSection();
            } else {
                return true;
            }
        } else {
            scrollSection();
        }
    }

    isScrolled = (type, scrollable) => {
        if (type == 'top') {
            return !scrollable.scrollTop;
        } else if (type == 'bottom') {
            return scrollable.scrollTop + scrollable.getBoundingClientRect().height + 1 >= scrollable.scrollHeight;
        }
    }

    moveSectionDown = () => {
        let next = this.container.querySelector(this.options.sectionSelector + '.active').nextElementSibling;

        (next == null && this.options.loopBottom) ? next = this.container.querySelector(this.options.sectionSelector + ':first-child') : null;

        if (next != null) {
            this.scrollPage(next);
        }
    }

    moveSectionUp = () => {
        let prev = this.container.querySelector(this.options.sectionSelector + '.active').previousElementSibling;
        (prev == null && this.options.loopTop) ? prev = this.container.querySelector(this.options.sectionSelector + ':last-child') : null;

        if (prev != null) {
            this.scrollPage(prev);
        }
    }

    getYmovement = (destiny) => {
        let fromIndex = indexInParent(this.container.querySelector(this.options.sectionSelector + '.active')),
            toIndex = indexInParent(destiny);

        return (fromIndex > toIndex) ? 'up' : 'down';
    }

    scrollPage = (destination, animated) => {
        var v = {
            destination: destination,
            animated: animated || true,
            activeSection: this.container.querySelector(this.options.sectionSelector + '.active'),
            anchorLink: destination.getAttribute('data-anchor'),
            sectionIndex: indexInParent(destination),
            toMove: destination,
            yMovement: this.getYmovement(destination),
            leavingSection: indexInParent(this.container.querySelector(this.options.sectionSelector + '.active')) + 1
        };

        if (v.activeSection == destination) {
            return;
        }

        v.destination.scrollTop = 0;

        if (typeof v.anchorLink !== 'undefined') {
            this.setUrlHash(v.anchorLink, v.sectionIndex);
        }

        v.destination.classList.add('active');
        Array.prototype.forEach.call(v.destination.parentNode.children, function(child){
            if (child !== v.destination) {
                child.classList.remove('active');
            }
        });

        v.sectionsToMove = this.getSectionsToMove(v);

        if (v.yMovement === 'down') {
            v.translate3d = this.getTranslate3d();
            v.scrolling = '-100%';

            v.animateSection = v.activeSection;
        } else {
            v.translate3d = 'translate3d(0px,0px,0px)';
            v.scrolling = '0';
            
            v.animateSection = destination;
        }

        (typeof this.options.onLeave == 'function') ? this.options.onLeave.call(this, v.leavingSection, (v.sectionIndex + 1), v.yMovement) : null;

        this.performMovement(v);

        this.activeMenuElement(v.anchorLink);
        //this.activenavDots(v.anchorLink, v.sectionIndex);
        this.lastScrolledDestiny = v.anchorLink;

        var timeNow = new Date().getTime();
        this.lastAnimation = timeNow;
    }

    setUrlHash = () => {

    }

    getSectionsToMove = (v) => {
        var sectionToMove;

        if (v.yMovement === 'down') {
            sectionToMove = Array.prototype.filter.call(this.container.querySelectorAll(this.options.sectionSelector), (item, index) => {
                if (index < indexInParent(v.destination)) {
                    return item;
                }
            });
        } else {
            sectionToMove = Array.prototype.filter.call(this.container.querySelectorAll(this.options.sectionSelector), (item, index) => {
                if (index > indexInParent(v.destination)) {
                    return item;
                }
            });
        }
        return sectionToMove;
    }

    performMovement = (v) => {
        this.transformContainer(v.animateSection, v.translate3d, v.animated);
        Array.prototype.forEach.call(v.sectionsToMove, (section) => {
            this.transformContainer(section, v.translate3d, v.animated);
        });

        setTimeout(() => {
            this.afterSectionLoads(v);
        }, this.options.scrollingSpeed);
    }

    activeMenuElement = () => {

    }

    transformContainer = (element, translate3d, animated) => {
        (animated) ? element.classList.add('easing') : element.classList.remove('easing');
        element.style.transform = translate3d;
        /* getTransforms */
    }

    afterSectionLoads = (v) => {
        if (typeof this.options.afterLoad == 'function') {
            this.options.afterLoad.call(this, v.anchorLink, (v.sectionIndex + 1));
        }
    }

    getTransforms = (translate3d) => {
        return {
            '-webkit-transform': translate3d,
            '-moz-transform': translate3d,
            '-ms-translate': translate3d,
            'transform': translate3d
        }
    }

    mouseWheelHandler = (e) => {
        var currentTime = new Date().getTime();

        e = e || window.event;
        var value = e.wheelDelta || -e.deltaY || -e.detail,
            delta = Math.max(-1, Math.min(1, value)),
            horizontalDetection = typeof e.wheelDelta !== 'undefined' || typeof e.deltaX !== 'undefined',
            isScrollingVerically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);

        if (this.scrollings.length > 149) {
            this.scrollings.shift();
        }

        this.scrollings.push(Math.abs(value));

        var timeDiff = currentTime - this.prevTime;
        this.prevTime = currentTime;

        if(timeDiff > 200) {
            this.scrollings = [];
        }

        if (!this.isMoving()) {
            var activeSection = this.container.querySelector(this.options.sectionSelector + '.active'),
                scrollable = this.isScrollable(activeSection),
                averageEnd = this.getEverage(this.scrollings, 10),
                averageMiddle = this.getEverage(this.scrollings, 70),
                isAccelerating = averageEnd >= averageMiddle;

            if (isAccelerating && isScrollingVerically) {
                if (delta < 0) {
                    this.scrolling('down', scrollable);
                } else if(delta > 0) {
                    this.scrolling('up', scrollable);
                }
            }

            return false;
        }
    }

    getEverage = (elements, number) => {
        var sum = 0,
            lastElements = elements.slice(Math.max(elements.length - number, 1));

        for (var i=0; i < lastElements.length; i++) {
            sum = sum + lastElements[i];
        }

        return Math.ceil(sum/number);
    }

    getTranslate3d = () => {
        if (this.options.direction !== 'vertical') {
            return 'translate3d(-100%, 0px, 0px)';
        }
        return 'translate3d(0px, -100%, 0px)';
    }

    addTableClass = () => {

    }
}

export default PageScroller;