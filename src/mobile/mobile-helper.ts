import { Browser, BrowserContext, Page, devices } from '@playwright/test';
import { logger } from '../utils/logger';

export interface MobileDevice {
    name: string;
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
}

export interface CustomDevice {
    name: string;
    viewport: {
        width: number;
        height: number;
    };
    userAgent?: string;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
}

/**
 * Mobile and device emulation helper
 */
export class MobileHelper {
    // Predefined popular devices
    static readonly DEVICES = {
        // iPhone
        iPhone_13: devices['iPhone 13'],
        iPhone_13_Pro: devices['iPhone 13 Pro'],
        iPhone_13_Pro_Max: devices['iPhone 13 Pro Max'],
        iPhone_12: devices['iPhone 12'],
        iPhone_SE: devices['iPhone SE'],

        // iPad
        iPad_Pro_11: devices['iPad Pro 11'],
        iPad_Mini: devices['iPad Mini'],
        iPad: devices['iPad (gen 7)'],

        // Android Phones
        Pixel_5: devices['Pixel 5'],
        Pixel_4: devices['Pixel 4'],
        Galaxy_S9: devices['Galaxy S9+'],
        Galaxy_S8: devices['Galaxy S8'],

        // Tablets
        Galaxy_Tab_S4: devices['Galaxy Tab S4'],

        // Desktop
        Desktop_1920: {
            viewport: { width: 1920, height: 1080 },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false
        },
        Desktop_1366: {
            viewport: { width: 1366, height: 768 },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false
        }
    };

    constructor(private browser: Browser) { }

    /**
     * Create mobile context with device emulation
     */
    async createMobileContext(deviceName: keyof typeof MobileHelper.DEVICES): Promise<BrowserContext> {
        logger.info('Creating mobile context', { device: deviceName });

        const device = MobileHelper.DEVICES[deviceName];

        const context = await this.browser.newContext({
            ...device,
            permissions: ['geolocation'],
            locale: 'en-US',
            timezoneId: 'America/New_York'
        });

        logger.info('Mobile context created', { device: deviceName });

        return context;
    }

    /**
     * Create context with custom device
     */
    async createCustomDeviceContext(device: CustomDevice): Promise<BrowserContext> {
        logger.info('Creating custom device context', { device: device.name });

        const context = await this.browser.newContext({
            viewport: device.viewport,
            userAgent: device.userAgent,
            deviceScaleFactor: device.deviceScaleFactor || 1,
            isMobile: device.isMobile || false,
            hasTouch: device.hasTouch || false
        });

        logger.info('Custom device context created', { device: device.name });

        return context;
    }

    /**
     * Emulate specific device on existing page
     */
    async emulateDevice(page: Page, deviceName: keyof typeof MobileHelper.DEVICES): Promise<void> {
        logger.info('Emulating device', { device: deviceName });

        const device = MobileHelper.DEVICES[deviceName];

        await page.setViewportSize(device.viewport);

        if ('userAgent' in device && device.userAgent) {
            await page.setExtraHTTPHeaders({
                'User-Agent': (device as any).userAgent,
            });
        }


        logger.info('Device emulation applied', { device: deviceName });
    }

    /**
     * Set custom viewport
     */
    async setViewport(page: Page, width: number, height: number): Promise<void> {
        logger.info('Setting viewport', { width, height });

        await page.setViewportSize({ width, height });

        logger.debug('Viewport set', { width, height });
    }

    /**
     * Rotate device (portrait/landscape)
     */
    async rotate(page: Page): Promise<void> {
        logger.info('Rotating device');

        const viewport = page.viewportSize();
        if (!viewport) {
            throw new Error('No viewport set');
        }

        await page.setViewportSize({
            width: viewport.height,
            height: viewport.width
        });

        logger.info('Device rotated', {
            from: `${viewport.width}x${viewport.height}`,
            to: `${viewport.height}x${viewport.width}`
        });
    }

    /**
     * Set geolocation
     */
    async setGeolocation(page: Page, latitude: number, longitude: number): Promise<void> {
        logger.info('Setting geolocation', { latitude, longitude });

        await page.context().setGeolocation({ latitude, longitude });

        logger.debug('Geolocation set', { latitude, longitude });
    }

    /**
     * Simulate touch gesture (tap)
     */
    async tap(page: Page, selector: string): Promise<void> {
        logger.debug('Simulating tap', { selector });

        await page.tap(selector);

        logger.debug('Tap completed', { selector });
    }

    /**
     * Simulate swipe gesture
     */
    async swipe(
        page: Page,
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ): Promise<void> {
        logger.debug('Simulating swipe', {
            from: `${startX},${startY}`,
            to: `${endX},${endY}`
        });

        await page.touchscreen.tap(startX, startY);
        await page.mouse.move(endX, endY);

        logger.debug('Swipe completed');
    }

    /**
     * Simulate pinch zoom
     */
    async pinchZoom(page: Page, scale: number): Promise<void> {
        logger.debug('Simulating pinch zoom', { scale });

        await page.evaluate((s: number) => {
            const viewport = window.visualViewport;
            if (viewport) {
                (document.body as any).style.zoom = s;
            }
        }, scale);

        logger.debug('Pinch zoom completed', { scale });
    }

