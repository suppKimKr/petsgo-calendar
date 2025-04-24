const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = {
    client: (function () {
        function client() {
            this.baseUrl = config.imweb.baseURL;
            this.accessKey = config.imweb.accessKey;
            this.secretKey = config.imweb.secretKey;

            this.accessToken = ``;

            this.instance = axios.create({
                baseURL: this.baseUrl,
                headers: {
                    Authorization: `${this.token}`,
                    'Content-type': 'application/json'
                },
            });
        }
        client.prototype.init = async function () {
            try {
                const payload = {
                    key: this.accessKey,
                    secret: this.secretKey,
                };

                const response = await this.instance.get(`/auth?key=${payload.key}&secret=${payload.secret}`);

                this.accessToken = response.data.access_token;

                this.instance = axios.create({
                    baseURL: this.baseUrl,
                    headers: {
                        'access-token': `${this.accessToken}`,
                        'Content-type': 'application/json',
                    },
                });
            } catch (e) {
                console.error(e.message);
            }
        };
        client.prototype.getProductLists = async function (params) {
            const { productId = '', status = '', category = '', limit = 100, offset = '' } = params;
            try {
                await this.init();

                let getUrl = (productId) ? `/shop/products/${productId}` : '/shop/products';
                getUrl += `?limit=${limit}`;
                if (status) getUrl += `&prod_status=${status}`;
                if (category) getUrl += `&category=${category}`;
                if (offset) getUrl += `&offset=${offset}`;

                const response = await this.instance.get(getUrl);

                return response?.data?.data?.list;
            } catch (e) {
                console.error(`[getPaymentInfo] :: ${e.message}`);
                throw new Error(e);
            }
        };
        return client;
    })(),
};