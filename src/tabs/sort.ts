import { MkBrowser } from 'src/api/MkBrowser';
import { makeSortName } from 'src/helpers/sortName';
import { makeGroupName } from 'src/helpers/groupName';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { categorize as categorizeTabs } from './categorize';
import { sort as sortBar } from './bar';

/**
 * Separate grouped tabs from orphans
 */
async function cluster(tabs: MkBrowser.tabs.Tab[]) {
    try {
        logVerbose('cluster', tabs);
        const {
            enableSubdomainFiltering,
            forceWindowConsolidation,
        } = await getStore().getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const categorizedTabs = await categorizeTabs(tabs);
        // Determine if the tab is alone and not
        // supposed to belong to any group
        const isOrphan = (tab: MkBrowser.tabs.Tab) => {
            const groupName = makeGroupName({ type: groupType, url: tab.url });
            // Specify the current window as the forced window
            const chosenWindowId = forceWindowConsolidation
                ? tabs[0].windowId
                : tab.windowId;
            logVerbose('cluster', groupName, chosenWindowId);
            return categorizedTabs[groupName][chosenWindowId].length < 2;
        };
        const groupedTabs = tabs.filter((tab) => !isOrphan(tab));
        const orphanTabs = tabs.filter(isOrphan);
        // Groups on the left and singles on the right
        return [...groupedTabs, ...orphanTabs];
    } catch (error) {
        logError('cluster', error);
        throw error;
    }
}

/**
 * Sort tabs alphabetically with nuance
 */
async function alphabetize(unsortedTabs: MkBrowser.tabs.Tab[]) {
    logVerbose('alphabetize', unsortedTabs);
    const { enableSubdomainFiltering } = await getStore().getState();
    return unsortedTabs.sort((a, b) => {
        const urlOne = a.url;
        const urlTwo = b.url;
        if (!urlOne || !urlTwo) {
            throw new Error('No url for sorted tab');
        }
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const tabOneName = makeSortName({ type: groupType, url: urlOne });
        const tabTwoName = makeSortName({ type: groupType, url: urlTwo });
        return compareNames(tabOneName, tabTwoName);
    });
}

/**
 * Compare to be used with name sorting
 */
function compareNames(a: string, b: string) {
    return a.localeCompare(b);
}

/**
 * Remove tabs that are pinned from the list
 */
export function filter(tabs: MkBrowser.tabs.Tab[]): MkBrowser.tabs.Tab[] {
    logVerbose('filter');
    const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
    const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
    return nonPinnedTabs;
}

/**
 * Reorder browser tabs in the current
 * window according to tabs list
 */
export async function render(tabs: MkBrowser.tabs.Tab[]): Promise<void> {
    logVerbose('render', tabs);
    // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
    // "windowId" in our algorithm which the representative -2 breaks
    const staticWindowId = tabs[0].windowId;
    const { forceWindowConsolidation } = await getStore().getState();
    const tabsToUpdate = tabs.map(({ id }) => {
        // Specify the current window as the forced window
        const calculatedWindowId = forceWindowConsolidation
            ? staticWindowId
            : undefined;
        return {
            identifier: id,
            windowId: calculatedWindowId,
        };
    });
    sortBar(tabsToUpdate);
}

/**
 * Sort tabs based on settings
 */
export async function sort(
    tabs: MkBrowser.tabs.Tab[]
): Promise<MkBrowser.tabs.Tab[]> {
    try {
        logVerbose('sort', tabs);
        const {
            enableAlphabeticSorting,
            clusterGroupedTabs,
        } = await getStore().getState();
        const alphabetizedTabs = enableAlphabeticSorting
            ? await alphabetize(tabs)
            : tabs;
        return clusterGroupedTabs
            ? cluster(alphabetizedTabs)
            : alphabetizedTabs;
    } catch (error) {
        logError('sort', error);
        throw error;
    }
}