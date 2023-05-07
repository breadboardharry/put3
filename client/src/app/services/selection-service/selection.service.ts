import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SelectionService {

    private sources: any[] = [];
    private selection: any[] = [];
    private lastPosition: number = -1;

    constructor() {}

    /**
     * Initialize the selection service with the given sources
     * @param sources Array of sources to select from
     */
    init(sources: any[]) {
        this.clear();
        this.sources = sources;
    }

    /**
     * Get the current selection
     * @returns Array of selected items
     */
    getSelection() {
        return this.selection;
    }

    /**
     * Set the sources to select from
     * @param source Array of sources to select from
     */
    setSource(source: any[]) {
        this.sources = source;
    }

    /**
     * Get the sources to select from
     * @returns Array of sources to select from
     */
    getSource() {
        return this.sources;
    }

    /**
     * Handle selection of an item
     * @param event Click event
     * @param item Item to select
     * @param rightClick True if right click, false otherwise
     */
    handleSelect(event: any, item: any, rightClick: boolean = false) {
        const index = this.selection.indexOf(item);
        const position = this.sources.indexOf(item);

        // SHIFT + Left click
        if (event.shiftKey) {
            // If lastposition set
            if (this.lastPosition != -1) {
                // Define selection range
                const min = this.lastPosition < position ? this.lastPosition : position;
                const max = 1 + (this.lastPosition > position ? this.lastPosition : position);
                this.selection = this.sources.slice(min, max);
            }
            // No last position set
            else {
                // Set last position
                this.lastPosition = position;
                // If not selected, select only this one or clear if already selected
                if (index == -1) this.selection = [item];
                else this.selection = [];
            }
        }
        else {
            // CTRL + Left click
            if (!rightClick && event.ctrlKey) {
                // If not selected, add to selection or remove if already selected
                if (index == -1) this.selection.push(item);
                else this.selection.splice(index, 1);
            }
            // Click without CTRL or SHIFT
            else {
                // If not selected or multiple selection, select only this one
                if (index == -1 || (!rightClick && this.selection.length > 1)) this.selection = [item];
                // If already selected, remove from selection
                else if (!rightClick) this.selection = [];
                // Set last position for range selection
                this.lastPosition = position;
            }
        }
    }

    /**
     * Clear the selection
     */
    clear() {
        this.selection = [];
        this.lastPosition = -1;
    }

    /**
     * Reset the selection service
     */
    reset() {
        this.sources = [];
        this.clear();
    }
}
