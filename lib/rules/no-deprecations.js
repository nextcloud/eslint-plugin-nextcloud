"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const global = {
    escapeHTML: '16.0.0',
    formatDate: '16.0.0',
    getURLParameter: '16.0.0',
    Handlebars: '16.0.0',
    humanFileSize: '16.0.0',
    initCore: '17.0.0',
    oc_appconfig: '17.0.0',
    oc_appswebroots: '17.0.0',
    oc_capabilities: '17.0.0',
    oc_config: '17.0.0',
    oc_current_user: '17.0.0',
    oc_debug: '17.0.0',
    oc_isadmin: '17.0.0',
    oc_requesttoken: '17.0.0',
    oc_webroot: '17.0.0',
    OCDialogs: '17.0.0',
    relative_modified_date: '16.0.0',
};

const oc = {
    _capabilities: '17.0.0',
    addTranslations: '17.0.0',
    coreApps: '17.0.0',
    getHost: '17.0.0',
    getHostName: '17.0.0',
    getPort: '17.0.0',
    getProtocol: '17.0.0',
    fileIsBlacklisted: '17.0.0',
};

const oc_sub = {

};

module.exports = {
    meta: {
        docs: {
            description: "Deprecated Nextcloud APIs",
            category: "Nextcloud",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        return {
            CallExpression: function (node) {
                // Globals
                if (global.hasOwnProperty(node.callee.name)) {
                    context.report(node, "The global property or function " + node.callee.name + " was deprecated in Nextcloud " + global[node.callee.name]);
                }
            },
            Identifier: function (node) {
                // Globals
                if (global.hasOwnProperty(node.name)) {
                    context.report(node, "The global property or function " + node.name + " was deprecated in Nextcloud " + global[node.name]);
                }
            },
            MemberExpression: function (node) {
                // Globals called with window.x
                if (node.object.name === 'window'
                    && global.hasOwnProperty(node.property.name)) {
                    context.report(node, "The global property or function " + node.property.name + " was deprecated in Nextcloud " + oc[node.property.name]);
                }

                // OC.x
                if (node.object.name === 'OC'
                    && oc.hasOwnProperty(node.property.name)) {
                    context.report(node, "The property or function OC." + node.property.name + " was deprecated in Nextcloud " + oc[node.property.name]);
                }

                // OC.x.y
                if (node.object.type === 'MemberExpression'
                    && node.object.object.name === 'OC'
                    && oc_sub.hasOwnProperty(node.object.property.name)
                    && oc_sub[node.object.property.name].hasOwnProperty(node.property.name)) {
                    const prop = [
                        "OC",
                        node.object.property.name,
                        node.property.name,
                    ].join('.');
                    const version = oc_sub[node.object.property.name][node.property.name]
                    context.report(node, "The property or function " + prop + " was deprecated in Nextcloud " + version);
                }
            }
        };
    }
};