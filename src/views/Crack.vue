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
          headerStyle="width: 200px"
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
        <Column
          field="reporterName"
          header="Reporter Name"
          headerStyle="width: 200px"
        >
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
        <Column
          field="severity"
          header="Severity"
          filterMatchMode="equals"
          headerStyle="width: 150px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.severity">{{
              slotProps.data.severity
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['severity']"
              :options="severitys"
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
          field="created"
          header="created"
          filterMatchMode="custom"
          :filterFunction="filterDate"
          headerStyle="width: 250px"
        >
          <template #body="slotProps">
            <span>{{ callDate(slotProps.data.created) }}</span>
            <!-- <span>{{ slotProps.data.created }}</span> -->
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
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="showDetail(slotProps.data)"
              style="margin: 2px"
            />
            <Button
              icon="pi pi-star"
              class="p-button-rounded p-button-warning p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
            />
            <Button
              icon="pi pi-calendar-minus"
              class="p-button-rounded p-button-danger p-button-text"
              @click="showAssessmentDialog(slotProps.data)"
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
      <div class="p-field">
        <label for="locationName"> Location Name</label>
        <InputText
          id="locationName"
          v-model.trim="product.locationName"
          required="true"
          disabled="true"
          autofocus
        />
      </div>
      <div class="p-field">
        <label for="reporterName"> Reporter Name</label>
        <InputText
          id="reporterName"
          v-model.trim="product.reporterName"
          required="true"
          disabled="true"
          autofocus
        />
      </div>
      <div class="p-field">
        <label for="position"> Position</label>
        <InputText
          id="reporterName"
          v-model.trim="product.position"
          required="true"
          disabled="true"
          autofocus
        />
      </div>
      <div class="p-field">
        <label for="description"> Description</label>
        <Textarea
          id="description"
          v-model="product.description"
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
            v-model.trim="product.severity"
            required="true"
            disabled="true"
            autofocus
          />
        </div>
        <div class="p-field p-col-8">
          <label for="status">Status</label>
          <InputText
            id="status"
            v-model.trim="product.status"
            required="true"
            disabled="true"
            autofocus
          />
        </div>
      </div>
      <div class="p-field">
        <label for="created"> Created Date</label>
        <InputText
          id="created"
          v-model.trim="product.created"
          required="true"
          disabled="true"
          autofocus
        />
      </div>
      <div class="p-field">
        <label for="lastModified"> Last Modified</label>
        <InputText
          id="lastModified"
          v-model.trim="product.lastModified"
          required="true"
          disabled="true"
          autofocus
        />
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
import Location from "../data/LocationService.js";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import moment from "moment";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    Rating,
    Textarea,
  },
  data() {
    return {
      products: null,
      crackInfoDialog: null,
      showAssessment: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      severitys: ["Low", "Medium", "High"],
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
      this.showAssessment = false;
      this.crackInfoDialog = false;
      this.submitted = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
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
    redirectMainteanceOrder() {
      
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
