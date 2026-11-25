<template>
    <v-container>
        <PageHeader title="ตรวจสอบผลการประเมิน" subtitle="เลือกดูคะแนนประเมินได้ทั้งผู้รับการประเมินและกรรมการประเมิน" icon="mdi-clipboard-search" color="#7d0c14"/>

        <v-row>
            <v-col cols="12" md="6" v-for="m in menus" :key="m.to">
                <v-card :to="m.to" rounded="xl" elevation="2" class="pa-6">
                    <div class="d-flex align-center">
                        <v-avatar :color="m.color" size="64" class="me-4">
                            <v-icon :icon="m.icon" color="white" size="32"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-title-large font-weigth-bold">{{ m.title }}</div>
                            <div class="text-body-medium text-medium-emphasis">{{ m.detail }}</div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const menus = [
    {title:'ผลการประเมินตนเอง',detail:'ผลการประเมินที่ท่านได้ทำการประเมิน',icon:'mdi-account-circle',color:'blue',to:'/Evaluatee/Score_member'},
    {title:'ผลการประเมินของกรรมการประเมิน',detail:'ผลการประเมินและข้อเสนอแนะของกรรมการ',icon:'mdi-account-group',color:'green',to:'/Evaluatee/Score_commit'},
]
</script>

<style scoped>

</style>