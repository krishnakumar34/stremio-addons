"use strict";
exports.__esModule = true;
var _a = require('../package.json'), version = _a.version, description = _a.description;
exports["default"] = {
    id: 'com.sleeyax.redboxtv',
    name: 'RedBox TV',
    version: version,
    description: description,
    logo: 'https://i.imgur.com/5EhJ8iG.png',
    background: 'https://i.imgur.com/uVNqq6y.jpg',
    idPrefixes: ['rbtv'],
    types: ['tv'],
    resources: ['catalog', 'stream', 'meta'],
    catalogs: [
        {
            id: 'redboxtv',
            type: 'tv',
            name: 'RedBox TV',
            extra: [
                {
                    name: 'genre',
                    isRequired: true,
                    options: [] // options will be populated later on
                },
                {
                    name: 'skip',
                    isRequired: false
                }
            ]
        },
        {
            id: 'redboxtv-search',
            type: 'tv',
            name: 'RedBox TV',
            extra: [
                {
                    name: 'search',
                    isRequired: true
                },
            ]
        }
    ]
};
