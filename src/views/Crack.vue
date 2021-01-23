<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getCrackList"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cracks"
      >
        <template #header>
          <div class="table-header">
            <h3 class="p-m-2">Manage Cracks</h3>

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
          No Cracks found.
        </template>
        <Column header="Image">
          <template #body="slotProps">
            <img
              :src="slotProps.data.image"
              :alt="slotProps.data.image"
              class="product-image"
              style="width: 100px ; height: 100px"
              @click="showImage(slotProps.data.image)"
            />
          </template>
        </Column>
        <Column
          field="locationName"
          header="Location Name"
          filterMatchMode="contains"
        >
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
        <Column field="reporterName" header="Reporter Name">
          <template #body="slotProps">
            {{ slotProps.data.reporterName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['reporterName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="severity" header="Severity" filterMatchMode="equals">
          <template #body="slotProps">
                  <div :class="stockClass(slotProps.data)">
                    {{ slotProps.data.severity }}
                  </div>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['severity']"
              :options="getSeveritysList"
              placeholder="Severity"
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
        <Column field="status" header="Status" filterMatchMode="equals">
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.status">{{
              slotProps.data.status
            }}</span>
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
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="showDetail(slotProps.data)"
              style="margin: 2px"
              v-tooltip.bottom="'View Crack Detail'"
            />
            <Button
              icon="pi pi-star"
              class="p-button-rounded p-button-warning p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
              v-tooltip.bottom="'Show Assesment'"
            />
            <Button
              icon="pi pi-calendar-minus"
              class="p-button-rounded p-button-danger p-button-text"
              @click="showMaintenanceOrder(slotProps.data)"
              v-tooltip.bottom="'View Maintenance Order'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="showAssessment"
      :style="{ width: '450px' }"
      header="Assessment"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <Rating
          :modelValue="product.assessmentResult"
          :readonly="true"
          :stars="5"
          :cancel="false"
        />
      </div>
      <div class="p-field">
        <label for="assessmentDescription">Assessment Description</label>
        <Textarea
          id="description"
          v-model="product.assessmentDescription"
          required="true"
          rows="2"
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
    <Dialog
      v-model:visible="crackInfoDialog"
      :style="{ width: '450px' }"
      header="Cracks Details"
      :modal="true"
      class="p-fluid"
    >
      <img
        :src="product.image"
        :alt="product.image"
        class="product-image"
        v-if="product.image"
      />
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <p>Location Name</p>
          <span>{{ product.locationName }}</span>
        </div>
        <div class="p-field p-col-6">
          <p>Reporter Name</p>
          <span>{{ product.reporterName }}</span>
        </div>
      </div>
      <div class="p-field">
        <p>Position</p>
        <span>{{ product.position }}</span>
      </div>
      <div class="p-field">
        <label for="description"> Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          disabled="true"
        />
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-4">
          <p>Severity</p>
          <span>{{ product.severity }}</span>
        </div>
        <div class="p-field p-col-8">
          <p>Status</p>
          <span>{{ product.status }}</span>
        </div>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <p>Created Date</p>
          <span>{{ product.created }}</span>
        </div>
        <div class="p-field p-col-6">
          <p>Last Modified</p>
          <span>{{ product.lastModified }}</span>
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
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Button,
    Toast,
    Dropdown,
    Rating,
    Textarea,
  },
  computed: {
    ...mapGetters("crack", [
      "getCrackList",
      "getStatusList",
      "getSeveritysList",
    ]),

    data() {
      return this.getCrackList;
    },
  },
  data() {
    return {
      crackInfoDialog: false,
      showAssessment: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
    };
  },
  async created() {
    await this.setCrackList();
  },
  methods: {
    ...mapActions("crack", ["setCrackList"]),
    showImage(image) {
      console.log(image);
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
    hideDialog() {
      this.showAssessment = false;
      this.crackInfoDialog = false;
      this.submitted = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    showMaintenanceOrder(product) {
      localStorage.setItem("orderId", product.maintenanceOrderId);
      this.$router.push(
        "/maintenanceOrders?orderId=" + product.maintenanceOrderId
      );
    },
    showDetail(product) {
      this.product = { ...product };
      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.crackInfoDialog = true;
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
    redirectMainteanceOrder() {},
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
textarea {
    border: none;
    overflow: auto;
    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none; /*remove the resize handle on the bottom right*/
}
.low {
    font-weight: 700;
    color: #66BB6A;
}

.medium {
    font-weight: 700;
    color: #FFA726;
}

.high {
    font-weight: 700;
    color: #FF5252;
}
</style>
