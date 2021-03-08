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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Maintenance Orders"
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
        <template #empty>
          No Maintenance Order found.
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
          field="locationName"
          header="Location Name"
          sortable
          headerStyle="width: 120px"
          ><template #body="slotProps">
            {{ slotProps.data.locationName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['locationName']"
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
            <span :class="stockStatusOrder(slotProps.data)">
              {{ slotProps.data.status }}
            </span>
          </template>

          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['status']"
              :options="getStatusList"
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
            <DataTable :value="slotProps.data.cracks">
              <Column header="Image" headerStyle="width: 150px" class="small">
                <template #body="slotProps">
                  <img
                    :src=slotProps.data.image
                    :alt="slotProps.data.image"
                    class="product-image"
                  />
                </template>
              </Column>
              <Column field="severity" header="Severity" sortable>
                <template #body="slotProps">
                  <span :class="stockClass(slotProps.data)">
                    {{ slotProps.data.severity }}
                  </span>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <span :class="stockStatus(slotProps.data)">
                    {{ slotProps.data.status }}
                  </span>
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
      :style="{ width: '800px' }"
      header="Maintenance Order Details"
      :modal="true"
      class="p-fluid"
    >
       <div class="p-grid nested-grid">
          <div class="p-col-6">
            <p>
              <span style="font-weight: bold">Maintenance Worker: </span
              >{{ product.maintenanceWorkerName }}
            </p>
          </div>
          <div class="p-col-6">
            <p>
              <span style="font-weight: bold">Location Name: </span
              >{{ product.locationName }}
            </p>
          </div>
          <div class="p-col-6">
            <p>
              <span style="font-weight: bold">Status: </span
              >{{ product.status }}
            </p>
          </div>
          <div class="p-col-6">
            <p>
              <span style="font-weight: bold">Maintenance Date: </span
              >{{ product.maintenanceDate }}
            </p>
          </div>
          <div class="p-col-12">
            <p>
              <span style="font-weight: bold">Assessment Result: </span
              >{{ product.assessmentResult }}
            </p>
            <!-- <label for="assessmentResult" style="font-weight: bold">Assessment Result:</label>
            <Rating
              :modelValue="product.assessmentResult"
              :readonly="true"
              :stars="5"
              :cancel="false"
            /> -->
          </div>
          <div class="p-col-12">
            <p>
              <span style="font-weight: bold">Description: </span
              >{{ product.description }}
            </p>
          </div>
          <div class="p-col-12">
            <p>
              <span style="font-weight: bold">Assessor Name: </span
              >{{ product.assessorName }}
            </p>
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
      :style="{ width: '1000px' }"
      header="Cracks Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-grid nested-grid">
        <div class="p-col-2">
          <img
            :src="crack.image"
            :alt="crack.image"
            class="product-image"
            v-if="crack.image"
          />
        </div>
        <div class="p-col-9">
          <div class="p-grid">
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Position: </span
                >{{ crack.position }}
              </p>
            </div>
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Severity: </span
                >{{ crack.severity }}
              </p>
            </div>
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Status: </span
                >{{ crack.status }}
              </p>
            </div>
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Created Date: </span
                >{{ crack.created }}
              </p>
            </div>
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Last Modified: </span
                >{{ crack.lastModified }}
              </p>
            </div>
          </div>
        </div>
        <div class="p-col-12">
          <p>
            <span style="font-weight: bold">Description: </span
            >{{ crack.description }}
          </p>
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
    <Toast position="bottom-right"/>
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
// import Rating from "primevue/rating";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    // Rating,
  },

  computed: {
    ...mapGetters("maintenanceOrder", [
      "getMaintenanceOrderList",
      "getStatusList",
    ]),
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
    stockClass(data) {
      return [
        {
          low: data.severity === "Low",
          medium: data.severity === "Medium",
          high: data.severity === "High",
        },
      ];
    },
    stockStatus(data) {
      return [
        {
          detectedFailed: data.status === "DetectedFailed",
          unconfirmed: data.status === "Unconfirmed",
          unscheduled: data.status === "Unscheduled for maintenance",
          scheduledformaintenace: data.status === "Scheduled for maintenance",
          fix: data.status === "Fixed",
        },
      ];
    },
    stockStatusOrder(data) {
      return [
        {
          detectedFailed: data.status === "Waiting for confirm",
          unconfirmed: data.status === "Waiting for maintenance",
          fix: data.status === "Completed",
        },
      ];
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
.small {
  background-color: #66bb6a;
}
.p-fluid .p-dialog-footer .p-button {
  /* margin-bottom: -10px; */
  margin-top: -20px;
}
.orders-subtable {
  border-style: ridge;
}
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
.underline {
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
}
.low {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #66bb6a;
}

.medium {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ffa726;
}

.high {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.detectedFailed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.unconfirmed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ffa726;
}
.unscheduled {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #66bb6a;
}
.scheduledformaintenace {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.fix {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
</style>
