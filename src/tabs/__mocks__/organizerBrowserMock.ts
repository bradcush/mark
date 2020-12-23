import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkToBrowser } from '../MkTabOrganizer';
import { makeQueryMock as makeTabsQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';

const organizerBrowserAction = {
    onClicked: browserMock.action.onClicked,
};

const organizerBrowserRuntime = {
    lastError: browserMock.runtime.lastError,
};

const organizerBrowserTabs = {
    move: jest.fn(),
    query: makeTabsQueryMock([]),
};

export const organizerBrowserMock = ({
    action: organizerBrowserAction,
    runtime: organizerBrowserRuntime,
    tabs: organizerBrowserTabs,
} as any) as MkToBrowser;