<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card
          bg-variant="light"
          title="Failed to Translate"
          style="word-wrap: break-word;"
        >
          <h4>
            Your file failed to translate, please contact support.
          </h4>
          <br>
          <p>
            {{ $route.params.message }}
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: `translation-failed-error`,
};
</script>
