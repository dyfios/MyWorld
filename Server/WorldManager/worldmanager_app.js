// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const fs = require("fs");
const vosapp = require("../VOS/vosapp");
const worldManager = require("./worldmanager");
const { argv } = require("process");
const path = require("path");

const defaultEntityOwner = "";
const defaultRegionOwner = "";
const defaultOwnerRead = 1;
const defaultOwnerWrite = 1;
const defaultOwnerUse = 1;
const defaultOwnerTake = 1;
const defaultOtherRead = 1;
const defaultOtherWrite = 0;
const defaultOtherUse = 0;
const defaultOtherTake = 0;

let worldDBContext = this;

function ConnectToVOS(context) {
    context.vosApp.ConnectToVOS("worldmanager", () => {
        context.vosApp.SubscribeToVOS("worldmanager", "vos/app/world/#", (topic, msg) => {
            if (topic == "vos/app/world/createworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createworld message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in createworld message.");
                    return;
                }

                if (deserialized["correlationid"] == null) {
                    context.vosApp.Log("Missing required field correlationid in createworld message.");
                    return;
                }

                if (deserialized["name"] == null) {
                    context.vosApp.Log("Missing required field name in createworld message.");
                    return;
                }

                if (deserialized["description"] == null) {
                    context.vosApp.Log("Missing required field description in createworld message.");
                    return;
                }

                if (deserialized["owner"] == null) {
                    context.vosApp.Log("Missing required field owner in createworld message.");
                    return;
                }

                if (deserialized["permissions"] == null) {
                    context.vosApp.Log("Missing required field permissions in createworld message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in createworld message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in createworld message.");
                    return;
                }

                worldManager.createWorld(deserialized["name"], deserialized["description"],
                    deserialized["owner"], deserialized["permissions"], deserialized["userid"],
                    deserialized["usertoken"], null, ((worldID) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "worldid": worldID
                            }));
                    }));
            }
            else if (topic == "vos/app/world/deleteworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteworld message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in deleteworld message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in deleteworld message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in deleteworld message.");
                    return;
                }

                worldManager.deleteWorld(deserialized["worldid"], deserialized["userid"],
                    deserialized["usertoken"], null, ((result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    }));
            }
            else if (topic == "vos/app/world/copyworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for copyworld message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["existingworldid"] == null) {
                    context.vosApp.Log("Missing required field existingworldid in copyworld message.");
                    return;
                }

                if (deserialized["name"] == null) {
                    context.vosApp.Log("Missing required field name in copyworld message.");
                    return;
                }

                if (deserialized["description"] == null) {
                    context.vosApp.Log("Missing required field description in copyworld message.");
                    return;
                }

                if (deserialized["owner"] == null) {
                    context.vosApp.Log("Missing required field owner in copyworld message.");
                    return;
                }

                if (deserialized["permissions"] == null) {
                    context.vosApp.Log("Missing required field permissions in copyworld message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in copyworld message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in copyworld message.");
                    return;
                }

                worldManager.copyWorld(deserialized["existingworldid"], deserialized["name"],
                    deserialized["description"], deserialized["owner"], deserialized["permissions"],
                    deserialized["userid"], deserialized["usertoken"], null, ((worldID) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "worldid": worldID
                            }));
                    }));
            }
            else if (topic == "vos/app/world/addasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for addasset message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in addasset message.");
                    return;
                }

                if (deserialized["filename"] == null) {
                    context.vosApp.Log("Missing required field filename in addasset message.");
                    return;
                }

                if (deserialized["filebuffer"] == null) {
                    context.vosApp.Log("Missing required field filebuffer in addasset message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in addasset message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in addasset message.");
                    return;
                }

                worldManager.addAsset(deserialized["worldid"], deserialized["filename"],
                    Buffer.from(deserialized["filebuffer"], "base64"), deserialized["userid"],
                    deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/removeasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for removeasset message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in removeasset message.");
                    return;
                }

                if (deserialized["filename"] == null) {
                    context.vosApp.Log("Missing required field filename in removeasset message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in removeasset message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in removeasset message.");
                    return;
                }

                worldManager.removeAsset(deserialized["worldid"], deserialized["filename"],
                    deserialized["userid"], deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/createentityinstance") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createentityinstance message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in createentityinstance message.");
                    return;
                }

                if (deserialized["entitydata"] == null) {
                    context.vosApp.Log("Missing required field entitydata in addasset message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in createentityinstance message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in createentityinstance message.");
                    return;
                }

                worldManager.createEntityInstance(deserialized["worldid"], deserialized["entitydata"],
                    deserialized["userid"], deserialized["usertoken"], null, (instanceId) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "instanceid": instanceId
                            }));
                    });
            }
            else if (topic == "vos/app/world/deleteentityinstance") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteentityinstance message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in deleteentityinstance message.");
                    return;
                }

                if (deserialized["instanceid"] == null) {
                    context.vosApp.Log("Missing required field instanceid in addasset message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in deleteentityinstance message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in deleteentityinstance message.");
                    return;
                }

                worldManager.deleteEntityInstance(deserialized["worldid"], deserialized["instanceid"],
                    deserialized["userid"], deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/listassets") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listassets message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in listassets message.");
                    return;
                }

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in listassets message.");
                    return;
                }

                worldManager.listAssets(deserialized["worldid"], (assets) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "assets": assets
                            }));
                    });
            }
            else if (topic == "vos/app/world/listentityinstances") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listentityinstances message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in listentityinstances message.");
                    return;
                }

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in listentityinstances message.");
                    return;
                }

                worldManager.listEntityInstances(deserialized["worldid"], (entityInstances) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "entityinstances": entityInstances
                            }));
                    });
            }
            else if (topic == "vos/app/world/listentitytemplates") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listentitytemplates message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in listentitytemplates message.");
                    return;
                }

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in listentitytemplates message.");
                    return;
                }

                worldManager.listEntityTemplates(deserialized["worldid"], (entityTemplates) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "entitytemplates": entityTemplates
                            }));
                    });
            }
            else if (topic == "vos/app/world/updateworldmetadata") {
                if (msg == null) {
                    context.vosApp.Log("No content received for updateworldmetadata message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in updateworldmetadata message.");
                    return;
                }

                if (deserialized["updatedata"] == null) {
                    context.vosApp.Log("Missing required field updatedata in updateworldmetadata message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in updateworldmetadata message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in updateworldmetadata message.");
                    return;
                }

                worldManager.updateWorldMetadata(deserialized["worldid"], deserialized["updatedata"],
                    deserialized["userid"], deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/createentitytemplate") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createentitytemplate message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in createentitytemplate message.");
                    return;
                }

                if (deserialized["templatedata"] == null) {
                    context.vosApp.Log("Missing required field templatedata in createentitytemplate message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in createentitytemplate message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in createentitytemplate message.");
                    return;
                }

                worldManager.createEntityTemplate(deserialized["worldid"], deserialized["templatedata"],
                    deserialized["userid"], deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/deleteentitytemplate") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteentitytemplate message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in deleteentitytemplate message.");
                    return;
                }

                if (deserialized["entityid"] == null) {
                    context.vosApp.Log("Missing required field entityid in deleteentitytemplate message.");
                    return;
                }

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in deleteentitytemplate message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in deleteentitytemplate message.");
                    return;
                }

                worldManager.deleteEntityTemplate(deserialized["worldid"], deserialized["entityid"],
                    deserialized["userid"], deserialized["usertoken"], null, (result) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "result": result
                            }));
                    });
            }
            else if (topic == "vos/app/world/listworlds") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listworlds message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["userid"] == null) {
                    context.vosApp.Log("Missing required field userid in listworlds message.");
                    return;
                }

                if (deserialized["usertoken"] == null) {
                    context.vosApp.Log("Missing required field usertoken in listworlds message.");
                    return;
                }

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in listworlds message.");
                    return;
                }

                worldManager.listWorldsForUser(deserialized["userid"], deserialized["usertoken"], null, (worlds) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "worlds": worlds
                            }));
                    });
            }
            else if (topic == "vos/app/world/getasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for getasset message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["worldid"] == null) {
                    context.vosApp.Log("Missing required field worldid in listworlds message.");
                    return;
                }

                if (deserialized["assetname"] == null) {
                    context.vosApp.Log("Missing required field assetname in listworlds message.");
                    return;
                }

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in listworlds message.");
                    return;
                }

                worldManager.getAsset(deserialized["worldid"], deserialized["assetname"], null, null,
                    null, (asset) => {
                        context.vosApp.PublishOnVOS(deserialized["replytopic"],
                            JSON.stringify({
                                "correlationid": deserialized["correlationid"],
                                "asset": asset
                            }));
                    });
            }
            else {
                context.vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

this.userTokenMap = new Map();

GetUserToken = function(context, userID) {
    if (context.userTokenMap.has(userID)) {
        return context.userTokenMap.get(userID);
    }
    else {
        return null;
    }
}

SetUserToken = function(context, userID, userToken) {
    context.userTokenMap.set(userID, userToken);
}

IsUserAuthentic = async function(context, userID, userToken, callback) {
    GetUserToken(context, userID, (correctUserToken) => {
        if (correctUserToken == null) {
            callback(false);
        }
        else {
            if (correctUserToken == userToken && userToken != null) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
    });
}

IsUserPermittedToWriteRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
            }
            else {
                var regionOwner = rows[0]["owner"];
                if (regionOwner == null) {
                    regionOwner = defaultRegionOwner;
                }
    
                var permittedToWrite = false;
    
                if (rows[0]["ownerread"] == null) {
                    rows[0]["ownerread"] = defaultOwnerRead;
                }
    
                if (rows[0]["otherread"] == null) {
                    rows[0]["otherread"] = defaultOtherRead;
                }
    
                if (regionOwner == userID) {
                    if (rows[0]["ownerwrite"] == 1) {
                        permittedToWrite = true;
                    }
                }
                else {
                    if (rows[0]["otherwrite"] == 1) {
                        permittedToWrite = true;
                    }
                }
    
                resolve(permittedToWrite);
            }
        });
    });
}

IsUserPermittedToUseRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
            }
            else {
                var regionOwner = rows[0]["owner"];
                if (regionOwner == null) {
                    regionOwner = defaultRegionOwner;
                }
    
                var permittedToUse = false;
    
                if (rows[0]["ownerread"] == null) {
                    rows[0]["ownerread"] = defaultOwnerRead;
                }
    
                if (rows[0]["otherread"] == null) {
                    rows[0]["otherread"] = defaultOtherRead;
                }
    
                if (regionOwner == userID) {
                    if (rows[0]["owneruse"] == 1) {
                        permittedToUse = true;
                    }
                }
                else {
                    if (rows[0]["otheruse"] == 1) {
                        permittedToUse = true;
                    }
                }
    
                resolve(permittedToUse);
            }
        });
    });
}

IsUserPermittedToTakeRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
            }
            else {
                var regionOwner = rows[0]["owner"];
                if (regionOwner == null) {
                    regionOwner = defaultRegionOwner;
                }
    
                var permittedToTake = false;
    
                if (rows[0]["ownerread"] == null) {
                    rows[0]["ownerread"] = defaultOwnerRead;
                }
    
                if (rows[0]["otherread"] == null) {
                    rows[0]["otherread"] = defaultOtherRead;
                }
    
                if (regionOwner == userID) {
                    if (rows[0]["ownertake"] == 1) {
                        permittedToTake = true;
                    }
                }
                else {
                    if (rows[0]["othertake"] == 1) {
                        permittedToTake = true;
                    }
                }
    
                resolve(permittedToTake);
            }
        });
    });
}

