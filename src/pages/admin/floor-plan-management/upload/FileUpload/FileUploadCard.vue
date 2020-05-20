<template>
  <b-card
    header="Upload Floor Plan"
    header-tag="h4"
  >
    <b-form ref="form">
      <b-form-group>
        <b-form-select
          ref="floorSelect"
          v-model="selectedFloor"
          :state="floorIsValid"
          @change="checkUploadValidity"
        >
          <b-form-select-option
            v-for="floor in floorsProp"
            :key="floor.id"
            :value="floor.id"
          >
            {{ floor.type.name }}
          </b-form-select-option>
        </b-form-select>
        <b-form-invalid-feedback v-if="floorValidFeedback">
          {{ floorValidFeedback }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <b-form-file
          ref="file"
          v-model="file"
          accept=".dwg"
          required
          :state="fileIsValid"
          placeholder="Choose a .dwg file"
        />
        <b-form-invalid-feedback v-if="fileValidFeedback">
          {{ fileValidFeedback }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <b-btn
          variant="success"
          class="float-right"
          :disabled="disableUpload"
          @click="uploadFile"
        >
          Upload
        </b-btn>
      </b-form-group>
    </b-form>
  </b-card>
</template>

<script>
import { UrnService } from '@/services';
import toastr from '@/plugins/notifications';

export default {
  name: `file-upload-card`,
  props: {
    floorsProp: { type: Array, required: true },
  },
  data() {
    return {
      disableUpload: true,
      file: null,
      fileIsValid: null,
      floorIsValid: null,
      fileValidFeedback: null,
      floorValidFeedback: null,
      selectedFloor: this.floorsProp[0].id,
    };
  },
  watch: {
    file(val) {
      if (val) {
        const fname = this.file.name.substring(0, this.file.name.indexOf(`.`));
        const floor = this.floorsProp.find(f => f.fname === fname);

        if (floor) {
          if (this.file.size > 2500000) {
            toastr.warning(`This file may be too large. Remove excess data from the file.`, `File Size Large`);
          }

          this.selectedFloor = floor.id;
          this.floorIsValid = true;
          this.floorValidFeedback = null;
          this.fileIsValid = true;
          this.fileValidFeedback = null;
          this.disableUpload = false;
        }
        else {
          this.fileIsValid = false;
          this.fileValidFeedback = `The selected DWG does not match any floors of this box`;
          this.disableUpload = true;
        }
      } else {
        this.fileValidFeedback = `You must select a DWG file to upload`;
        this.disableUpload = true;
      }
    },
  },
  methods: {
    async uploadFile() {
      this.disableUpload = true;
      const formData = new FormData();
      formData.append(`file`, this.file);
      await UrnService.upload(this.selectedFloor, formData);
      toastr.success(`Success! Check the store in 2-3 minutes`);
      this.file = null;
      this.selectedFloor = this.floorsProp[0].id;
    },
    checkUploadValidity() {
      if (this.file) {
        const fname = this.file.name.substring(0, this.file.name.indexOf(`.`));
        const floor = this.floorsProp.find(f => f.fname === fname);

        if (floor && floor.id === this.selectedFloor) {
          this.floorIsValid = true;
          this.floorValidFeedback = null;
          this.disableUpload = false;
        }
        else {
          this.floorIsValid = false;
          this.floorValidFeedback = `The floor and file selections do not match`;
          this.disableUpload = true;
        }
      }
    },
  },
};
</script>
