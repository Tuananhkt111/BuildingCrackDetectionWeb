<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getLocationList"
        dataKey="id"
        :paginator="true"
        :rows="5"
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
        <Column field="name" header="Location Name" >
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['name']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="description"
          header="Description"
        >
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
          field="created"
          header="Created"
          filterMatchMode="custom"
          :filterFunction="filterDate"
         
        >
          <template #body="slotProps">
            <span>{{ callDate(slotProps.data.created) }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['created']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="Created Date"
            />
          </template>
        </Column>
        <Column
          field="lastModified"
          header="LastModified"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          
        >
          <template #body="slotProps">
            <span>{{ callDate(slotProps.data.lastModified) }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['lastModified']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="Last Modified"
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
      v-model:visible="createLocationDiaglog"
      :style="{ width: '450px' }"
      header="Location Information"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name"> Location Name</label>
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
          id="Description"
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
          @click="createLocation"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Location Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name"> Location Name</label>
        <InputText
          id="Name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-invalid" v-if="submitted && !product.name"
          >Location Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <InputText
          id="Description"
          v-model.trim="product.description"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.description }"
        />
        <small class="p-invalid" v-if="submitted && !product.description"
          >Description is required.</small
        >
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="created"> Created Date</label>
          <InputText
            id="created"
            v-model.trim="product.created"
            required="true"
            disabled="true"
            autofocus
          />
        </div>
        <div class="p-field p-col-6">
          <label for="lastModified"> Last Modified</label>
          <InputText
            id="lastModified"
            v-model.trim="product.lastModified"
            required="true"
            disabled="true"
            autofocus
          />
        </div>
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
          @click="updateLocation"
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
          >Are you sure to delete the location {{ product.name }}?</span
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
          @click="deleteSelectedLocation"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import { locationApi } from "../apis/location";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Button,
    Toast,
    Calendar,
  },
  computed: {
    ...mapGetters("location", ["getLocationList"]),

    data() {
      return this.getLocationList;
    },
  },
  data() {
    return {
      deleteProductsDialog: false,
      productDialog: false,
      createLocationDiaglog: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
    };
  },
  async created() {
    await this.setLocationList();
  },
  methods: {
    ...mapActions("location", ["setLocationList"]),
    
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductsDialog = true;
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.createLocationDiaglog = true;
    },
    async createLocation() {
      await locationApi
        .create(this.product.locationName, this.product.description)
        .catch((err) => {
          alert(err);
        });
      await this.setLocationList();
      this.hideDialog();
    },
    editProduct(product) {
      this.product = { ...product };
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.createLocationDiaglog = false;
      this.productDialog = false;
      this.submitted = false;
      this.product = {};
      this.deleteProductsDialog = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    async deleteSelectedLocation() {
      await locationApi.disable(this.product.locationId);
      this.product = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Location is disabled",
        life: 3000,
      });
      this.setLocationList();
      this.hideDialog();
    },
    async updateLocation() {
      this.getLocationList[
        this.findIndexById(this.product.locationId)
      ] = this.product;
      await locationApi.update(
        this.product.locationId,
        this.product.name,
        this.product.description
      );
      this.productDialog = false;
      await this.setLocationList();
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getLocationList.length; i++) {
        if (this.getLocationList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY hh:mm:ss");
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
      let tmp = this.callDate(value).substring(0, 10);
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
