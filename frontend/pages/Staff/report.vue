<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="รายงานผลการประเมิน" subtitle="ออกเอกสารรายงานผลเกี่ยวกับการประเมิน" icon="mdi-file-document"></page-header>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-card rounded="xl" elevation="3" v-for="r in report" :key="r.title" :to="r.link">
                                <v-list bg-color="transparent">
                                    <v-list-item :prepend-icon="r.icon" :title="r.title" :subtitle="r.detail" class="text-black"></v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const report = [
    {title:'รายงานผลผู้รับการประเมิน',detail:'ออกเอกสารรายงานผลเกี่ยวกับผู้รับการประเมิน',icon:'mdi-account-school',link:'/Staff/re_eva'},
    {title:'รายงานผลกรรมการประเมิน',detail:'ออกเอกสารรายงานผลเกี่ยวกับกรรมการประเมิน',icon:'mdi-account-star',link:'/Staff/re_commit'},
]

</script>

<style scoped>

</style>