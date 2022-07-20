const protocol = 'http://'
const domain = 'localhost';
const port = ':8000';
const sufix = '/api';

export const environment = {
    production: true,
    baseUrl: `${protocol}${domain}${port}${sufix}`
};
