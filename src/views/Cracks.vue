<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="products"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="table-header">
            <h3 class="p-m-2">Manage Cracks</h3>

            <span class="p-input-icon-left">
              <Button
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
                style="margin:2px"
              />
              <span class="p-input-icon-left" style="margin:2px">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global']"
                  placeholder="Search..."
                />
              </span>
            </span>
          </div>
        </template>

        <Column headerStyle="width: 3rem"></Column>
        <Column header="Image" headerStyle="width: 100px">
          <template #body="slotProps">
            <img
              :src="'demo/images/product/' + slotProps.data.image"
              :alt="slotProps.data.image"
              class="product-image"
            />
          </template>
        </Column>
        <Column
          field="locationName"
          header="Location Name"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column
          field="ReporterName"
          header="Reporter Name"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column
          field="Position"
          header="Position"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column
          field="Severity"
          header="Severity"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column
          field="status"
          header="Status"
          filterMatchMode="equals"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.status">{{
              slotProps.data.status
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['status']"
              :options="statuses"
              placeholder="Select a Status"
              class="p-column-filter"
              :showClear="true"
            >
              <template #option="slotProps">
                <span :class="'customer-badge status-' + slotProps.option">{{
                  slotProps.option
                }}</span>
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column
          field="description"
          header="Description"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column
          field="Created"
          header="Created"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.Created }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['Created']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="CreatedDate"
            />
          </template>
        </Column>
        <Column
          field="LatsModified"
          header="LastModified"
          :sortable="true"
          headerStyle="width: 150px"
        ></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text p-mr-1"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-star"
              class="p-button-rounded p-button-warning p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
            />
            <Button
              icon="pi pi-calendar-minus"
              class="p-button-rounded p-button-warning p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Cracks Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name">LocationName</label>
        <InputText
          disabled
          id="id"
          v-model.trim="product.locationName"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.locationName }"
        />
        <small class="p-invalid" v-if="submitted && !product.locationName"
          >Crakcs id is required.</small
        >
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showAssessment"
      :style="{ width: '450px' }"
      header="Assessment"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <Rating :modelValue="product.AssessmentResult.Rating" :readonly="true" :stars="5" :cancel="false" />
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.AssessmentResult.Description"
          required="true"
          rows="3"
          cols="20"
          disabled
        />
      </div>
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script>
import Location from "../data/LocationService.js";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    Rating
  },
  data() {
    return {
      products: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      showAssessment: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
    };
  },
  locationService: null,
  created() {
    this.locationService = new Location();
  },

  mounted() {
    this.locationService.getCracks().then((data) => (this.products = data));
  },
  methods: {
    hideDialog() {
      this.productDialog = false;
      this.showAssessment = false;
      this.submitted = false;
    },
    editProduct(product) {
      this.product = { ...product };
      this.productDialog = true;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    filterDate(value, filter) {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === "string" && filter.trim() === "")
      ) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value === this.formatDate(filter);
    },
    formatDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (month < 10) {
        month = "0" + month;
      }

      if (day < 10) {
        day = "0" + day;
      }
      return day + "-" + month + "-" + date.getFullYear();
    },
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
