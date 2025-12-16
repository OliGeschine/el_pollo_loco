/**
 * Mobile touch controls and device orientation management
 */

let mobileControlsSetup = false;
let mobileEventListeners = [];

/**
 * Checks if device has touch capabilities
 * @function
 * @returns {boolean} True if device supports touch
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * Initializes mobile touch controls if device width indicates mobile/tablet
 * @function
 * @returns {void}
 */
function initMobileControls() {
    if (innerWidth <= 1500 && typeof keyboard !== 'undefined') {
        if (innerHeight <= innerWidth) {
            document.getElementById('mobile-controls')?.classList.remove('dNone');
        }
        setupMobileControls();
    }
}

/**
 * Sets up event listeners for mobile touch control buttons
 * @function
 * @returns {void}
 */
function setupMobileControls() {
    if (!keyboard || mobileControlsSetup) {
        console.log('setupMobileControls: keyboard not ready or already setup');
        return;
    }
    mobileControlsSetup = true;
    getButtonLeft();
    getButtonRight();
    getButtonJump();
    getButtonThrow();
}

/**
 * Sets up event listeners for the left movement button
 * @function
 * @returns {void}
 */
function getButtonLeft() {
    const btnLeft = document.getElementById('btn-left');
    if (btnLeft) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.LEFT = true; },
            touchend: (e) => { e.preventDefault(); keyboard.LEFT = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.LEFT = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.LEFT = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnLeft.addEventListener(event, handler, { passive: false });
            mobileEventListeners.push({ element: btnLeft, event, handler });
        });
    }
}

/**
 * Sets up event listeners for the right movement button
 * @function
 * @returns {void}
 */
function getButtonRight() {
    const btnRight = document.getElementById('btn-right');
    if (btnRight) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.RIGHT = true; },
            touchend: (e) => { e.preventDefault(); keyboard.RIGHT = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.RIGHT = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.RIGHT = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnRight.addEventListener(event, handler, { passive: false });
            mobileEventListeners.push({ element: btnRight, event, handler });
        });
    }
}

/**
 * Sets up event listeners for the jump button
 * @function
 * @returns {void}
 */
function getButtonJump() {
    const btnJump = document.getElementById('btn-jump');
    if (btnJump) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.UP = true; },
            touchend: (e) => { e.preventDefault(); keyboard.UP = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.UP = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.UP = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnJump.addEventListener(event, handler, { passive: false });
            mobileEventListeners.push({ element: btnJump, event, handler });
        });
    }
}

/**
 * Sets up event listeners for the throw button
 * @function
 * @returns {void}
 */
function getButtonThrow() {
    const btnThrow = document.getElementById('btn-throw');
    if (btnThrow) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.SPACE = true; },
            touchend: (e) => { e.preventDefault(); keyboard.SPACE = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.SPACE = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.SPACE = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnThrow.addEventListener(event, handler, { passive: false });
            mobileEventListeners.push({ element: btnThrow, event, handler });
        });
    }
}

/**
 * Removes all mobile control event listeners and resets setup state
 * @function
 * @returns {void}
 */
function resetMobileControls() {
    mobileEventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    mobileEventListeners = [];
    mobileControlsSetup = false;
}

/**
 * Checks device orientation and adjusts UI accordingly
 * @function
 * @returns {void}
 */
function checkOrientation() {
    const rotateOverlay = document.getElementById('rotate-device-overlay');
    const mobileControls = document.getElementById('mobile-controls');
    if (innerWidth <= 1024 && isTouchDevice()) {
        if (innerHeight > innerWidth) {
            rotateOverlay?.classList.remove('dNone');
            mobileControls?.classList.add('dNone');
        } else {
            rotateOverlay?.classList.add('dNone');
            mobileControls?.classList.remove('dNone');
            if (keyboard && !document.getElementById('canvas').classList.contains('dNone')) {
                setupMobileControls();
            }
        }
    } else {
        rotateOverlay?.classList.add('dNone');
        mobileControls?.classList.add('dNone');
    }
}

addEventListener('orientationchange', function () {
    setTimeout(checkOrientation, 100);
});
addEventListener('resize', checkOrientation);

checkOrientation();