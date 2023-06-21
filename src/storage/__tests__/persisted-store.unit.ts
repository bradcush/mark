import { SyncItems } from 'src/infra/browser/storage/sync/sync-types';
import { storageSyncGet } from 'src/infra/browser/storage/sync/get';
import { storageSyncSet } from 'src/infra/browser/storage/sync/set';
import { PersistedStore } from '../persisted-store';

// Mock wrapped browser API implementation
jest.mock('src/infra/browser/storage/sync/get');
jest.mock('src/infra/browser/storage/sync/set');

const defaultItems = {
    clusterGroupedTabs: true,
    enableAutomaticGrouping: true,
    enableAlphabeticSorting: true,
    enableSubdomainFiltering: false,
    forceWindowConsolidation: false,
    showGroupTabCount: true,
    suspendCollapsedGroups: false,
};

/**
 * Create a mocked sync storage get function that
 * resolves with items passed during construction
 */
function makeSyncGet(
    items: SyncItems = defaultItems
): typeof chrome.storage.sync.get {
    return () => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}

describe('PersistedStore', () => {
    const storageSyncGetMock = storageSyncGet as jest.Mock;
    const storageSyncSetMock = storageSyncSet as jest.Mock;

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should cache storage in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
                invalidSetting: true,
            });
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache non-persisted settings in memory', async () => {
            const nonPersistedSettings = { settings: undefined };
            const syncGetMock = () => Promise.resolve(nonPersistedSettings);
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid typed settings in memory', async () => {
            const invalidTypedSettings = { settings: true };
            const syncGetMock = () => Promise.resolve(invalidTypedSettings);
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid content in memory', async () => {
            const invalidContent = 'invalidContent' as unknown as SyncItems;
            const syncGetMock = makeSyncGet(invalidContent);
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should not cache invalid storage keys in memory', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
                invalidSetting: true,
            });
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should cache default state in memory without storage', async () => {
            const syncGetMock = makeSyncGet({});
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });

        it('should migrate legacy keys to their new name', async () => {
            const syncGetMock = makeSyncGet({
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAutomaticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            });
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });

    describe('when state is persisted to storage', () => {
        beforeEach(() => {
            const syncGetMock = makeSyncGet();
            storageSyncGetMock.mockImplementation(syncGetMock);
        });

        it('should add new keys in storage and state', async () => {
            const storageService = new PersistedStore();
            await storageService.load();
            const state = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            await storageService.setState(state);
            const newState = await storageService.getState();
            expect(newState).toStrictEqual(state);
            const storage = { settings: JSON.stringify(state) };
            expect(storageSyncSetMock).toHaveBeenCalledWith(storage);
        });

        it('should update existing keys in storage and state', async () => {
            const storageService = new PersistedStore();
            await storageService.load();

            const firstState = {
                clusterGroupedTabs: false,
                enableAutomaticGrouping: false,
                enableAlphabeticSorting: false,
                enableSubdomainFiltering: true,
                forceWindowConsolidation: true,
                showGroupTabCount: false,
                suspendCollapsedGroups: true,
            };
            await storageService.setState(firstState);
            const firstNewState = await storageService.getState();
            expect(firstNewState).toStrictEqual(firstState);
            const firstItems = { settings: JSON.stringify(firstState) };
            expect(storageSyncSetMock).toHaveBeenCalledWith(firstItems);

            const secondState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            await storageService.setState(secondState);
            const secondNewState = await storageService.getState();
            expect(secondNewState).toStrictEqual(secondState);
            const secondItems = { settings: JSON.stringify(secondState) };
            expect(storageSyncSetMock).toHaveBeenCalledWith(secondItems);
        });
    });

    describe('when current state is asked for', () => {
        it('should return current state in memory', async () => {
            const syncGetMock = makeSyncGet();
            storageSyncGetMock.mockImplementation(syncGetMock);
            const storageService = new PersistedStore();
            await storageService.load();
            const state = await storageService.getState();
            const expectedState = {
                clusterGroupedTabs: true,
                enableAutomaticGrouping: true,
                enableAlphabeticSorting: true,
                enableSubdomainFiltering: false,
                forceWindowConsolidation: false,
                showGroupTabCount: true,
                suspendCollapsedGroups: false,
            };
            expect(state).toStrictEqual(expectedState);
        });
    });
});