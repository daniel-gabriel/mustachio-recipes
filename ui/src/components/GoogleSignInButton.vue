<template>
    <a @click="onClick" class="google-sign-in-button">
        <img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="Sign in with Google" />
    </a>
</template>

<script lang="ts">
    import {Component, Emit, Vue} from "vue-facing-decorator";

    @Component
    export default class GoogleSignInButton extends Vue {
        @Emit("clicked")
        public onClick() {}
    }
</script>

<style scoped>
.google-sign-in-button {
    width: 200px;
}
</style>
