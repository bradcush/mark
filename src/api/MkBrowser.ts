interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
    setBadgeBackgroundColor: MkBrowser.action.SetBadgeBackgroundColor;
    setBadgeText: MkBrowser.action.SetBadgeText;
}

interface MkBrowserBookmarks {
    onCreated: MkBrowser.bookmarks.OnCreated;
    search: MkBrowser.bookmarks.Search;
}

interface MkBrowserTabs {
    get: MkBrowser.tabs.Get;
    move: MkBrowser.tabs.Move;
    onActivated: MkBrowser.tabs.OnActivated;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
}

interface MkBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

export interface MkBrowser {
    action: MkBrowserAction;
    bookmarks: MkBrowserBookmarks;
    runtime: MkBrowserRuntime;
    tabs: MkBrowserTabs;
}

export declare namespace MkBrowser.action {
    export type OnClicked = typeof chrome.browserAction.onClicked;
    export type SetBadgeBackgroundColor = typeof chrome.browserAction.setBadgeBackgroundColor;
    export type SetBadgeText = typeof chrome.browserAction.setBadgeText;
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

export declare namespace MkBrowser.tabs {
    export type ChangeInfo = chrome.tabs.TabChangeInfo;
    export type Get = typeof chrome.tabs.get;
    export type Move = typeof chrome.tabs.move;
    export type MoveProperties = chrome.tabs.MoveProperties;
    export type OnActivated = typeof chrome.tabs.onActivated;
    export type OnUpdated = typeof chrome.tabs.onUpdated;
    export type Query = typeof chrome.tabs.query;
    export type QueryInfo = chrome.tabs.QueryInfo;
    export type Tab = chrome.tabs.Tab;
    export type TabActiveInfo = chrome.tabs.TabActiveInfo;
}