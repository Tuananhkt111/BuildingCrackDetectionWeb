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
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'maintenanceWorkerName',
          'assessorName',
          'locationName',
          'status',
        ]"
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
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
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
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.maintenanceWorkerName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="assessorName"
          header="Assessor Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.assessorName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="locationName"
          header="Location Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.locationName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          header="Status"
          filterField="status"
          :showFilterMatchModes="false"
          :filterMenuStyle="{ width: '14rem' }"
          style="min-width:14rem"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            <span :class="stockStatusOrder(data)">
              {{ data.status }}
            </span>
          </template>
          <template #filter="{filterModel}">
            <div class="p-mb-3 p-text-bold">Status Picker</div>
            <MultiSelect
              v-model="filterModel.value"
              :options="getStatusList"
              placeholder="Any"
              class="p-column-filter"
            >
              <template #option="slotProps">
                <span>{{ slotProps.option }}</span>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column
          header="Maintenance Date"
          filterField="maintenanceDate"
          dataType="date"
          style="min-width:20px"
          headerStyle="width: 13em"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            {{ callDate(data.maintenanceDate) }}
          </template>
          <template #filter="{filterModel}">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column headerStyle="width: 5em">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
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
                  <Skeleton v-if="loading" />
                  <img
                    :src=slotProps.data.imageThumbnails
                    :alt="slotProps.data.imageThumbnails"
                    class="product-image"
                    @click="showImage(slotProps.data)"
                  />
                </template>
              </Column>
              <Column field="severity" header="Severity" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span :class="stockClass(slotProps.data)">
                    {{ slotProps.data.severity }}
                  </span>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span :class="stockStatus(slotProps.data)">
                    {{ slotProps.data.status }}
                  </span>
                </template>
              </Column>
              <Column field="created" header="Created Date" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span>{{ callDate(slotProps.data.created) }}</span>
                </template>
              </Column>
              <Column headerStyle="width:4rem">
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
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
      :style="{ width: '700px' }"
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
            <span style="font-weight: bold">Status: </span>{{ product.status }}
          </p>
        </div>
        <div class="p-col-6">
          <p>
            <span style="font-weight: bold">Maintenance Date: </span
            >{{ product.maintenanceDate }}
          </p>
        </div>
        <div class="p-col-6">
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
        <div class="p-col-6">
          <p>
            <span style="font-weight: bold">Assessor Name: </span
            >{{ product.assessorName }}
          </p>
        </div>
        <div class="p-col-12">
          <p>
            <span style="font-weight: bold" v-if="product.desciption != null"
              >Description: {{ product.description }}</span
            >
            <span style="font-weight: bold" v-if="product.desciption == null || product.desciption.isEmpty()"
              >Description: <span style="font-weight: normal">N/A</span></span
            >
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
      :modal="true"
      class="dialog"
    >
      <template #header>
        <h3>Cracks Details</h3>
      </template>
      <div class="p-grid nested-grid">
        <div class="p-col-3">
          <img
            :src="crack.imageThumbnails"
            :alt="crack.imageThumbnails"
            class="crack-image"
            v-if="crack.image"
            @click="showImage(crack)"
            style="width:200px; height:100%"
          />
        </div>

        <div class="p-col-9">
          <div class="p-grid">
            <div class="p-col-6">
              <p>
                <span style="font-weight: bold">Location Name: </span
                >{{ crack.locationName }}
              </p>
            </div>
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
            <div class="p-col-12">
              <p>
                <span
                  style="font-weight: bold"
                  v-if="crack.desciption != null"
                  >Description: {{ crack.description }}</span
                >
                <span
                  style="font-weight: bold"
                  v-if="
                    crack.desciption == null || crack.desciption.isEmpty()
                  "
                  >Description:
                  <span style="font-weight: normal">N/A</span></span
                >
              </p>
            </div>
            <div class="p-col-12">
              <p>
                <span style="font-weight: bold">Reporter Name: </span
                >{{ crack.reporterName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    
    <div class="imagePopup" v-if="displayImage" @click="hiddenImage">
      <img
        :src="crack.image"
        style="width:60%; height: 75%; margin-left:270px; margin-top:100px"
      />
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Toast from "primevue/toast";
import Skeleton from "primevue/skeleton";
// import Rating from "primevue/rating";
import { mapGetters, mapActions } from "vuex";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import moment from "moment";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    MultiSelect,
    Skeleton,
    // Rating,
  },

  computed: {
    ...mapGetters("maintenanceOrder", [
      "getMaintenanceOrderList",
      "getStatusList",
    ]),
  },

  async created() {
    this.initFilters();
    this.setMaintenanceOrderList();
    this.loading = false;
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
      loading: true,
      displayImage: false,
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
    showImage(crack) {
      document.body.style.overflow = "hidden";
      this.crack = { ...crack };
      this.displayImage = true;
    },
    hiddenImage() {
      document.body.style.overflow = "visible";
      this.displayImage = false;
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
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        maintenanceWorkerName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        assessorName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        status: { value: null, matchMode: FilterMatchMode.IN },
        maintenanceDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      };
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

.imagePopup {
  width: 100%;
  height: 100%;
  z-index: 999999;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  left: 0;
  align-content: center;
}

@media screen and (max-width: 40em) {
  ::v-deep(.p-datatable) {
    &.p-datatable-responsive-demo {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr > td {
        display: block;
        width: 100%;
        border: 0 none;

        .p-column-title {
          padding: 0.4rem;
          min-width: 30%;
          display: inline-block;
          margin: -0.4em 1em -0.4em -0.4rem;
          font-weight: bold;
        }

        &:last-child {
          border-bottom: 1px solid var(--surface-d);
          text-align: center;
        }

        .p-rating {
          display: inline-block;
        }
      }
    }
  }
}
</style>
