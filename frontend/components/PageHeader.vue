<template>
        <v-card rounded="xl" elevation="4" class="pa-6 mb-6" :color="color">
            <div class="d-flex align-center">
                    <v-icon :icon="icon" size="40" class="me-4"></v-icon>
                <div>
                    <div class="text-headline-small font-weight-bold">{{ title }}</div>
                    <div class="text-body-medium" v-if="subtitle">{{ subtitle }}</div>
                </div>
            </div>
        </v-card>
</template>

<script setup lang="ts">
defineProps({title:String,subtitle:String,icon:String,color:{
    type:String,default:'blue-grey'
}})
</script>

<style scoped>

</style>