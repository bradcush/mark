import { Counter as BookmarkCounter } from './bookmarks/Counter';
import { counterBrowser as bookmarkCounterBrowser } from './bookmarks/counterBrowser';
import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { organizerBrowser as tabsOrganizerBrowser } from './tabs/organizerBrowser';
import { Menu as ContextMenu } from './context/Menu';
import { menuBrowser as contextMenuBrowser } from './context/menuBrowser';
import { Store } from './storage/Store';
import { storeBrowser } from './storage/storeBrowser';
import { ConsoleLogger } from './logs/ConsoleLogger';

// When the service worker starts
const logger = new ConsoleLogger();
logger.log('Service worker started');

/**
 * Initialize the background process
 * and all top-level listeners
 */
async function initBackground() {
    // Load settings from storage into state
    const storeInstance = new Store({
        browser: storeBrowser,
        Logger: ConsoleLogger,
    });
    void storeInstance.load();

    // Start tab organizer for sorting tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        browser: tabsOrganizerBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    tabsOrganizerInstance.connect();

    // Create various context menus that dictate client behaviour
    const contextMenu = new ContextMenu({
        browser: contextMenuBrowser,
        store: storeInstance,
        tabsOrganizer: tabsOrganizerInstance,
        Logger: ConsoleLogger,
    });
    // Connect for creation and handling events
    contextMenu.connect();

    // Start bookmark counter to track criteria matches
    if (ENABLE_BOOKMARK_COUNTER) {
        const bookmarkCounter = new BookmarkCounter({
            browser: bookmarkCounterBrowser,
            Logger: ConsoleLogger,
        });
        bookmarkCounter.connect();
        // Set the initial count based the current tab
        void bookmarkCounter.updateCountForActiveTab();
    }

    // Organize on extension initialization done last to allow all
    // previous listeners to be registered at the top-level as we
    // have an async operation here to get the state
    const state = await storeInstance.getState();
    const isAutomaticSortingEnabled = state.enableAutomaticSorting;
    if (isAutomaticSortingEnabled) {
        void tabsOrganizerInstance.organize();
    }
}

void initBackground();
