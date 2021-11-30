<template>
    <button @click="onClick" >{{ text }}</button>
</template>
<script>
export default {
    name: 'Button',
    props: {
        text: {
            type: String,
            default: 'text=""'
        } 
    },
    computed: {
        functionName() {
            return `${this.text.toLowerCase()}`; 
        }
    },
    methods: {
        onClick() {
            console.log('button click', `${this.functionName}`)
            this.$emit(this.functionName)
        }
    }
}
</script>