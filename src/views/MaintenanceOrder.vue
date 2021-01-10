<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        dataKey="maintenanceOrderId"
        :value="getMaintenanceOrderList"
        v-model:expandedRows="expandedRows"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="table-header">
            <h3 class="p-m-2">Manage Maintenance Order</h3>
            <span class="p-input-icon-left">
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
        <Column :expander="true" headerStyle="width: 30px" />
        <Column
          field="maintenanceWorkerName"
          header="Worker Name"
          sortable
          headerStyle="width: 120px"
          ><template #body="slotProps">
            {{ slotProps.data.maintenanceWorkerName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['maintenanceWorkerName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="assessorName"
          header="Assessor Name"
          sortable
          headerStyle="width: 120px"
          ><template #body="slotProps">
            {{ slotProps.data.assessorName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['assessorName']"
              class="p-column-filter"
              placeholder="Search"
            /> </template
        ></Column>
        <Column
          field="location"
          header="Location Name"
          sortable
          headerStyle="width: 120px"
          ><template #body="slotProps">
            {{ slotProps.data.location }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['location']"
              class="p-column-filter"
              placeholder="Search"
            /> </template
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
              placeholder="Status"
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
          field="maintenanceDate"
          header="Maintenance Date"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span>{{ callDate(slotProps.data.maintenanceDate) }}</span>
          </template>
          <template #filter>
            <Calendar
              appendTo="body"
              v-model="filters['RepairTime']"
              dateFormat="dd-mm-yy"
              class="p-column-filter"
              placeholder="RepairTime"
            />
          </template>
        </Column>
        <Column headerStyle="width: 10px">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
            />
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="orders-subtable">
            <h5>Mainteance Order id {{ slotProps.data.maintenanceOrderId }}</h5>
            <DataTable :value="slotProps.data.cracks">
              <Column
                field="crackId"
                header="Error Id"
                sortable
                headerStyle="width: 50px"
              ></Column>
              <Column header="Image" headerStyle="width: 150px">
                <template #body="slotProps">
                  <img
                    :src="slotProps.data.image"
                    :alt="slotProps.data.image"
                    class="product-image"
                  />
                </template>
              </Column>
              <Column field="severity" header="Severity" sortable>
                <template #body="slotProps">
                  <span
                    :class="'order-badge order-' + slotProps.data.severity"
                    >{{ slotProps.data.severity }}</span
                  >
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <span :class="'order-badge order-' + slotProps.data.status">{{
                    slotProps.data.status
                  }}</span>
                </template>
              </Column>
              <Column field="created" header="Created Date" sortable>
                <template #body="slotProps">
                  <span>{{ callDate(slotProps.data.created) }}</span>
                </template>
              </Column>

              <Column headerStyle="width:4rem">
                <template #body="slotProps">
                  <Button
                    icon="pi pi-search"
                    @click="showDetail(slotProps.data)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
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
        <label for="maintenanceWorkerName">Maintenance Worker Name</label>
        <InputText
          v-model.trim="product.maintenanceWorkerName"
          required="true"
          disabled
        />
      </div>
      <div class="p-field">
        <label for="assessorName">Assessor Name</label>
        <InputText
          v-model.trim="product.assessorName"
          required="true"
          disabled
        />
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <InputText
          v-model.trim="product.description"
          required="true"
          disabled
        />
      </div>
      <div class="p-field">
        <label for="assessmentResult">Assessment Result</label>
        <Rating
          :modelValue="product.assessmentResult"
          :readonly="true"
          :stars="5"
          :cancel="false"
        />
      </div>
      <div class="p-field">
        <label for="status">Status</label>
        <InputText v-model.trim="product.status" required="true" disabled />
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
          <label for="maintenanceDate"> Maintenance Date</label>
          <InputText
            v-model.trim="product.maintenanceDate"
            required="true"
            disabled="true"
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
      </template>
    </Dialog>
    <Dialog
      v-model:visible="crackInfoDialog"
      :style="{ width: '450px' }"
      header="Cracks Details"
      :modal="true"
      class="p-fluid"
    >
      <img
        :src="crack.image"
        :alt="crack.image"
        class="product-image"
        v-if="crack.image"
      />
      <div class="p-field">
        <label for="locationName"> Location Name</label>
        <InputText
          id="locationName"
          v-model.trim="crack.locationName"
          required="true"
          disabled="true"
        />
      </div>
      <div class="p-field">
        <label for="reporterName"> Reporter Name</label>
        <InputText
          id="reporterName"
          v-model.trim="crack.reporter.name"
          required="true"
          disabled="true"
        />
      </div>
      <div class="p-field">
        <label for="position"> Position</label>
        <InputText
          id="reporterName"
          v-model.trim="crack.position"
          required="true"
          disabled="true"
        />
      </div>
      <div class="p-field">
        <label for="description"> Description</label>
        <Textarea
          id="description"
          v-model="crack.description"
          required="true"
          rows="3"
          cols="20"
          disabled="true"
        />
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-4">
          <label for="severity"> Severity</label>
          <InputText
            id="severity"
            v-model.trim="crack.severity"
            required="true"
            disabled="true"
          />
        </div>
        <div class="p-field p-col-8">
          <label for="status">Status</label>
          <InputText
            id="status"
            v-model.trim="crack.status"
            required="true"
            disabled="true"
          />
        </div>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="created"> Created Date</label>
          <InputText
            id="created"
            v-model.trim="crack.created"
            required="true"
            disabled="true"
          />
        </div>
        <div class="p-field p-col-6">
          <label for="lastModified"> Last Modified</label>
          <InputText
            id="lastModified"
            v-model.trim="crack.lastModified"
            required="true"
            disabled="true"
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
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    Rating,
  },

  computed: {
    ...mapGetters("maintenanceOrder", ["getMaintenanceOrderList"]),
    data() {
      return this.getMaintenanceOrderList;
    },
  },

  async created() {
    await this.setMaintenanceOrderList();
  },

  data() {
    return {
      crackInfoDialog: false,
      productDialog: false,
      showAssessment: false,
      product: {},
      crack: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      severitys: ["Low", "Medium", "High"],
      expandedRows: [],
    };
  },
  methods: {
    ...mapActions("maintenanceOrder", ["setMaintenanceOrderList"]),
    onRowExpand() {},
    onRowCollapse() {},
    hideDialog() {
      this.productDialog = false;
      this.showAssessment = false;
      this.submitted = false;
      this.crackInfoDialog = false;
    },
    showDetail(crack) {
      this.crack = { ...crack };
      this.crack.created = this.callDate(this.crack.created);
      this.crack.lastModified = this.callDate(this.crack.lastModified);
      this.crackInfoDialog = true;
    },
    editProduct(product) {
      this.product = { ...product };
      this.product.maintenanceDate = this.callDate(
        this.product.maintenanceDate
      );
      this.productDialog = true;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getMaintenanceOrderList.length; i++) {
        if (this.getMaintenanceOrderList[i].id === id) {
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
