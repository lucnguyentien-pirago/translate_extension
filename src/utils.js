/**
 * Utility functions shared across the extension
 */
import { log } from './constants.js';

/**
 * Safely checks if Chrome runtime is available
 * @returns {boolean} Whether Chrome runtime APIs are available
 */
export function isChromeRuntimeAvailable() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
}

/**
 * Gets selected text from the current page
 * @returns {string} The selected text or empty string if none
 */
export function getSelectedText() {
    try {
        const selection = window.getSelection();
        if (!selection) return '';
        return selection.toString().trim();
    } catch (error) {
        log('Error getting selected text:', error);
        return '';
    }
}

/**
 * Splits text into chunks for translation to avoid URL length limits
 * @param {string} text - The text to split
 * @param {number} maxLength - Maximum chunk length
 * @returns {string[]} Array of text chunks
 */
export function splitTextForTranslation(text, maxLength = 1000) {
    if (text.length <= maxLength) return [text];

    const chunks = [];
    const sentenceEndings = ['. ', '? ', '! ', '\n'];
    let start = 0;

    while (start < text.length) {
        if (start + maxLength >= text.length) {
            chunks.push(text.substring(start));
            break;
        }

        const end = start + maxLength;
        let breakPoint = end;

        for (const ending of sentenceEndings) {
            const lastIndex = text.lastIndexOf(ending, end);
            if (lastIndex > start && lastIndex < breakPoint) {
                breakPoint = lastIndex + ending.length;
            }
        }

        if (breakPoint === end) {
            const lastSpace = text.lastIndexOf(' ', end);
            if (lastSpace > start) {
                breakPoint = lastSpace + 1;
            }
        }

        chunks.push(text.substring(start, breakPoint));
        start = breakPoint;
    }

    return chunks;
}

/**
 * Safely stores data in Chrome storage
 * @param {Object} data - The data to store
 * @returns {Promise} Promise resolving when storage is complete
 */
export function storeSettings(data) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Safely retrieves data from Chrome storage
 * @param {Object} defaults - Default values if not found in storage
 * @returns {Promise<Object>} Promise resolving with the stored data
 */
export function getSettings(defaults = {}) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(defaults, (items) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(items);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
