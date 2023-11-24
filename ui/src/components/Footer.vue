<template>
    <div class="footer">
        <div class="columns">
            <div class="column is-full text-is-centered">
<!--                <img src="@/assets/chef.png" style="width: auto; height: 25px;" alt="Footer icon"/>-->
<!--                &nbsp;-->
                <p>
                    <strong>
                        Mustachio Recipes © {{ new Date().getFullYear() }}
                    </strong>
                </p>
                <p>
                    <router-link class="is-italic" :to="{ name: 'TermsOfService' }">Terms of Service</router-link>
                    <router-link class="is-italic" :to="{ name: 'PrivacyPolicy' }">Privacy Policy</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-facing-decorator";

    @Component
    export default class Footer extends Vue { }
</script>

<style scoped>
.footer {
    bottom: 0;
    width: 100vw;
    /* padding: 0; */
    /*height: 80px;*/
    line-height: 25px;
    text-align: center;
    background: var(--color-panel-background-secondary);
    color: var(--color-text);
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.footer a {
    padding: 0 1rem 1rem 1rem;
    color: var(--color-heading-em);
}

.footer a i {
    font-size: 1.5rem;
    padding: 0 10px;
}

/*.footer a .nav-item {
    color: whitesmoke;
}*/
</style>
