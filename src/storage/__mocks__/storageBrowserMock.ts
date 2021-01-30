import {
    MkSyncGetItems,
    MkSyncGetKeys,
} from 'src/api/browser/storage/sync/MkSync';
import { MkBrowser } from 'src/api/MkBrowser';

const defaultItems = {
    enableAutomaticSorting: true,
};

export function makeSyncGetMock(items: MkSyncGetItems = defaultItems) {
    return (_keys: MkSyncGetKeys) => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}

export function makeStorageBrowserMock(
    syncGetMock: MkBrowser.storage.sync.Get = makeSyncGetMock()
) {
    return {
        storage: {
            sync: {
                get: syncGetMock,
                set: jest.fn(),
            },
        },
    };
}
