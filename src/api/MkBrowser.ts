import { MkSyncGetKeys, MkSyncGetItems } from './browser/storage/sync/MkSync';

interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
    setBadgeBackgroundColor: MkBrowser.action.SetBadgeBackgroundColor;
    setBadgeText: MkBrowser.action.SetBadgeText;
}

interface MkBrowserBookmarks {
    onCreated: MkBrowser.bookmarks.OnCreated;
    search: MkBrowser.bookmarks.Search;
}

interface MkBrowserContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
    removeAll: MkBrowser.contextMenus.RemoveAll;
}

interface MkBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkBrowserStorageSync {
    get: MkBrowser.storage.sync.Get;
    set: MkBrowser.storage.sync.Set;
}

interface MkBrowserStorage {
    sync: MkBrowserStorageSync;
}

interface MkBrowserTabGroups {
    Color: MkBrowser.tabGroups.Color;
    update: MkBrowser.tabGroups.Update;
}

interface MkBrowserTabs {
    get: MkBrowser.tabs.Get;
    group: MkBrowser.tabs.Group;
    move: MkBrowser.tabs.Move;
    onActivated: MkBrowser.tabs.OnActivated;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
    ungroup: MkBrowser.tabs.Ungroup;
}

export interface MkBrowser {
    action: MkBrowserAction;
    contextMenus: MkBrowserContextMenus;
    bookmarks: MkBrowserBookmarks;
    runtime: MkBrowserRuntime;
    storage: MkBrowserStorage;
    tabGroups: MkBrowserTabGroups;
    tabs: MkBrowserTabs;
}

export declare namespace MkBrowser.action {
    export type OnClicked = typeof chrome.browserAction.onClicked;
    export type SetBadgeBackgroundColor = typeof chrome.browserAction.setBadgeBackgroundColor;
    export type SetBadgeText = typeof chrome.browserAction.setBadgeText;
}

export declare namespace MkBrowser.contextMenus {
    export type Create = typeof chrome.contextMenus.create;
    export type OnClicked = typeof chrome.contextMenus.onClicked;
    export type OnClickedData = chrome.contextMenus.OnClickData;
    export type RemoveAll = typeof chrome.contextMenus.removeAll;
}

export declare namespace MkBrowser.bookmarks {
    export type BookmarkSearchQuery =
        | chrome.bookmarks.BookmarkSearchQuery
        | string;
    export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
    export type OnCreated = typeof chrome.bookmarks.onCreated;
    export type Search = typeof chrome.bookmarks.search;
}

export declare namespace MkBrowser.runtime {
    export type LastError = typeof chrome.runtime.lastError;
}

export declare namespace MkBrowser.storage.sync {
    export type Get = (keys: MkSyncGetKeys) => Promise<MkSyncGetItems>;
    export type Set = (items: MkSyncGetItems) => Promise<void>;
}

export declare namespace MkBrowser.storage {
    export interface Sync {
        get: MkBrowser.storage.sync.Get;
        set: MkBrowser.storage.sync.Set;
    }
}

export declare namespace MkBrowser.tabGroups {
    // TODO: Replace by types when possible
    export type Color = { [key: string]: string };
    // TODO: Replace by types when possible
    export type Update = (
        groupId: number,
        updateProperties: object,
        callback?: () => void
    ) => void;
}

export declare namespace MkBrowser.tabs {
    export type ChangeInfo = chrome.tabs.TabChangeInfo;
    export type Get = typeof chrome.tabs.get;
    // TODO: Replace by types when possible
    export type Group = (
        options: object,
        callback?: (groupId: number) => void
    ) => void;
    export type Move = typeof chrome.tabs.move;
    export type MoveProperties = chrome.tabs.MoveProperties;
    export type OnActivated = typeof chrome.tabs.onActivated;
    export type OnUpdated = typeof chrome.tabs.onUpdated;
    export type Query = typeof chrome.tabs.query;
    export type QueryInfo = chrome.tabs.QueryInfo;
    export type Tab = chrome.tabs.Tab;
    export type TabActiveInfo = chrome.tabs.TabActiveInfo;
    // TODO: Replace by types when possible
    export type Ungroup = (tabIds: number[], callback?: () => void) => void;
}