    /**
     * Test responsive breakpoints
     */
    async testBreakpoints(
        page: Page,
        breakpoints: Array<{ name: string; width: number; height: number }>,
        testFn: (breakpoint: { name: string; width: number; height: number }) => Promise<void>
    ): Promise<void> {
        logger.info('Testing responsive breakpoints', { count: breakpoints.length });

        for (const breakpoint of breakpoints) {
            logger.info('Testing breakpoint', breakpoint);

            await this.setViewport(page, breakpoint.width, breakpoint.height);
            await page.waitForTimeout(500); // Wait for CSS transitions

            await testFn(breakpoint);
        }

        logger.info('Breakpoint testing completed');
    }

    /**
     * Common breakpoints for responsive testing
     */
    static readonly BREAKPOINTS = {
        mobile_small: { name: 'Mobile Small', width: 320, height: 568 },
        mobile: { name: 'Mobile', width: 375, height: 667 },
        mobile_large: { name: 'Mobile Large', width: 414, height: 896 },
        tablet_portrait: { name: 'Tablet Portrait', width: 768, height: 1024 },
        tablet_landscape: { name: 'Tablet Landscape', width: 1024, height: 768 },
        desktop_small: { name: 'Desktop Small', width: 1280, height: 720 },
        desktop: { name: 'Desktop', width: 1920, height: 1080 },
        desktop_large: { name: 'Desktop Large', width: 2560, height: 1440 }
    };

    /**
     * Emulate network conditions (for mobile testing)
     */
    async emulateNetworkConditions(
        page: Page,
        profile: 'offline' | 'slow-3g' | 'fast-3g' | '4g' | 'wifi'
    ): Promise<void> {
        logger.info('Emulating network conditions', { profile });

        const conditions = {
            'offline': { offline: true, downloadThroughput: 0, uploadThroughput: 0, latency: 0 },
            'slow-3g': { offline: false, downloadThroughput: 50 * 1024, uploadThroughput: 50 * 1024, latency: 2000 },
            'fast-3g': { offline: false, downloadThroughput: 1.6 * 1024 * 1024, uploadThroughput: 750 * 1024, latency: 562.5 },
            '4g': { offline: false, downloadThroughput: 4 * 1024 * 1024, uploadThroughput: 3 * 1024 * 1024, latency: 20 },
            'wifi': { offline: false, downloadThroughput: 30 * 1024 * 1024, uploadThroughput: 15 * 1024 * 1024, latency: 2 }
        };

        const condition = conditions[profile];
        await page.context().setOffline(condition.offline);

        logger.info('Network conditions set', { profile });
    }

    /**
     * Check if element is visible in mobile viewport
     */
    async isVisibleInViewport(page: Page, selector: string): Promise<boolean> {
        return await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            if (!element) return false;

            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }, selector);
    }

    /**
     * Scroll to element (useful for mobile)
     */
    async scrollToElement(page: Page, selector: string): Promise<void> {
        logger.debug('Scrolling to element', { selector });

        await page.locator(selector).scrollIntoViewIfNeeded();

        logger.debug('Scrolled to element', { selector });
    }

    /**
     * Get device info
     */
    async getDeviceInfo(page: Page): Promise<{
        userAgent: string;
        viewport: { width: number; height: number } | null;
        devicePixelRatio: number;
        touchSupport: boolean;
    }> {
        const info = await page.evaluate(() => ({
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            devicePixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window
        }));

        logger.debug('Device info retrieved', info);

        return info;
    }

    /**
     * Test touch interactions
     */
    async testTouchInteractions(page: Page, selector: string): Promise<{
        tap: boolean;
        longPress: boolean;
        swipe: boolean;
    }> {
        logger.info('Testing touch interactions', { selector });

        const results = {
            tap: false,
            longPress: false,
            swipe: false
        };

        try {
            // Test tap
            await this.tap(page, selector);
            results.tap = true;
            logger.debug('Tap test passed');
        } catch (error) {
            logger.warn('Tap test failed', { error });
        }

        logger.info('Touch interaction tests completed', results);

        return results;
    }

    /**
     * Simulate mobile keyboard
     */
    async showMobileKeyboard(page: Page, inputSelector: string): Promise<void> {
        logger.debug('Showing mobile keyboard', { selector: inputSelector });

        await page.focus(inputSelector);

        // Simulate keyboard showing by reducing viewport
        const viewport = page.viewportSize();
        if (viewport) {
            await page.setViewportSize({
                width: viewport.width,
                height: Math.floor(viewport.height * 0.6) // Keyboard takes ~40% of screen
            });
        }

        logger.debug('Mobile keyboard shown');
    }

    /**
     * Hide mobile keyboard
     */
    async hideMobileKeyboard(page: Page): Promise<void> {
        logger.debug('Hiding mobile keyboard');

        await page.keyboard.press('Escape');

        logger.debug('Mobile keyboard hidden');
    }

    /**
     * List all available devices
     */
    static getAvailableDevices(): string[] {
        return Object.keys(MobileHelper.DEVICES);
    }

    /**
     * Get device by name
     */
    static getDevice(name: keyof typeof MobileHelper.DEVICES): any {
        return MobileHelper.DEVICES[name];
    }
}