<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getMaintenanceWorkerList"
        v-model:selection="selectedProducts"
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
            <h3 class="p-m-2">Manage Maintenance Worker</h3>
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

        <Column field="name" header="Name" >
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
        <Column field="phone" header="Phone" >
          <template #body="slotProps">
            {{ slotProps.data.phone }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['phone']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          filterField="email"
          filterMatchMode="contains"
          header="Email"
        >
          <template #body="slotProps">
            {{ slotProps.data.email }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['email']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          filterField="address"
          filterMatchMode="contains"
          header="Address"
        >
          <template #body="slotProps">
            {{ slotProps.data.address }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['address']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="created"
          header="Created Date"
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
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Maintenance Worker Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-invalid" v-if="submitted && !product.name"
          >Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="phone">Phone</label>
        <InputText
          id="phone"
          v-model.trim="product.phone"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.phone }"
        />
        <small class="p-invalid" v-if="submitted && !product.phone"
          >Phone is required.</small
        >
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <InputText
          id="address"
          v-model.trim="product.address"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.address }"
        />
        <small class="p-invalid" v-if="submitted && !product.address"
          >Address is required.</small
        >
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          type="email"
          id="email"
          v-model.trim="product.email"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.email }"
        />
        <small class="p-invalid" v-if="submitted && !product.email"
          >Email is required.</small
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
          @click="editMaintenanceWorker"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="CreateProductDialog"
      :style="{ width: '450px' }"
      header="Create Maintenance Worker"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-invalid" v-if="submitted && !product.name"
          >Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="phone">Phone</label>
        <InputText
          id="phone"
          v-model.trim="product.phone"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.phone }"
        />
        <small class="p-invalid" v-if="submitted && !product.phone"
          >Phone is required.</small
        >
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <InputText
          id="address"
          v-model.trim="product.address"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.address }"
        />
        <small class="p-invalid" v-if="submitted && !product.address"
          >Address is required.</small
        >
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          type="email"
          id="email"
          v-model.trim="product.email"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.email }"
        />
        <small class="p-invalid" v-if="submitted && !product.email"
          >Email is required.</small
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
          label="Create"
          icon="pi pi-check"
          class="p-button-text"
          @click="createMaintenanceWorker"
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
          >Are you sure you want to delete the Worker {{ product.name }}?</span
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
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import maintenanceWorkerApi from "../apis/maintenanceWorker.js";

export default {
  components: {
    Button,
    Toast,
    Calendar,
  },
  computed: {
    ...mapGetters("maintenanceWorker", ["getMaintenanceWorkerList"]),

    data() {
      return this.getMaintenanceWorkerList;
    },
  },
  data() {
    return {
      CreateProductDialog: false,
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
  async created() {
    await this.setMaintenanceWorkerList();
  },

  methods: {
    ...mapActions("maintenanceWorker", ["setMaintenanceWorkerList"]),
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductsDialog = true;
    },
    async createMaintenanceWorker() {
      await maintenanceWorkerApi
        .create(
          this.product.name,
          this.product.address,
          this.product.phone,
          this.product.email
        )
        .catch((err) => {
          alert(err);
        });
      await this.setMaintenanceWorkerList();
      this.hideDialog();
    },
    async editMaintenanceWorker() {
      this.getMaintenanceWorkerList[
        this.findIndexById(this.product.maintenanceWorkerId)
      ] = this.product;
      await maintenanceWorkerApi.update(
        this.product.maintenanceWorkerId,
        this.product.name,
        this.product.address,
        this.product.phone,
        this.product.email,
      );
      await this.setMaintenanceWorkerList();
      this.productDialog = false;
    },

    async deleteSelectedProducts(){
      await maintenanceWorkerApi.disable(this.product.maintenanceWorkerId);
      await this.setMaintenanceWorkerList();
      this.hideDialog();
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.CreateProductDialog = true;
    },
    editProduct(product) {
      this.product = { ...product };
      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.CreateProductDialog = false;
      this.deleteProductsDialog = false;
      this.submitted = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getMaintenanceWorkerList.length; i++) {
        if (this.getMaintenanceWorkerList[i].id === id) {
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
