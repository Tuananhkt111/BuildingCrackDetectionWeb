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
        <Column field="UserName" header="User Name" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.UserName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['UserName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="Name" header="Full Name" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.Name }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['Name']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="Email" header="Email" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.Email }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['Email']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="PhoneNumber"
          header="Phone Number"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            {{ slotProps.data.PhoneNumber }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['PhoneNumber']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="Role"
          header="Role"
          filterMatchMode="equals"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.Role">{{
              slotProps.data.Role
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['Role']"
              :options="roles"
              placeholder="Role"
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
        <Column headerStyle="width: 230px">
          <template #body="slotProps">
            <Button
              icon="pi pi-user-edit"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'Edit'"
            />
            <Button
              icon="pi pi-lock"
              class="p-button-rounded p-button-warning p-button-text"
              @click="ResetPassowrd(slotProps.data)"
            />
            <Button
              icon="pi pi-ban"
              class="p-button-rounded p-button-danger p-button-text"
              @click="Disable(slotProps.data)"
            />
            <Button
              icon="pi pi-chevron-circle-right"
              class="p-button-rounded p-button-info p-button-text"
              @click="toggle"
              aria:haspopup="true"
              aria-controls="overlay_panel"
            />
            <Button
              icon="pi pi-key"
              class="p-button-rounded p-button-warning p-button-text"
              @click="changeRole(slotProps.data)"
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
          :modelValue="product.AssessmentResult.Rating"
          :readonly="true"
          :stars="5"
          :cancel="false"
        />
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
    <Dialog
      v-model:visible="UserUpdateDialog"
      :style="{ width: '450px' }"
      header="User Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name">User Name</label>
        <InputText
          id="UserName"
          v-model.trim="product.UserName"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.UserName }"
        />
        <small class="p-invalid" v-if="submitted && !product.UserName"
          >UserName is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Name">Full Name</label>
        <InputText
          id="UserName"
          v-model.trim="product.Name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.Name }"
        />
        <small class="p-invalid" v-if="submitted && !product.Name"
          >Full Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Email">Email</label>
        <InputText
          type="email"
          id="Email"
          v-model.trim="product.Email"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.Email }"
        />
        <small class="p-invalid" v-if="submitted && !product.Email"
          >Email is required.</small
        >
      </div>
      <div class="p-field">
        <label for="PhoneNumber">Phone Number</label>
        <InputText
          type="text"
          id="PhoneNumber"
          v-model.trim="product.PhoneNumber"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.PhoneNumber }"
        />
        <small class="p-invalid" v-if="submitted && !product.PhoneNumber"
          >PhoneNumber is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Address">Address</label>
        <Textarea
          id="Address"
          v-model="product.Address"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Update"
          icon="pi pi-user-edit"
          class="p-button-text"
          @click="CreateUser"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="UserDialog"
      :style="{ width: '450px' }"
      header="User Information"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name">User Name</label>
        <InputText
          id="UserName"
          v-model.trim="product.UserName"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.UserName }"
        />
        <small class="p-invalid" v-if="submitted && !product.UserName"
          >UserName is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Name">Full Name</label>
        <InputText
          id="UserName"
          v-model.trim="product.Name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.Name }"
        />
        <small class="p-invalid" v-if="submitted && !product.Name"
          >Full Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Email">Email</label>
        <InputText
          type="email"
          id="Email"
          v-model.trim="product.Email"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.Email }"
        />
        <small class="p-invalid" v-if="submitted && !product.Email"
          >Email is required.</small
        >
      </div>
      <div class="p-field">
        <label for="PhoneNumber">Phone Number</label>
        <InputText
          type="text"
          id="PhoneNumber"
          v-model.trim="product.PhoneNumber"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.PhoneNumber }"
        />
        <small class="p-invalid" v-if="submitted && !product.PhoneNumber"
          >PhoneNumber is required.</small
        >
      </div>
      <div class="p-field">
        <label for="Address">Address</label>
        <Textarea
          id="Address"
          v-model="product.Address"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="p-field">
        <label for="Role">Role</label>
        <Dropdown
          v-model="selectedRole"
          appendTo="body"
          :options="roles"
          placeholder="Role"
        >
          <template #option="slotProps">
            <span :class="'customer-badge status-' + slotProps.option">{{
              slotProps.option
            }}</span>
          </template>
        </Dropdown>
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
          @click="CreateUser"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="ChangeRoleDialog"
      :style="{ width: '450px' }"
      header="Role"
      :modal="true"
      class="p-fluid"
    >
      <div
        v-for="role of roles"
        :key="role.key"
        class="p-field-radiobutton"
      >
        <RadioButton
          :id="role.key"
          name="role"
          :value="role"
          v-model="selectedRole"
          :disabled="role === 'Administrator'"
        />
        <label :for="role.key">{{ role }}</label>
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
          @click="ChangeRole"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="ResetPasswordDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to reset password acount <b>{{ product.UserName }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="ResetPasswordDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteProduct"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="DisableDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to disable acount <b>{{ product.UserName }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="DisableDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="DisableAccount"
        />
      </template>
    </Dialog>
    <Toast />
    <OverlayPanel
      ref="op"
      appendTo="body"
      :showCloseIcon="true"
      id="overlay_panel"
      style="width: 450px"
    >
      <DataTable
        :value="locations"
        v-model:selection="selectedLocation"
        selectionMode="single"
        :paginator="true"
        :rows="5"
        @row-select="onProductSelect"
      >
        <Column field="locationName" header="locationName" sortable></Column>
        <Column field="description" header="description" sortable></Column>
      </DataTable>
    </OverlayPanel>
  </div>
</template>

<script>
import Location from "../data/LocationService.js";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import OverlayPanel from "primevue/overlaypanel";
import RadioButton from "primevue/radiobutton";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    Dropdown,
    Rating,
    OverlayPanel,
    RadioButton,
  },
  data() {
    return {
      ChangeRoleDialog: false,
      changedRole: null,
      selectedRole: null,
      locations: null,
      selectedLocation: null,
      products: null,
      UserDialog: false,
      UserUpdateDialog: false,
      showAssessment: false,
      DisableDialog: false,
      product: {},
      selectedProducts: null,
      ResetPasswordDialog: false,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      roles: ["Administrator", "Manager", "Staff"],
    };
  },
  locationService: null,
  created() {
    this.locationService = new Location();
  },

  mounted() {
    this.locationService.getUsers().then((data) => (this.products = data));
    this.locationService.getLocation().then((data) => (this.locations = data));
  },
  methods: {
    changeRole(product) {
      this.selectedRole = product.Role;
      this.ChangeRoleDialog = true;
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    },
    onProductSelect(event) {
      this.$refs.op.hide();
      this.$toast.add({
        severity: "info",
        summary: "Location Selected",
        detail: event.data.locationName,
        life: 3000,
      });
    },

    openNew() {
      this.product = {};
      this.submitted = false;
      this.UserDialog = true;
    },
    ResetPassowrd(product) {
      this.product = product;
      this.ResetPasswordDialog = true;
    },
    CreateUser() {
      this.submitted = true;
      this.products.push(this.product);
      this.UserDialog = false;
    },
    Disable(product) {
      this.product = product;
      this.DisableDialog = true;
    },
    DisableAccount() {
      this.products = this.products.filter(
        (val) => val.UserId !== this.product.UserId
      );
      this.DisableDialog = false;
      this.product = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
    hideDialog() {
      this.showAssessment = false;
      this.submitted = false;
      this.UserDialog = false;
      this.UserUpdateDialog = false;
      this.ChangeRoleDialog = false;
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
    editProduct(product) {
      this.product = { ...product };
      this.UserUpdateDialog = true;
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
