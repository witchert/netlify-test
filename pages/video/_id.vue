<template>
    <div>
        <h1 v-html="video.title.rendered" />
        <div v-html="video.acf.description" />
        <picture>
            <source :srcset="thumbnailSrcWebP" type="image/webp">
            <source :srcset="thumbnailSrc" type="image/jpeg">
            <img :src="thumbnailSrc">
        </picture>
    </div>
</template>

<script>
    import WPAPI from 'wpapi';

    export default {
        async asyncData({ app, params, payload }) {
            if (payload) {
                return {video: payload}
            }
            const wp = new WPAPI({endpoint: 'https://local.realvision.com/wp-json'});
            wp.videos = wp.registerRoute('wp/v2', '/video/(?P<id>)');
            const video = await wp.videos().id(params.id);

            return {video: video }
        },
        computed: {
            thumbnailSrc() {
                return `https://ichef.realvision.com/429x/${this.video.acf.content_id}/hero`;
            },
            thumbnailSrcWebP() {
                return `https://ichef.realvision.com/429x/filters:format(webp)/${this.video.acf.content_id}/hero`;
            },
        }
    }
</script>