<template>
    <a @click="onClick" :style="{ width: width}">
        <img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="Sign in with Google" />
    </a>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-facing-decorator";

    @Component
    export default class GoogleSignInButton extends Vue {
        @Prop({ default: "200px" })
        public width!: string;

        @Emit("clicked")
        public onClick() {}
    }
</script>