GetRegionDB = function(context, regionX, regionY, callback) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    if (context.regionDBMap.has(regionMapID)) {
        callback(context.regionDBMap.get(regionMapID));
    }
    else {
        if (RegionDatabaseExists(context, regionX, regionY)) {
            // Open and add to map.
            OpenRegionDatabase(GetRegionDBPath(context, regionX, regionY), (newDB) => {
                if (newDB != null) {
                    context.regionDBMap.set(regionMapID, newDB);
                    callback(newDB);
                }
                else {
                    console.error("GetRegionDB(): Region identified but not loaded.");
                    callback(null);
                }
            });
        }
        else {
            // TODO create region.
            callback(null);
        }
    }
}

OpenTopLevelWorldDatabase = async function(context, dbFile) {
    context.worldDB = new sqliteDatabase();
    worldDBContext.worldDB = context.worldDB;

    if (fs.existsSync(dbFile)) {
        await worldDBContext.worldDB.Open(dbFile);
    }
}

RegionDatabaseExists = function(context, regionX, regionY) {
    var regionDBPath = GetRegionDBPath(context, regionX, regionY);
    return fs.existsSync(regionDBPath);
}

OpenRegionDatabase = async function(dbFile, callback) {
    var db = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await db.Open(dbFile);
        callback(db);
    }
    else {
        callback(null);
    }
}

InitializeRegionDBMap = function(context) {
    context.regionDBMap = new Map();
}

this.vosApp = new vosapp();

this.vosApp.Log("World Manager Started");

ConnectToVOS(this);