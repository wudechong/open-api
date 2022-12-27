<template lang="pug">
	#app
		router-view
</template>

<script>
export default {
	name: "App",
	async created () {
    	console.log('11.10-2');
		if (window.location.href.indexOf('erp') === -1) {
		  document.cookie = 'CALFSESSIONID=35a8d5e6-5f7f-4444-a517-0c7719d64174'   
		}
	}
};
</script>

