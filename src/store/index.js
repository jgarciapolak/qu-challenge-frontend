// src/store.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jokes: []
  },
  mutations: {

    SET_JOKES(state, jokes) {
      state.jokes = jokes;
    },
    UPDATE_JOKE_RATING(state, { id, rating }) {
      const joke = state.jokes.find(joke => joke.id === id);
      if (joke) {
        joke.rating = +parseInt(rating);
      }
    },
    ADD_JOKE(state, newJoke) {
      state.jokes.push(newJoke);
    },
    REMOVE_JOKE(state, id) {
      state.jokes = state.jokes.filter(joke => joke.id !== id);
    }

  },
  actions: {
    // fetch jokes from the server
    async fetchJokes({ commit }) {
      if (this.state.jokes.length === 0) {
        try {
          const response = await fetch(`${process.env.VUE_APP_JOKE_API_URL}/jokes`);
          const data = await response.json();
          commit('SET_JOKES', data);
        } catch (error) {
          console.error('Error fetching jokes:', error);
        }
      }
    },
    // rate a joke
    async rateJoke({ commit }, { id, rating, callback }) {
      try {
        if(!rating){
          throw new Error('Rating must not be null');
        }
        const response = await fetch(`http://localhost:3005/jokes/${id}/rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rating })
        });
        if (!response.ok) {
          throw new Error('Failed to rate joke');
        }
        commit('UPDATE_JOKE_RATING', { id, rating });
        if (callback) {
          callback();
        }
      } catch (error) {
        console.error('Error rating joke:', error);
        throw error;
      }
    },
    // create a new joke
    async createJoke({ commit }, newJoke) {
      try {
        const response = await fetch('http://localhost:3005/jokes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newJoke)
        });
        if (!response.ok) {
          throw new Error('Failed to create joke');
        }
        const createdJoke = await response.json();
        commit('ADD_JOKE', createdJoke);
      } catch (error) {
        console.error('Error creating joke:', error);
      }
    },
    // remove a joke
    async removeJoke({ commit }, id) {
      try {
        const response = await fetch(`${process.env.VUE_APP_JOKE_API_URL}/jokes/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          commit('REMOVE_JOKE', id);
        } else {
          throw new Error('Failed to delete joke');
        }
      } catch (error) {
        console.error('Error removing joke:', error);
      }
    }

  },
  getters: {

    getJokes(state) {
      return state.jokes;
    }

  }
});
