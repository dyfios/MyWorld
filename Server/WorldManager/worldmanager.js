// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const fs = require("fs-extra");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const BASE_PATH = "./worlds/";

// Helper function to check authorization
function checkAuthorization(userId, userToken, authCallback, action) {
    if (authCallback && !authCallback(userId, userToken)) {
        throw new Error(`Unauthorized: User lacks permission to perform ${action}.`);
    }
}

// 🏗️ Create a new world
async function createWorld(name, description, owner, permissions, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "create a world");

        const worldId = uuidv4();
        const worldPath = path.join(BASE_PATH, worldId);

        await fs.ensureDir(worldPath);
        await fs.ensureDir(path.join(worldPath, "assets"));

        const dbPath = path.join(worldPath, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`
                    CREATE TABLE IF NOT EXISTS world_metadata (
                        id TEXT PRIMARY KEY, name TEXT, description TEXT, owner TEXT, permissions TEXT
                    )
                `);
                db.run(`
                    INSERT INTO world_metadata (id, name, description, owner, permissions)
                    VALUES (?, ?, ?, ?, ?)
                `, [worldId, name, description, owner, permissions]);
            });
            db.run(`
            CREATE TABLE IF NOT EXISTS entity_instances (
                instanceid TEXT PRIMARY KEY, instancetag TEXT,
                entity_id TEXT, variant_id TEXT, entity_parent TEXT,
                pos_x REAL, pos_y REAL, pos_z REAL,
                rot_x REAL, rot_y REAL, rot_z REAL, rot_w REAL,
                scl_x REAL, scl_y REAL, scl_z REAL,
                state TEXT, owner TEXT,
                owner_read INTEGER, owner_write INTEGER, owner_use INTEGER, owner_take INTEGER,
                other_read INTEGER, other_write INTEGER, other_use INTEGER, other_take INTEGER
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS entity_templates (
                entity_id TEXT PRIMARY KEY, entity_tag TEXT,
                variant_id TEXT, variant_tag TEXT,
                type TEXT, assets TEXT, scripts TEXT
            )
        `);
        console.log(`✅ World ${worldId} created successfully.`);
        db.close();
        onComplete(worldId);
        });
    } catch (error) {
        console.error("❌ Error creating world:", error);
        onComplete("");
    }
}

// 🗑️ Delete a world
async function deleteWorld(worldId, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "delete a world");

        const worldPath = path.join(BASE_PATH, worldId);
        if (!(await fs.pathExists(worldPath))) throw new Error(`World ${worldId} does not exist.`);

        await fs.remove(worldPath);
        console.log(`✅ World ${worldId} deleted successfully.`);
        onComplete(true);
    } catch (error) {
        console.error(`❌ Error deleting world ${worldId}:`, error);
        onComplete(false);
    }
}

// 🗂️ Copy an existing world
async function copyWorld(existingWorldId, name, description, owner, permissions, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "copy a world");

        const newWorldId = uuidv4();
        const existingWorldPath = path.join(BASE_PATH, existingWorldId);
        const newWorldPath = path.join(BASE_PATH, newWorldId);

        if (!(await fs.pathExists(existingWorldPath))) {
            throw new Error(`World ${existingWorldId} does not exist.`);
        }

        await fs.copy(existingWorldPath, newWorldPath);

        const dbPath = path.join(newWorldPath, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.run("DELETE FROM world_metadata");
            db.run(`
                INSERT INTO world_metadata (id, name, description, owner, permissions)
                VALUES (?, ?, ?, ?, ?)
            `, [newWorldId, name, description, owner, permissions]);
            db.close();
            console.log(`✅ World ${existingWorldId} copied successfully as ${newWorldId}.`);
            onComplete(newWorldId);
        });
    } catch (error) {
        console.error("❌ Error copying world:", error);
        onComplete("");
    }
}

// 📂 Asset Management
async function addAsset(worldId, filename, fileBuffer, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "add an asset");

        const worldPath = path.join(BASE_PATH, worldId);
        const assetPath = path.join(worldPath, "assets", filename);

        if (!(await fs.pathExists(worldPath))) {
            throw new Error(`World ${worldId} does not exist.`);
        }

        if (await fs.pathExists(assetPath)) {
            throw new Error(`Asset ${filename} already exists in world ${worldId}.`);
        }

        await fs.writeFile(assetPath, fileBuffer);
        console.log(`✅ Asset ${filename} added to world ${worldId}.`);
        onComplete(true);
    } catch (error) {
        console.error(`❌ Error adding asset ${filename}:`, error);
        onComplete(false);
    }
}

