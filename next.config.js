module.exports = {
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ]
    }
}
