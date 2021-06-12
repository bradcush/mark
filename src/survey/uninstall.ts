import { browser } from 'src/api/browser';

// Mark uninstall survey hosted using Google Forms
const UNINSTALL_SURVERY_URL = 'https://forms.gle/wNhryQtn8bHNLT488';

/**
 * Set the URL for a survey that the user will be
 * redirected to when the extension is uninstalled
 */
export function setUninstallUrl(): void {
    void browser.runtime.setUninstallURL(UNINSTALL_SURVERY_URL);
}
