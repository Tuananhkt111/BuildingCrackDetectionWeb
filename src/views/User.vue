<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getUserList"
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
            <h3 class="p-m-2">Manage User</h3>

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
        <Column field="userName" header="User Name" headerStyle="width: 200px">
          <template #body="slotProps">
            {{ slotProps.data.userName }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['userName']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column field="name" header="Full Name" headerStyle="width: 200px">
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
        <Column field="email" header="Email" headerStyle="width: 200px">
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
          field="phoneNumber"
          header="Phone Number"
          headerStyle="width: 200px"
        >
          <template #body="slotProps">
            {{ slotProps.data.phoneNumber }}
          </template>
          <template #filter>
            <InputText
              type="text"
              v-model="filters['phoneNumber']"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="role"
          header="Role"
          filterMatchMode="equals"
          headerStyle="width: 100px"
        >
          <template #body="slotProps">
            <span :class="'customer-badge status-' + slotProps.data.role">{{
              slotProps.data.role
            }}</span>
          </template>
          <template #filter>
            <Dropdown
              appendTo="body"
              v-model="filters['role']"
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
        <Column headerStyle="width: 150px">
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
        <label for="userName">User Name</label>
        <InputText
          id="userName"
          v-model.trim="product.userName"
          required="true"
          :class="{ 'p-invalid': submitted && !product.userName }"
          disabled
        />
        <small class="p-invalid" v-if="submitted && !product.userName"
          >UserName is required.</small
        >
      </div>
      <div class="p-field">
        <label for="name">Full Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-invalid" v-if="submitted && !product.name"
          >Full Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          type="email"
          id="email"
          v-model.trim="product.email"
          required="true"
          :class="{ 'p-invalid': submitted && !product.email }"
        />
        <small class="p-invalid" v-if="submitted && !product.email"
          >Email is required.</small
        >
      </div>
      <div class="p-field">
        <label for="phoneNumber">Phone Number</label>
        <InputText
          type="text"
          id="phoneNumber"
          v-model.trim="product.phoneNumber"
          required="true"
          :class="{ 'p-invalid': submitted && !product.phoneNumber }"
        />
        <small class="p-invalid" v-if="submitted && !product.phoneNumber"
          >PhoneNumber is required.</small
        >
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <Textarea
          id="address"
          v-model="product.address"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role">Role</label>
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
        <div class="p-field p-col-6">
          <label for="Location">Location</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getLocationList"
            optionLabel="name"
            placeholder="Select Location"
            :filter="true"
            class="multiselect-custom"
            key="locationId"
          />
          <Dropdown
            v-if="selectedRole === 'Staff'"
            v-model="selectedLocation"
            inputId="locationId"
            :options="getLocationList"
            optionLabel="name"
            placeholder="Select a Location"
            :filter="true"
          />
        </div>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="created"> Created Date</label>
          <InputText
            id="created"
            v-model.trim="product.created"
            required="true"
            disabled="true"
          />
        </div>
        <div class="p-field p-col-6">
          <label for="lastModified"> Last Modified</label>
          <InputText
            id="lastModified"
            v-model.trim="product.lastModified"
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
        <Button
          label="Update"
          icon="pi pi-user-edit"
          class="p-button-text"
          @click="UpdateUser"
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
        <label for="name">Full Name</label>
        <InputText
          id="UserName"
          v-model.trim="product.name"
          required="true"
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-invalid" v-if="submitted && !product.name"
          >Full Name is required.</small
        >
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          type="email"
          id="Email"
          v-model.trim="product.email"
          required="true"
          :class="{ 'p-invalid': submitted && !product.email }"
        />
        <small class="p-invalid" v-if="submitted && !product.email"
          >Email is required.</small
        >
      </div>
      <div class="p-field">
        <label for="phoneNumber">Phone Number</label>
        <InputText
          type="text"
          id="phoneNumber"
          v-model.trim="product.phoneNumber"
          required="true"
          :class="{ 'p-invalid': submitted && !product.phoneNumber }"
        />
        <small class="p-invalid" v-if="submitted && !product.phoneNumber"
          >PhoneNumber is required.</small
        >
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <Textarea
          id="address"
          v-model="product.address"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role">Role</label>
          <Dropdown v-model="selectedRole" :options="roles" placeholder="Role">
            <template #option="slotProps">
              <span :class="'customer-badge status-' + slotProps.option">{{
                slotProps.option
              }}</span>
            </template>
          </Dropdown>
        </div>
        <div class="p-field p-col-6">
          <label for="Location">Location</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getLocationList"
            optionLabel="name"
            placeholder="Select Location"
            :filter="true"
            class="multiselect-custom"
          />
          <Dropdown
            v-if="selectedRole === 'Staff'"
            v-model="selectedLocation"
            :options="getLocationList"
            optionLabel="name"
            placeholder="Select a Location"
            :filter="true"
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
          label="Create"
          icon="pi pi-check"
          class="p-button-text"
          @click="CreateUser"
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
          >Are you sure to reset password account <b>{{ product.name }}</b
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
          @click="confirmResetPassword"
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
          >Are you sure to disable account <b>{{ product.name }}</b
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
  </div>
</template>

<script>
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import MultiSelect from "primevue/multiselect";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { userApi } from "../apis/user";

export default {
  components: {
    Button,
    Toast,
    Dropdown,
    Rating,
    MultiSelect,
  },
  computed: {
    ...mapGetters("user", ["getUserList"]),
    ...mapGetters("location", ["getLocationList"]),
  },
  data() {
    return {
      createStaffLocation: null,
      changedRole: null,
      selectedRole: null,
      selectedLocation: null,
      UserDialog: false,
      UserUpdateDialog: false,
      showAssessment: false,
      DisableDialog: false,
      product: {},
      ResetPasswordDialog: false,
      filters: {},
      submitted: false,
      messages: [],
      roles: ["Manager", "Staff"],
    };
  },

  async created() {
    await this.setUserList();
    await this.setLocationList();
  },
  methods: {
    ...mapActions("user", ["setUserList"]),
    ...mapActions("location", ["setLocationList"]),

    openNew() {
      this.product = {};
      this.submitted = false;
      this.UserDialog = true;
      this.selectedRole = null;
      this.selectedLocation = null;
    },
    ResetPassowrd(product) {
      this.product = product;
      this.ResetPasswordDialog = true;
    },
    async confirmResetPassword() {
      await userApi
        .resetPassword(this.product.userId)
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          this.ResetPasswordDialog = false;
          this.$toast.add({
            severity: "info",
            summary: "Reset Password Success",
            life: 3000,
          });
        });
    },
    async CreateUser() {
      this.submitted = true;
      await userApi
        .createUser(
          this.selectedRole,
          this.product.name,
          this.product.email,
          this.product.phoneNumber,
          this.product.address,
          this.selectedLocation
        )
        .catch((err) => {
          console.log(err);
        });
      await this.setUserList();
      this.UserDialog = false;
    },
    async UpdateUser() {
      await userApi
        .updateUser(
          this.product.userId,
          this.product.name,
          this.product.email,
          this.product.phoneNumber,
          this.product.address,
          this.selectedLocation
        )
        .catch((err) => {
          console.log(err);
        });
      await this.setUserList();
      this.UserUpdateDialog = false;
    },
    Disable(product) {
      this.product = product;
      this.DisableDialog = true;
    },
    async DisableAccount() {
      await userApi.deleteUser(this.product.userId);
      await this.setUserList();
      this.DisableDialog = false;
    },
    hideDialog() {
      this.showAssessment = false;
      this.submitted = false;
      this.UserDialog = false;
      this.UserUpdateDialog = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getLocationList.length; i++) {
        if (this.getLocationList[i].locationId === id) {
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
    editProduct(product) {
      this.product = { ...product };
      this.selectedLocation = null;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.selectedRole = this.product.role;
      const tmp = this.product.locationIds;
      console.log(this.getLocationList);
      if(tmp.length == 1 && this.selectedRole == "Staff"){
        this.selectedLocation = this.getLocationList[this.findIndexById(this.product.locationIds[0])];
      } else {
        this.selectedLocation = [];
        for(let i = 0; i< tmp.length; i++){
          this.selectedLocation.push(this.getLocationList[this.findIndexById(tmp[i])]);
        }
      }
      // this.selectedLocation = this.product.locationIds;
      console.log(this.selectedLocation);
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
