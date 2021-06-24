import Formiojs from 'formiojs/Formio';

import {selectRoot} from '../root';

import * as types from './constants';

export const resetSubmissions = (name) => ({
  type: types.SUBMISSIONS_RESET,
  name,
});

const requestSubmissions = (name, page, params, formId, requestId) => ({
  type: types.SUBMISSIONS_REQUEST,
  name,
  page,
  params,
  formId,
  requestId,
});

const receiveSubmissions = (name, submissions, requestId) => ({
  type: types.SUBMISSIONS_SUCCESS,
  name,
  submissions,
  requestId,
});

const failSubmissions = (name, error, requestId) => ({
  type: types.SUBMISSIONS_FAILURE,
  name,
  error,
  requestId,
});

var requestCounter = 0;

export const getSubmissions = (name, page = 0, params = {}, formId, done = () => {}) => (dispatch, getState) => {
  const requestId = ++requestCounter;
  //console.debug(`-> ${requestId} getSubmissions '${name}'`);
  dispatch(requestSubmissions(name, page, params, formId, requestId));

  const {
    limit,
    query,
    select,
    sort,
  } = selectRoot(name, getState());
  const formio = new Formiojs(`${Formiojs.getProjectUrl()}/${(formId ? `form/${formId}` : name)}/submission`);
  const requestParams = {...query, ...params};

  // Ten is the default so if set to 10, don't send.
  if (limit !== 10) {
    requestParams.limit = limit;
  }
  else {
    delete requestParams.limit;
  }

  if (page !== 1) {
    requestParams.skip = (page - 1) * limit;
  }
  else {
    delete requestParams.skip;
  }

  if (select) {
    requestParams.select = select;
  }
  else {
    delete requestParams.select;
  }

  if (sort) {
    requestParams.sort = sort;
  }
  else {
    delete requestParams.sort;
  }

  return formio.loadSubmissions({params: requestParams})
    .then((result) => {
      dispatch(receiveSubmissions(name, result, requestId));
      done(null, result);
    })
    .catch((error) => {
      dispatch(failSubmissions(name, error, requestId));
      done(error);
    });
};
