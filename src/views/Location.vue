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
            <h3 class="p-m-2">Manage Locations</h3>
            <span class="p-input-icon-left">
              <Button
                icon="pi pi-plus"
                class="p-button-success p-mr-2"
                @click="openNew"
                style="margin:2px"
                label="New"
              />
              <Button
                label="Export"
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
        <Column field="locationName" header="Location Name" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.locationName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['locationName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="description" header="Description" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.description }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['description']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
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
          field="LastModified"
          header="LastModified"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.LastModified }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['LastModified']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="CreatedDate"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="editProduct(slotProps.data)"
              style="margin: 2px"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDeleteProduct(slotProps.data)"
              style="margin: 2px"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Location Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="locationName"> Location Name</label>
        <InputText
          id="Name"
          v-model.trim="product.locationName"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.locationName }"
        />
        <small class="p-invalid" v-if="submitted && !product.locationName"
          >Location Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <InputText
          id="Phone"
          v-model.trim="product.description"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.description }"
        />
        <small class="p-invalid" v-if="submitted && !product.description"
          >Description is required.</small
        >
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveProduct"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to delete the location {{ product.locationName }}?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
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

export default {
  components: {
    Button,
    Toast,
    Calendar,
  },
  data() {
    return {
      products: null,
      deleteProductsDialog: false,
      productDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Available", "Unavailable"],
    };
  },
  locationService: null,
  created() {
    this.locationService = new Location();
  },

  mounted() {
    this.locationService
      .getLocation()
      .then((data) => (this.products = data));
  },
  methods: {
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductsDialog = true;
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    editProduct(product) {
      this.product = product;
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
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
      let tmp = value.substring(0, 10);
      return tmp === this.formatDate(filter);
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
