<template>
  <div>
    <input class="table-search-input" type="text" v-model="searchValue" placeholder="Search...">
    <!-- Table -->
    <table class="table">
      <!-- Headers -->
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" @click="sortBy(header)">
            {{ header }}
            <span v-if="sortOrder === 'asc' && sortedColumn === header">▲</span>
            <span v-if="sortOrder === 'desc' && sortedColumn === header">▼</span>
          </th>
        </tr>
      </thead>
      <!-- Body -->
      <tbody>
        <tr v-for="joke in paginatedDataFiltered" :key="joke.id">
          <td>{{ joke.id }}</td>
          <td>{{ joke.type }}</td>
          <td>{{ joke.setup }}</td>
          <td>{{ joke.punchline }}</td>
          <td>
            <input type="number" :value="joke.rating" @input="handleRatingChange($event)" @blur="rateJoke(joke.id, $event.target.value)" min="0" max="10">
          </td>
          <td>
            <button class="button-delete" @click="onDeleteJoke(joke.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Table page buttons -->
    <div class="button-container">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <!-- Delete modal -->
    <ConfirmModal 
      v-if="showDeleteModal"
      :message="'Are you sure you want to delete this joke?'"
      :visible="showDeleteModal"
      @confirmed="confirmDelete"
      @canceled="cancelDelete"
    />
  </div>
</template>

<script>
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  components: { ConfirmModal },
  props: {
    jokes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: ['ID', 'Type', 'Setup', 'Punchline', 'Rating'],
      sortedColumn: null,
      sortOrder: 'asc',
      currentPage: 1,
      itemsPerPage: 5,
      searchValue: '',
      showDeleteModal: false,
      jokeIdToDelete: null
    };
  },
  watch: {
    // when the searchValue changes go to page 1
    searchValue() {
      this.currentPage = 1;
    }
  },
  computed: {
    // get the data to display on the current page of a paginated table. 
    paginatedDataFiltered() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.sortedData.slice(startIndex, endIndex);
    },
    // get total pages
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    // filtered data by search
    filteredData() {
      return this.jokes.filter(joke => {
          return Object.values(joke).some(value => {
              return value !== null && value.toString().toLowerCase().includes(this.searchValue.toLowerCase());
          });
      });
    },
    // sorted data
    sortedData() {
      if (!this.sortedColumn) return this.filteredData;
      const sortedColumn = this.sortedColumn.toLowerCase();
      return this.filteredData.slice().sort((a, b) => {
        const item_a = this.sortOrder === 'asc' ? a : b;
        const item_b = this.sortOrder === 'asc' ? b : a;

        switch (sortedColumn) {
          case 'type':
          case 'punchline':
          case 'setup':
            if (item_a[sortedColumn].trim() < item_b[sortedColumn].trim()) return 1;
            if (item_a[sortedColumn].trim() > item_b[sortedColumn].trim()) return -1;
            return 0;
          case 'rating':
            if ((item_a.rating != null ? parseInt(item_a.rating) : 0) < (item_b.rating != null ? parseInt(item_b.rating) : 0)) return -1;
            if ((item_a.rating != null ? parseInt(item_a.rating) : 0) > (item_b.rating != null ? parseInt(item_b.rating) : 0)) return 1;
            return 0;
          default:
            if (item_a[sortedColumn] < item_b[sortedColumn]) return 1;
            if (item_a[sortedColumn] > item_b[sortedColumn]) return -1;
            return 0;
        }
      });
    }
  },
  methods: {
    // change sort column or order
    sortBy(column) {
      if (this.sortedColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortedColumn = column;
        this.sortOrder = 'asc';
      }
    },
    // change table page
    previousPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    // handle rate change
    handleRatingChange(event) {
      const value = parseInt(event.target.value)
      if(value > 10){
        event.target.value = 10;
        return
      }
      if(value < 0){
        event.target.value = 0;
        return
      }
      if(isNaN(parseInt(event.target.value))){
        event.target.value = 0;
        return
      }
    },
    // rate joke
    async rateJoke(id, rating) {
      if(isNaN(parseInt(rating))){
        // toast
        this.$toasted.error('Invalid rating', {
          duration: 2000
        });
        return
      }
      try {
        await this.$store.dispatch('rateJoke', { id, rating, callback: () => {
          let joke = this.jokes.find(joke => joke.id === id);
          joke.rating = rating;
          // toast
          this.$toasted.success('Joke rating updated successfully', {
            duration: 2000
          });
        }});
      } catch (error) {
        this.$toasted.error(error, {
          duration: 2000
        });
      }
    },
    // show delete confirm
    onDeleteJoke(id) {
      this.jokeIdToDelete = id;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      this.removeJoke(this.jokeIdToDelete);
      this.showDeleteModal = false;
    },
    cancelDelete() {
      this.jokeIdToDelete = null;
      this.showDeleteModal = false;
    },
    // remove joke
    async removeJoke(id) {
      this.$store.dispatch('removeJoke', id);
    },
  }
};
</script>

<style scoped src="@/assets/css/components/table.css"></style>