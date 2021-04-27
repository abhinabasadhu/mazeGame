const debounce = (func, delay = 1000) => {
    let timeoutId;
    // sheild wrapper which decides how often func is invoked
    // just arg just take single arguement but ...args takes multiple 
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // apply call the function as we normally would and take all the arguments
        // in the array( args here) and pass them as separate arguments tot he original function
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};