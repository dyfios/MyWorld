class RESTModule {
    constructor() {
        Logging.Log("Initializing REST Module...");

        Logging.Log("REST Module Initialized.");
    }
}

function MW_REST_SendGetEntityInstancesRequest(restService, worldID, userID, userToken,
    onEntityInstancesReceived) {
    HTTPNetworking.Fetch(restService + "/list-entity-instances?world-id=" + worldID +
        "&user-id=" + userID + "&user-token=" + userToken, onEntityInstancesReceived);
}

function MW_REST_SendGetEntityTemplatesRequest(restService, worldID, userID, userToken,
    onEntityTemplatesReceived) {Logging.Log(restService + "/list-entity-templates?world-id=" + worldID +
        "&user-id=" + userID + "&user-token=" + userToken);
    HTTPNetworking.Fetch(restService + "/list-entity-templates?world-id=" + worldID +
        "&user-id=" + userID + "&user-token=" + userToken, onEntityTemplatesReceived);
}