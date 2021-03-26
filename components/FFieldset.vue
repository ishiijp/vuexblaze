<template>
  <div class="f-fieldset">
    <div class="legend">
      <slot name="legend" />
    </div>
    <div class="message">
      <slot name="message" />
    </div>
    <div class="fields">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.f-fieldset {
  padding: 0;
  border: none;

  > .legend {
    margin-bottom: 5px;
    font-weight: bold;
  }

  > .message {
    color: red;
    font-size: 0.8125rem;
  }

  > .fields {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  > .fields > .f-field {
    width: 100%;

    &._col-2 {
      width: calc((100% - 20px) / 2);
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
