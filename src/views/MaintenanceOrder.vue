<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="products"
        v-model:expandedRows="expandedRows"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
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
        <Column :expander="true" headerStyle="width: 3rem" />
        <Column
          field="maintenanceOrderId"
          header="Id"
          sortable
          headerStyle="width: 40px"
        ></Column>
        <Column
          field="AassessmentResult"
          header="Aassessment Result"
          headerStyle="width: 130px"
          ><template #body="slotProps">
            <Rating
              :modelValue="slotProps.data.AassessmentResult"
              :readonly="true"
              :stars="5"
              :cancel="false"
            />
          </template>
        </Column>
        <Column
          field="Status"
          header="Status"
          filterMatchMode="equals"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.Status">{{
              slotProps.data.Status
            }}</span>
          </template>

          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['Status']"
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
          field="RepairTime"
          header="Repair Time"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.RepairTime }}</span>
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
        <template #expansion="slotProps">
          <div class="orders-subtable">
            <h5>Orders for {{ slotProps.data.id }}</h5>
            <DataTable :value="slotProps.data.Cracks">
              <Column
                field="id"
                header="Error Id"
                sortable
                headerStyle="width: 50px"
              ></Column>
              <Column header="Image" headerStyle="width: 150px">
                <template #body="slotProps">
                  <img
                    :src="'demo/images/product/' + slotProps.data.image"
                    :alt="slotProps.data.image"
                    class="product-image"
                  />
                </template>
              </Column>
              <Column field="locationName" header="Location" sortable></Column>
              <Column field="Created" header="Created Date" sortable></Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <span
                    :class="
                      'order-badge order-' + slotProps.data.status.toLowerCase()
                    "
                    >{{ slotProps.data.status }}</span
                  >
                </template>
              </Column>
              <Column headerStyle="width:4rem">
                <template #body>
                  <Button icon="pi pi-search" />
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>
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
    Rating,
  },
  data() {
    return {
      products: null,
      showAssessment: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      severitys: ["Low", "Medium", "High"],
      expandedRows: [],
    };
  },
  locationService: null,
  created() {
    this.locationService = new Location();
  },

  mounted() {
    this.locationService
      .getMainteanceOrder()
      .then((data) => (this.products = data));
  },
  methods: {
    onRowExpand() {},
    onRowCollapse() {},
    hideDialog() {
      this.showAssessment = false;
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