async function removeAsset(worldId, filename, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "remove an asset");

        const assetPath = path.join(BASE_PATH, worldId, "assets", filename);

        if (!(await fs.pathExists(assetPath))) {
            throw new Error(`Asset ${filename} does not exist.`);
        }

        await fs.remove(assetPath);
        console.log(`✅ Asset ${filename} removed from world ${worldId}.`);
        onComplete(true);
    } catch (error) {
        console.error(`❌ Error removing asset ${filename}:`, error);
        onComplete(false);
    }
}

async function getAsset(worldId, filename, userId, userToken, authCallback, onComplete) {
    try {
        //checkAuthorization(userId, userToken, authCallback, "get an asset");

        const worldPath = path.join(BASE_PATH, worldId);
        const assetPath = path.join(worldPath, "assets", filename);

        if (!(await fs.pathExists(worldPath))) {
            throw new Error(`World ${worldId} does not exist.`);
        }

        if (!await fs.pathExists(assetPath)) {
            throw new Error(`Asset ${filename} does not exist in world ${worldId}.`);
        }

        const asset = await fs.readFile(assetPath);
        onComplete(asset);
    } catch (error) {
        console.error(`❌ Error adding asset ${filename}:`, error);
        onComplete(null);
    }
}

// 📋 Entity Instance Management
async function createEntityInstance(worldId, entityData, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "create an entity instance");

        const newInstanceId = uuidv4();
        entityData["instanceid"] = newInstanceId;
        const columns = ['instanceid', 'instancetag', 'entity_id', 'variant_id', 'parent_id',
            'pos_x', 'pos_y', 'pos_z', 'rot_x', 'rot_y', 'rot_z', 'rot_w',
            'scl_x', 'scl_y', 'scl_z', 'state', 'owner',
            'owner_read', 'owner_write', 'owner_use', 'owner_take',
            'other_read', 'other_write', 'other_use', 'other_take'];
        const values = columns.map((key) => entityData[key]);
        const dbPath = path.join(BASE_PATH, worldId, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO entity_instances VALUES (${Object.keys(values).map(() => "?").join(", ")})
                `, Object.values(values), (err) => (err ? reject(err) : resolve()));
            db.close();
            console.log(`✅ Entity instance created in world ${worldId}.`);
            onComplete(newInstanceId);
        });
    } catch (error) {
        console.error("❌ Error creating entity instance:", error);
        onComplete(null);
    }
}

async function deleteEntityInstance(worldId, instanceId, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "delete an entity instance");

        const dbPath = path.join(BASE_PATH, worldId, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.run("DELETE FROM entity_instances WHERE instanceid = ?", [instanceId], (err) => (err ? reject(err) : resolve()));
            db.close();
            console.log(`✅ Entity instance ${instanceId} deleted from world ${worldId}.`);
            onComplete(true);
        });
    } catch (error) {
        console.error(`❌ Error deleting entity instance:`, error);
        onComplete(false);
    }
}

async function listAssets(worldId, onResult) {
    try {
        const assetDir = path.join(BASE_PATH, worldId, "assets");

        if (!(await fs.pathExists(assetDir))) {
            throw new Error(`World ${worldId} does not exist or has no assets.`);
        }

        const files = await fs.readdir(assetDir);
        onResult(files);
    } catch (error) {
        console.error(`❌ Error listing assets in world ${worldId}:`, error);
        onResult(null);
    }
}

// 📋 Entity Management (Instances & Templates)
async function listEntityInstances(worldId, onResult) {
    const entityInstances = await queryDatabase(worldId, "SELECT * FROM entity_instances");
    onResult(entityInstances);
}

async function listEntityTemplates(worldId, onResult) {
    const entityTemplates = await queryDatabase(worldId, "SELECT * FROM entity_templates");
    onResult(entityTemplates);
}

// 🌍 List worlds for a given user
async function listWorldsForUser(userId, userToken, authCallback, onResult) {
    try {
        checkAuthorization(userId, userToken, authCallback, "list worlds");

        if (!(await fs.pathExists(BASE_PATH))) {
            console.log(`ℹ️ Worlds directory does not exist: ${BASE_PATH}`);
            onResult([]);
            return;
        }

        const worldFolders = await fs.readdir(BASE_PATH);
        const worlds = [];

        for (const worldId of worldFolders) {
            const worldPath = path.join(BASE_PATH, worldId);
            const dbPath = path.join(worldPath, "world.db");

            // Skip if not a valid world directory
            if (!(await fs.pathExists(dbPath))) continue;

            try {
                const metadata = await queryDatabase(worldId, "SELECT * FROM world_metadata LIMIT 1");
                if (metadata && metadata.length > 0) {
                    const worldData = metadata[0];
                    // Include worlds where the user is the owner
                    if (worldData.owner === userId) {
                        worlds.push({
                            id: worldData.id,
                            name: worldData.name,
                            description: worldData.description,
                            owner: worldData.owner,
                            permissions: worldData.permissions
                        });
                    }
                }
            } catch (dbError) {
                console.error(`❌ Error reading metadata for world ${worldId}:`, dbError);
                // Continue processing other worlds
            }
        }

        console.log(`✅ Found ${worlds.length} worlds for user ${userId}`);
        onResult(worlds);
    } catch (error) {
        console.error(`❌ Error listing worlds for user ${userId}:`, error);
        onResult([]);
    }
}

async function updateWorldMetadata(worldId, updateData, userId, userToken, authCallback, onResult) {
    checkAuthorization(userId, userToken, authCallback, "update world metadata");
    await updateDatabase(worldId, "world_metadata", updateData, "id");
    onResult(true);
}

// Helper functions for database operations
async function queryDatabase(worldId, query) {
    const dbPath = path.join(BASE_PATH, worldId, "world.db");
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.all(query, [], (err, rows) => {
            db.close();
            err ? reject(err) : resolve(rows);
        });
    });
}

async function updateDatabase(worldId, table, updateData, primaryKey) {
    const dbPath = path.join(BASE_PATH, worldId, "world.db");
    const validFields = Object.keys(updateData).filter(field => field !== primaryKey);
    if (validFields.length === 0) throw new Error("No valid fields provided for update.");

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(
            `UPDATE ${table} SET ${validFields.map(field => `${field} = ?`).join(", ")} WHERE ${primaryKey} = ?`,
            [...Object.values(updateData), worldId],
            (err) => {
                db.close();
                err ? reject(err) : resolve();
            }
        );
    });
}

async function createEntityTemplate(worldId, templateData, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "create an entity template");

        const columns = ['entity_id', 'entity_tag', 'variant_id', 'variant_tag', 'type',
            'assets', 'scripts'];
        const values = columns.map((key) => templateData[key]);

        const dbPath = path.join(BASE_PATH, worldId, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO entity_templates VALUES (${Object.keys(values).map(() => "?").join(", ")})
            `, Object.values(values), (err) => (err ? reject(err) : resolve()));
            db.close();
            console.log(`✅ Entity template created in world ${worldId}.`);
            onComplete(true);
        });
    } catch (error) {
        console.error("❌ Error creating entity template:", error);
        onComplete(false);
    }
}

async function deleteEntityTemplate(worldId, entityId, userId, userToken, authCallback, onComplete) {
    try {
        checkAuthorization(userId, userToken, authCallback, "delete an entity template");

        const dbPath = path.join(BASE_PATH, worldId, "world.db");
        const db = new sqlite3.Database(dbPath);

        await new Promise((resolve, reject) => {
            db.run("DELETE FROM entity_templates WHERE entity_id = ?", [entityId], (err) => (err ? reject(err) : resolve()));
            db.close();
            console.log(`✅ Entity template ${entityId} deleted from world ${worldId}.`);
            onComplete(true);
        });
    } catch (error) {
        console.error(`❌ Error deleting entity template:`, error);
        onComplete(false);
    }
}

module.exports = {
    createWorld,
    deleteWorld,
    copyWorld,
    addAsset,
    removeAsset,
    getAsset,
    createEntityInstance,
    deleteEntityInstance,
    listAssets,
    listEntityInstances,
    listEntityTemplates,
    listWorldsForUser,
    updateWorldMetadata,
    createEntityTemplate,
    deleteEntityTemplate
};