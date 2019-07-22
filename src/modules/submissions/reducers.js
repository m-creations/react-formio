import * as types from './constants';

export function submissions(config) {
  if (config.debug) {
    console.debug('react-formio: config = ', config);
  }
  const initialState = {
    mergeResults: config.mergeResults || false,
    formId: '',
    query: config.query || {},
    isActive: false,
    lastUpdated: 0,
    submissions: [],
    limit: 10,
    pagination: {
      page: 1
    },
    error: ''
  };

  const mergeSubmissions = (origSubs, newSubs) => {
    const origIDs = origSubs.map( x => x._id );
    const inOrigIDs = id => ( origIDs.indexOf(id) > -1 );
    return [...origSubs, ...newSubs.filter( y => !inOrigIDs(y._id) )];
  };

  return (state = initialState, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    if (config.debug) {
      console.debug('react-formio: action.type = ', action.type);
    }
    switch (action.type) {
      case types.SUBMISSIONS_RESET:
        return initialState;
      case types.SUBMISSIONS_REQUEST:
        return {
          ...state,
          formId: action.formId,
          limit: action.limit || state.limit,
          isActive: true,
          submissions: (!state.mergeResults) ? [] : state.submissions,
          pagination: {
            page: action.page || state.pagination.page,
            numPages: action.numPages || state.pagination.numPages,
            total: action.total || state.pagination.total
          },
          error: ''
        };
      case types.SUBMISSIONS_SUCCESS:
        return {
          ...state,
          submissions: (!state.mergeResults) ? action.submissions :
            mergeSubmissions(state.submissions, action.submissions),
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil((action.submissions.serverCount || state.pagination.total) / state.limit),
            total: action.submissions.serverCount || state.pagination.total
          },
          isActive: false,
          error: ''
        };
      case types.SUBMISSIONS_FAILURE:
        return {
          ...state,
          isActive: false,
          error: action.error
        };
      default:
        return state;
    }
  };
}
