class WorldRenderingModule {
    constructor(startPos) {
        Logging.Log("Initializing World Rendering Module...");

        this.worldLoaded = false;
        this.worldLoadInitiated = false;
        this.currentPos = startPos;
        this.characterSynchronizer = null;
        this.currentPos = startPos;
        Context.DefineContext("WORLD_RENDERING_MODULE", this);

        Logging.Log("World Rendering Module Initialized.");
    }
}

function MW_Rend_OnEntitiesReceived(entityInfo) {Logging.Log(entityInfo);
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");

    var entities = JSON.parse(entityInfo);

    for (var entity in entities.entities) {
        var entityName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.ENTITYID." +
            entities.entities[entity].entityid);
        var variantName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.VARIANTID."
            + entities.entities[entity].entityid + "." + entities.entities[entity].variantid);
        var entityPos =
            new Vector3(entities.entities[entity].xposition, entities.entities[entity].yposition,
                entities.entities[entity].zposition);
        var entityType = configModule.entitiesConfig[entityName].variants[variantName].type;
        if (entityType == null || entityType == "") {
            entityType = "mesh";
        }
        
        MW_Entity_LoadEntity(entityType, entities.entities[entity].instanceid, null, null, entities.entities[entity].entityid,
            entities.entities[entity].variantid, configModule.entitiesConfig[entityName].variants[variantName].model,
            configModule.entitiesConfig[entityName].variants[variantName].wheels, entityPos, Vector3.zero,
            new Quaternion(entities.entities[entity].xrotation, entities.entities[entity].yrotation,
            entities.entities[entity].zrotation, entities.entities[entity].wrotation),
            configModule.entitiesConfig[entityName].variants[variantName].mass,
            configModule.entitiesConfig[entityName].variants[variantName].scripts, false, null);
    }
    worldRenderingModule.worldLoaded = true;
}