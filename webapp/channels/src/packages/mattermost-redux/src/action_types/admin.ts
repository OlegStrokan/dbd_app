// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import keyMirror from 'mattermost-redux/utils/key_mirror';

export default keyMirror({
    CREATE_COMPLIANCE_REQUEST: null,
    CREATE_COMPLIANCE_SUCCESS: null,
    CREATE_COMPLIANCE_FAILURE: null,

    LINK_LDAP_GROUP_FAILURE: null,

    UNLINK_LDAP_GROUP_FAILURE: null,

    PREV_TRIAL_LICENSE_SUCCESS: null,

    ENABLE_PLUGIN_REQUEST: null,
    ENABLE_PLUGIN_FAILURE: null,

    DISABLE_PLUGIN_REQUEST: null,

    RECEIVED_LOGS: null,
    RECEIVED_PLAIN_LOGS: null,
    RECEIVED_AUDITS: null,
    RECEIVED_CONFIG: null,
    RECEIVED_ENVIRONMENT_CONFIG: null,
    RECEIVED_COMPLIANCE_REPORT: null,
    RECEIVED_COMPLIANCE_REPORTS: null,
    RECEIVED_CLUSTER_STATUS: null,
    RECEIVED_SAML_CERT_STATUS: null,
    RECEIVED_SYSTEM_ANALYTICS: null,
    RECEIVED_TEAM_ANALYTICS: null,
    RECEIVED_USER_ACCESS_TOKEN: null,
    RECEIVED_USER_ACCESS_TOKENS: null,
    RECEIVED_USER_ACCESS_TOKENS_FOR_USER: null,
    RECEIVED_PLUGINS: null,
    RECEIVED_PLUGIN_STATUSES: null,
    RECEIVED_LDAP_GROUPS: null,
    LINKED_LDAP_GROUP: null,
    UNLINKED_LDAP_GROUP: null,
    REMOVED_PLUGIN: null,
    ENABLED_PLUGIN: null,
    DISABLED_PLUGIN: null,

    RECEIVED_SAML_METADATA_RESPONSE: null,

    RECEIVED_DATA_RETENTION_CUSTOM_POLICIES: null,
    RECEIVED_DATA_RETENTION_CUSTOM_POLICY: null,
    DELETE_DATA_RETENTION_CUSTOM_POLICY_SUCCESS: null,
    DELETE_DATA_RETENTION_CUSTOM_POLICY_FAILURE: null,
    RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS: null,
    RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS: null,
    RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SEARCH: null,
    RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SEARCH: null,
    CREATE_DATA_RETENTION_CUSTOM_POLICY_SUCCESS: null,
    UPDATE_DATA_RETENTION_CUSTOM_POLICY_SUCCESS: null,
    ADD_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SUCCESS: null,
    ADD_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SUCCESS: null,
    REMOVE_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SUCCESS: null,
    REMOVE_DATA_RETENTION_CUSTOM_POLICY_TEAMS_FAILURE: null,
    REMOVE_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SUCCESS: null,
    REMOVE_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_FAILURE: null,
});
