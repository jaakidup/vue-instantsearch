import { previewWrapper } from './utils';
import { storiesOf } from '@storybook/vue';

storiesOf('ais-state-results', module)
  .addDecorator(
    previewWrapper({
      indexName: 'demo-query-rules',
      filters: '<ais-refinement-list attribute="genre" />',
      hits: `
      <ol
        slot-scope="{ items }"
        class="playground-hits"
      >
        <li
          v-for="item in items"
          :key="item.objectID"
          class="playground-hits-item"
        >
          <div
            class="playground-hits-image"
            :style="{ backgroundImage: 'url(' + item.image + ')' }"
          />
          <div class="playground-hits-desc">
            <p>
              <ais-highlight attribute="title" :hit="item" />
            </p>
          </div>
        </li>
      </ol>
      `,
    })
  )
  .add('default display', () => ({
    template: `<ais-state-results />`,
  }))
  .add('custom "autocomplete"', () => ({
    template: `
    <div>
      <ais-search-box />
      <ais-state-results>
        <template slot-scope="{ state: { query } }">
          <ais-hits v-if="query">
            <h3
              slot="item"
              slot-scope="{ item }"
              :tabindex="0"
              @click="alert(item)"
              @keyup.enter="alert(item)"
            >
              <ais-highlight :hit="item" attribute="title"/>
            </h3>
          </ais-hits>
        </template>
      </ais-state-results>
    </div>
    `,
    methods: {
      alert(item) {
        // eslint-disable-next-line no-alert
        alert(item.name);
      },
    },
  }))
  .add('banner', () => ({
    template: `
    <div>
      <ais-search-box />
      <p>type "documentary"</p>
      <ais-state-results>
        <template slot-scope="{ results: { userData } }">
          <div>
            <img
              v-for="{ banner_img_slug: src } in userData"
              :key="src"
              :src="'https://preview.algolia.com/query-rules/' + src"
            />
          </div>
        </template>
      </ais-state-results>
    </div>
    `,
  }))
  .add('no results', () => ({
    template: `
      <div>
        <ais-search-box />
        <ais-state-results>
          <template slot-scope="{ results: { query, hits } }">
            <p v-if="hits.length === 0">
              No results found for the query: <q>{{ query }}</q>
            </p>
          </template>
        </ais-state-results>
        <ais-hits />
      </div>
    `,
  }))
  .add('no results (old usage)', () => ({
    template: `
      <div>
        <ais-search-box />
        <ais-state-results>
          <template slot-scope="{ query, hits }">
            <p v-if="hits.length === 0">
              No results found for the query: <q>{{ query }}</q>
            </p>
          </template>
        </ais-state-results>
        <ais-hits />
      </div>
    `,
  }))
  .add('ssr debugger', () => ({
    template: `
      <ais-state-results>
        <div slot-scope="{ state }">
          <p>copy this to <code>findResultsState</code></p>
          <pre>{{ cleanup(state) }}</pre>
        </div>
      </ais-state-results>
    `,
    methods: {
      cleanup(state) {
        /* eslint-disable no-param-reassign */
        state.disjunctiveFacetsRefinements =
          Object.keys(state.disjunctiveFacetsRefinements).length > 0
            ? state.disjunctiveFacetsRefinements
            : undefined;
        state.hierarchicalFacetsRefinements =
          Object.keys(state.hierarchicalFacetsRefinements).length > 0
            ? state.hierarchicalFacetsRefinements
            : undefined;
        state.facetsRefinements =
          Object.keys(state.facetsRefinements).length > 0
            ? state.facetsRefinements
            : undefined;
        state.facetsExcludes =
          Object.keys(state.facetsExcludes).length > 0
            ? state.facetsExcludes
            : undefined;
        state.numericRefinements =
          Object.keys(state.numericRefinements).length > 0
            ? state.numericRefinements
            : undefined;

        state.facets = state.facets.length > 0 ? state.facets : undefined;
        state.disjunctiveFacets =
          state.disjunctiveFacets.length > 0
            ? state.disjunctiveFacets
            : undefined;
        state.hierarchicalFacets =
          state.hierarchicalFacets.length > 0
            ? state.hierarchicalFacets
            : undefined;
        state.tagRefinements =
          state.tagRefinements.length > 0 ? state.tagRefinements : undefined;

        state.index = undefined;
        return state;
        /* eslint-enable no-param-reassign */
      },
    },
  }));
