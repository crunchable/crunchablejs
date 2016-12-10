import fetch from 'isomorphic-fetch';
import _ from 'lodash';

require('babel-polyfill');

const CRUNCHABLE_URL = 'https://api.crunchable.io';

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

class Crunchable {
  constructor(token) {
    this.token = token;
  }

  async _fetch(endpoint, extra_options) {
    const options = _.merge({}, {
      headers: {
        'X-Crunch-API-Key': this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }, extra_options);
    const url = `${CRUNCHABLE_URL}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    const json = await response.json();
    return json;
  }

  _post(endpoint, task) {
    const options = {
      method: 'POST',
      body: JSON.stringify(task),
    };
    return this._fetch(endpoint, options);
  }

  getRequest(task_id) {
    return this._fetch(`/v1/requests/${task_id}`);
  }
  abortRequest(task_id) {
    return this._fetch(`/v1/requests/${task_id}`, {method: 'DELETE'});
  }

  async waitForRequest(task_id, poll_frequency = 30000, timeout = 60 * 60 * 1000) {
    const start = Date.now();
    while ((Date.now() - start) < timeout) {
      const response = await this.getRequest(task_id);
      if (response.status !== 'pending') {
        return response;
      }
      await sleep(poll_frequency);
    }
    throw new Error('Timed out waiting for response from crunchable');
  }

  requestMultipleChoice(task) {
    return this._post('/v1/requests/multiple-choice', task);
  }
  requestFreeText(task) {
    return this._post('/v1/requests/free-text', task);
  }
  requestRating(task) {
    return this._post('/v1/requests/rating', task);
  }
  requestAudio(task) {
    return this._post('/v1/requests/audio', task);
  }
  requestAnnotations(task) {
    return this._post('/v1/requests/annotations', task);
  }
  requestAnnotationsWithMultipleChoice(task) {
    return this._post('/v1/requests/annotations-with-multiple-choice', task);
  }
  requestAnnotationsWithFreeText(task) {
    return this._post('/v1/requests/annotations-with-free-text', task);
  }
  requestAnnotationsWithRating(task) {
    return this._post('/v1/requests/annotations-with-rating', task);
  }

}

module.exports = token => new Crunchable(token);
