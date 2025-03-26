const initialState = {
    search: '',
    placeholder: 'Etsi kirjoja',
    data: {}
}

const SearchBarReducer = (state,action) => {    // Use for other features than just search?
    switch (action.type) {                      // filters, etc? this reducer can be removed if not needed.
        case 'search':
            return {...state, search: action.text}
        case 'placeholder':
            return {...state, placeholder: action.placeholderText}
        default:
            throw new Error("SearchBarReducer Error") //Change later to middleware handling
    }
}

export {SearchBarReducer, initialState}