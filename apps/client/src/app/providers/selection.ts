class SelectionHandler<T> {
    private selectedItems: Set<T> = new Set();

    /**
     * Toggle selection of the given item
     */
    public toggle(item: T): SelectionHandler<T> {
        if (this.selectedItems.has(item)) this.selectedItems.delete(item);
        else this.selectedItems.add(item);
        return this;
    }

    /**
     * Set selection to the given item
     */
    public selectOnly(item: T): SelectionHandler<T> {
        this.selectedItems.clear();
        this.selectedItems.add(item);
        return this;
    }

    /**
     * Clear the selection
     */
    public clear(): SelectionHandler<T> {
        this.selectedItems.clear();
        return this;
    }

    /**
     * Get selected items
     */
    public getItems(): T[] {
        return Array.from(this.selectedItems);
    }

    /**
     * Get the number of selected items
     */
    public get size(): number {
        return this.selectedItems.size;
    }
}

export default SelectionHandler;
