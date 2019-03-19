
var converter = new showdown.Converter();

window.view = new Vue({
    router: new VueRouter({
        routes: []
    }),
    el: '#app',
    data: {
        loading: true,
        data: {}
    },
    mounted() {
        this.query();
    },
    computed: {
        name() {
            let spl = this.data.info.path.split('/');
            spl.splice(-1, 1, this.data.info.name);
            spl = spl.filter(x => !!x);
            return spl.join(' / ');
        },
        directories() {
            return this.data.files.filter(x => x.type === 'directory');
        },
        files() {
            return this.data.files.filter(x => x.type === 'file');
        },
        parent() {
            if (this.data.info.path == '/') return null;
            let spl = this.data.info.path.split('/').filter(x => !!x);
            spl.splice(spl.length - 1, 1);
            return '/' + spl.join('/');
        },
        readme() {
            if (!this.data.info.readme) return '';
            return converter.makeHtml(this.data.info.readme);
        }
    },
    methods: {
        icon(file) {
            if (file.type === 'directory') return 'folder';
            let spl = file.name.split('.');
            let last = spl[spl.length - 1];
            switch (last) {
                case '7z':
                case 'tar':
                case 'gz':
                case 'zip':
                case 'rar':
                    return 'archive';
                case 'mp3':
                case 'wav':
                case 'wmv':
                case 'midi':
                case 'ogg':
                    return 'audio';
                case 'exe':
                case 'msi':
                    return 'executable';
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':
                    return 'image';
                case 'mp4':
                case 'mpg':
                case 'mpeg':
                case 'wmv':
                case 'avi':
                case 'mov':
                    return 'video';
                default:
                    return 'unknown';
            }
        },
        size(file) {
            let size = file.size, i = 0;
            const sizes = [ "B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ];
            for (; size >= 1024; size /= 1024, i++);
            return (Math.round(size * 100) / 100) + ' ' + sizes[i];
            //return $size == 0
            //    ? 'N/A'
            //    : Math.round($size / pow(1024, ($i = floor(log($size, 1024)))), $i > 1 ? 2 : 0) . $sizes[$i]); }
        },
        query() {
            this.loading = true;
            let path = this.$route['path'];
            fetch('/_app/beep.php?path=' + encodeURIComponent(path))
                .then(data => data.json())
                .then(data => this.data = data)
                .then(_ => this.loading = false);
        }
    },
    watch: {
        $route() {
            this.query();
        }
    }
});