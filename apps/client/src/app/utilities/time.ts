/**
 * Returns a promise that resolves after a given delay
 * @param delay The number of milliseconds to wait before fulfilling the promise
 */
const delay = (delay: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

export { delay };
