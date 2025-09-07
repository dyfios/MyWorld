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
    onEntityTemplatesReceived) {
    HTTPNetworking.Fetch(restService + "/list-entity-templates?world-id=" + worldID +
        "&user-id=" + userID + "&user-token=" + userToken, onEntityTemplatesReceived);
}

function MW_REST_SendAddEntityInstanceRequest(restService, worldID, userID, userToken,
    instanceID, instanceTag, entityID, variantID, parentID, pos, rot, scl, state, owner,
    ownerRead, ownerWrite, ownerUse, ownerTake, otherRead, otherWrite, otherUse, otherTake,
    onEntityInstanceCreated) {
    HTTPNetworking.Post(restService + "/create-entity-instance", "{\"world-id\":\"" + worldID +
        "\",\"user-id\":\"" + userID + "\",\"user-token\":\"" + userToken + "\",\"entity-data\":{\"instanceid\":\"" +
        instanceID + "\",\"instancetag\":\"" + instanceTag + "\",\"entity_id\":\"" + entityID + "\",\"variant_id\":\"" +
        variantID + "\",\"parent_id\":\"" + parentID + "\",\"pos_x\":\"" + pos.x + "\",\"pos_y\":\"" + pos.y +
        "\",\"pos_z\":\"" + pos.z + "\",\"rot_x\":\"" + rot.x + "\",\"rot_y\":\"" + rot.y + "\",\"rot_z\":\"" + rot.z +
        "\",\"rot_w\":\"" + rot.w + "\",\"scl_x\":\"" + scl.x + "\",\"scl_y\":\"" + scl.y + "\",\"scl_z\":\"" + scl.z +
        "\",\"state\":\"" + state + "\",\"owner\":\"" + owner + "\",\"owner_read\":\"" + ownerRead + "\",\"owner_write\":\"" +
        ownerWrite + "\",\"owner_use\":\"" + ownerUse + "\",\"owner_take\":\"" + ownerTake + "\",\"other_read\":\"" + otherRead +
        "\",\"other_write\":\"" + otherWrite + "\",\"other_use\":\"" + otherUse + "\",\"other_take\":\"" + otherTake + "\"}}",
        "application/json", onEntityInstanceCreated);
}