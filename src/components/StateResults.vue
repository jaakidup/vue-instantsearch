<template>
  <div
    :class="suit()"
    v-if="state && state.results"
  >
    <slot v-bind="stateResults">
      <p>
        Use this component to have a different layout based on a certain state.
      </p>
      <p>
        Fill in the slot, and get access to the following things on the
        <code>slot-scope</code>:
      </p>
      <pre>results: {{ Object.keys(state.results) }}</pre>
      <pre>state: {{ Object.keys(state.state) }}</pre>
    </slot>
  </div>
</template>

<script>
import { createSuitMixin } from '../mixins/suit';
import { createWidgetMixin } from '../mixins/widget';

const connectStateResults = (renderFn, unmountFn) => (widgetParams = {}) => ({
  init({ instantSearchInstance }) {
    renderFn(
      {
        state: undefined,
        results: undefined,
        instantSearchInstance,
        widgetParams,
      },
      true
    );
  },

  render({ results, instantSearchInstance, state }) {
    const resultsCopy = Object.assign({}, results);
    const stateCopy = Object.assign({}, state);

    // delete internal state, not to be exposed
    delete resultsCopy._state;

    renderFn(
      {
        results: resultsCopy,
        state: stateCopy,
        instantSearchInstance,
        widgetParams,
      },
      false
    );
  },

  dispose() {
    unmountFn();
  },
});

export default {
  name: 'AisStateResults',
  mixins: [
    createWidgetMixin({ connector: connectStateResults }),
    createSuitMixin({ name: 'StateResults' }),
  ],
  computed: {
    stateResults() {
      // TODO: just pass results & state separately in the next major version
      const stateResults = this.state.results;
      stateResults.results = this.state.results;
      stateResults.state = this.state.state;
      return stateResults;
    },
  },
};
</script>
