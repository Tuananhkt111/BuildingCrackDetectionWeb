<template>
  <div>
    <div class="card">
      <DataTable
        :scrollable="false"
        ref="dt"
        :value="getUserList"
        dataKey="userId"
        :paginator="true"
        :rows="5"
        v-model:filters="filters"
        :rowHover="true"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
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
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </span>
          </div>
        </template>
        
        <Column
          field="userName"
          header="User Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading"/>
            {{ slotProps.data.userName }}
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
        <Column field="name" header="Full Name" :showFilterMatchModes="false">
          <template #body="slotProps">
            <Skeleton v-if="loading"/>
            {{ slotProps.data.name }}
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
          field="email"
          header="Email"
          :showFilterMatchModes="false"
          headerStyle="width: 14em"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading"/>
            {{ slotProps.data.email }}
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
          field="phoneNumber"
          header="Phone"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading"/>
            {{ slotProps.data.phoneNumber }}
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
        <Column header="Role" filterField="role" :showFilterMatchModes="false">
          <template #body="{data}">
            <Skeleton v-if="loading"/>
            <span :class="stockClass(data)">
              {{ data.role }}
            </span>
          </template>
          <template #filter="{filterModel}">
            <div class="p-mb-3 p-text-bold">Role Picker</div>
            <MultiSelect
              v-model="filterModel.value"
              :options="roles"
              placeholder="Any"
              class="p-column-filter"
            >
              <template #option="slotProps">
                <span>{{ slotProps.option }}</span>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Skeleton v-if="loading"/>
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
        <template #empty>
          No Users found.
        </template>
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
        <label for="userName">User Name : {{ product.userName }}</label>
      </div>
      <div class="p-field">
        <label for="name">Full Name</label>
        <InputText name="name" v-model.trim="name" />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText type="email" name="email" v-model.trim="email" />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <div class="p-field">
        <label for="phoneNumber">Phone Number</label>
        <InputMask name="phone" mask="9999999999" v-model.trim="phone" />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <Textarea name="address" v-model="address" rows="3" cols="20" />
        <small class="invalid">{{ errors.address }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role">Role</label>
          <p>{{ selectedRole }}</p>
        </div>
        <div class="p-field p-col-6" v-if="selectedRole != null">
          <label for="Location">Location</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getAvailableLocationManager"
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
            :options="getAvailableLocationStaff"
            optionLabel="name"
            placeholder="Select a Location"
            :filter="true"
          />
        </div>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="created"> Created Date</label>
          <p>{{ product.created }}</p>
        </div>
        <div class="p-field p-col-6">
          <label for="lastModified"> Last Modified</label>
          <p>{{ product.lastModified }}</p>
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
        <p style="color:red" v-if="submitted">{{ warnning }}</p>
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
        <InputText name="name" v-model.trim="name" />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText type="email" name="email" v-model.trim="email" />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <div class="p-field">
        <label for="phoneNumber">Phone Number</label>
        <InputMask name="phone" mask="9999999999" v-model.trim="phone" />
        <small class="invalid">{{ errors.phone }}</small>
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
        <div class="p-field p-col-6" v-if="selectedRole != null">
          <label for="Location">Location</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getAvailableLocationManager"
            optionLabel="name"
            placeholder="Select Location"
            :filter="true"
            class="multiselect-custom"
          />
          <Dropdown
            v-if="selectedRole === 'Staff'"
            v-model="selectedLocation"
            :options="getAvailableLocationStaff"
            optionLabel="name"
            placeholder="Select a Location"
            :filter="true"
          />
        </div>
      </div>
      <div class="p-field">
        <label for="address">Address</label>
        <Textarea name="address" v-model="address" rows="3" cols="20" />
        <small class="invalid">{{ errors.address }}</small>
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
        <p style="color:red" v-if="submitted">{{ warnning }}</p>
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
    <Toast position="bottom-right"/>
  </div>
</template>

<script>
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import Rating from "primevue/rating";
import MultiSelect from "primevue/multiselect";
import Skeleton from "primevue/skeleton";
import contentNoti from "../util/contentNoti.js";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { userApi } from "../apis/user";
import { useForm, useField } from "vee-validate";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import * as yup from "yup";

export default {
  setup() {
    const schema = yup.object({
      name: yup
        .string()
        .max(20)
        .label("Name")
        .required(),
      email: yup
        .string()
        .required()
        .email(),
      address: yup
        .string()
        .max(30)
        .label("Address")
        .required(),
      phone: yup
        .string()
        .required()
        .label("Phone"),
    });
    const { errors, meta, handleReset } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");
    const { value: name } = useField("name");
    const { value: address } = useField("address");
    const { value: phone } = useField("phone");

    return {
      handleReset,
      email,
      name,
      address,
      phone,
      errors,
      meta,
    };
  },

  components: {
    Button,
    Toast,
    Dropdown,
    Rating,
    MultiSelect,
    InputMask,
    Skeleton
  },
  computed: {
    ...mapGetters("user", ["getUserList"]),
    ...mapGetters("location", [
      "getLocationList",
      "getAvailableLocationStaff",
      "getAvailableLocationManager",
    ]),
  },
  data() {
    return {
      createStaffLocation: null,
      changedRole: null,
      selectedLocation: null,
      selectedRole: null,
      UserDialog: false,
      UserUpdateDialog: false,
      showAssessment: false,
      DisableDialog: false,
      product: {},
      ResetPasswordDialog: false,
      filters: {},
      submitted: true,
      messages: [],
      roles: ["Manager", "Staff"],
      warnning: null,
      loading: true,
    };
  },

  async created() {
    this.initFilters();
    await this.setUserList();
    await this.setLocationList();
    this.loading = false;
  },
  methods: {
    ...mapActions("user", ["setUserList"]),
    ...mapActions("location", [
      "setLocationList",
      "setAvailableLocationStaff",
      "setAvailableLocationManager",
    ]),

    openNew() {
      this.setAvailableLocationStaff(null);
      this.setAvailableLocationManager(null);
      this.handleReset();
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
          this.$toast.add({
            severity: "success",
            summary: contentNoti.SUCCESS_SUMMARY,
            detail: contentNoti.USER_RESETPASSWORK_SUCCESS,
            life: 3000,
          });
          this.setUserList();
          this.submitted = false;
          this.ResetPasswordDialog = false;
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.USER_RESETPASSWORK_FAILED,
            life: 3000,
          });
          this.ResetPasswordDialog = false;
        });
    },
    async CreateUser() {
      if (this.meta.valid) {
        await userApi
          .createUser(
            this.selectedRole,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.selectedLocation
          )
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_CREATE_SUCCESS,
              life: 3000,
            });
            this.setUserList();
            this.UserDialog = false;
          })
          .catch((err) => {
            this.$toast.add({
              severity: contentNoti.FAIL_SUMMARY,
              summary: contentNoti.USER_CREATE_FAILED,
              detail: err.data,
              life: 3000,
            });
            this.UserDialog = false;
          });
      }
    },
    async UpdateUser() {
      if (this.meta.valid) {
        await userApi
          .updateUser(
            this.product.userId,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.selectedLocation
          )
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_EDIT_SUCCESS,
              life: 3000,
            });
            this.setUserList();
            this.UserUpdateDialog = false;
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_EDIT_FAILED,
              life: 3000,
            });
            this.setUserList();
            this.UserUpdateDialog = false;
          });
      }
    },
    Disable(product) {
      this.product = product;
      this.DisableDialog = true;
    },
    async DisableAccount() {
      await userApi
        .deleteUser(this.product.userId)
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: contentNoti.SUCCESS_SUMMARY,
            detail: contentNoti.USER_DISABLE_SUCCESS,
            life: 3000,
          });
          this.setUserList();
          this.DisableDialog = false;
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.USER_DISABLE_FAILED,
            life: 3000,
          });
          this.DisableDialog = false;
        });
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
      if (this.selectedRole == "Staff") {
        for (let i = 0; i < this.getAvailableLocationStaff.length; i++) {
          if (this.getAvailableLocationStaff[i].locationId === id) {
            index = i;
            break;
          }
        }
      } else {
        for (let i = 0; i < this.getAvailableLocationManager.length; i++) {
          if (this.getAvailableLocationManager[i].locationId === id) {
            index = i;
            break;
          }
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

    stockClass(data) {
      return [
        {
          staff: data.role === "Staff",
          manager: data.role === "Manager",
        },
      ];
    },
    async editProduct(product) {
      this.handleReset();
      this.name = product.name;
      this.email = product.email;
      this.phone = product.phoneNumber;
      this.address = product.address;
      this.product = { ...product };
      this.selectedLocation = null;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.selectedRole = this.product.role;
      const tmp = this.product.locationIds;
      if (tmp.length == 1 && this.selectedRole == "Staff") {
        await this.setAvailableLocationStaff(product.userId);
        this.selectedLocation = this.getAvailableLocationStaff[
          this.findIndexById(this.product.locationIds[0])
        ];
      } else {
        this.selectedLocation = [];
        await this.setAvailableLocationManager(product.userId);
        for (let i = 0; i < tmp.length; i++) {
          this.selectedLocation.push(
            this.getAvailableLocationManager[this.findIndexById(tmp[i])]
          );
        }
      }
      this.UserUpdateDialog = true;
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        userName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        email: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        phoneNumber: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        role: { value: null, matchMode: FilterMatchMode.IN },
      };
    },
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: left;
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

.staff {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #256029;
}

.manager {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: blue;
}
.invalid{
  color: red;
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
          min-width: 50%;
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
