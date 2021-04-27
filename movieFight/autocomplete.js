// resuable functions to get an autocompleteto work.
// root is destructured instead of config so that we dont have to declare 
// root where else take it as a property  
// we can get access to changed text with referencing.....................
// (event.target.value) and now we pass it to fetchData to get stuff out..
// Or in other way wireing up the api with out html.......................
// too many requests were made so now.....................................
// api key search request is done only when user stops typing for 1 second
// debouncing an input....................................................
// decbounce will give another function...................................
// onInput-> dbounce helper-> onInput sheild wait for 1s-> fetchs the info
// drop down menu of the html to the js side
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    root.innerHTML = `
    <lable><b>Search</b> </lable>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
    <div class = "dropdown-content results"></div>
    </div>
    </div>
    `;

    // created with reference with bulma css properties
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    // default delay
    // limiting onInput function with debounce function

    // debounce function

    // we use async n await as in the first phase we used async function
    const onInput = async event => {
        const items = await fetchData(event.target.value);
        // check if the input is empty then to close the dropdown
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        // creates no drop down when the user deleted the search for a new search
        resultsWrapper.innerHTML = '';
        // enables the dropdown list makes it active 
        dropdown.classList.add('is-active');
        // now run the loop and get the results creating element for each result
        for (let item of items) {

            // creating anchor tag for each api response 
            const option = document.createElement('a');
            // adding anchor to the css bulma property for drop down 
            option.classList.add('dropdown-item');
            // rederOption is destructured from the creteautocomplete object as property
            // for rendering the html 
            // to make it reusable we just need movie to the object we want to render
            option.innerHTML = renderOption(item);
            // clicking on the dropdown menu replace the input name with movie title on api and removing the dropdown menu
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                // helper function to get the movie details
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }
    };
    // wiring Debounce from utils.js with on input to take arguments with delay 
    input.addEventListener('input', debounce(onInput, 500));

    // if the user clicks anywhere else rather than the search bar the drop down closes
    // we are adding a click evet to anything in the window except 
    // the root which is the input html n wrappers above
    document.addEventListener('click', event => {
        if (!root.contains(event.targt)) {
            dropdown.classList.remove('is-active')
        }
    });
};