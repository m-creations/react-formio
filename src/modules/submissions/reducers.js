import _pick from 'lodash/pick';

import * as types from './constants';

export function submissions({
  name,
  limit = 10,
  query = {},
  select = '',
  sort = '',
}) {
  const initialState = {
    error: '',
    formId: '',
    isActive: false,
    limit,
    pagination: {
      numPages: 0,
      page: 1,
      total: 0,
    },
    query,
    requestId: null,
    select,
    sort,
    submissions: [],
  };

  return (state = initialState, action) => {
    // Only proceed for this submissions.
    if (action.name !== name) {
      return state;
    }

    switch (action.type) {
      case types.SUBMISSIONS_RESET:
        return initialState;
      case types.SUBMISSIONS_REQUEST:
        return {
          ...state,
          ..._pick(action.params, [
            'limit',
            'query',
            'select',
            'sort',
          ]),
          error: '',
          formId: action.formId,
          isActive: true,
          pagination: {
            ...state.pagination,
            page: action.page,
          },
          requestId: action.requestId,
          submissions: [],
        };
      case types.SUBMISSIONS_SUCCESS: {
        if (state.requestId !== action.requestId) {
          //console.debug(`<- ${action.requestId} getSubmissions '${name}' result dropped; current requestId = ${state.requestId}`);
          return state;
        }

        const total = action.submissions.serverCount;
        //const numPages = Math.ceil(total / state.limit);
        //console.debug(`<- ${action.requestId} getSubmissions '${name}' returned ${action.submissions.length}/${total} results on page ${state.pagination.page || 1}/${numPages}`);

        return {
          ...state,
          isActive: false,
          pagination: {
            ...state.pagination,
            numPages: Math.ceil(total / state.limit),
            total,
          },
          submissions: action.submissions,
        };
      }
      case types.SUBMISSIONS_FAILURE: {
        if (state.requestId !== action.requestId) {
          //console.debug(`<- ${action.requestId} getSubmissions '${name}' failure dropped; current requestId = ${state.requestId}`);
          return state;
        }
        //console.debug(`<- ${action.requestId} getSubmissions '${name}' failed:`, action.error);

        return {
          ...state,
          error: action.error,
          isActive: false,
        };
      }
      default:
        return state;
    }
  };
}
