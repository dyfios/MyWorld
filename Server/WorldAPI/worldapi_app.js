// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const vosapp = require("../VOS/vosapp");
const https = require('https');
const fs = require('fs');

const app = express();
const upload = multer();

const httpsServer = https.createServer({
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
}, app);

const pendingResponses = new Map();
const { v4: uuidv4 } = require("uuid");

app.use(express.json({ limit: "1gb" }));

// Enable CORS for all routes and origins
app.use(cors());

function ConnectToVOS(context) {
    context.vosApp.ConnectToVOS("worldapi", () => {
        context.vosApp.SubscribeToVOS("worldapi", "vos/app/wapi/#", (topic, msg) => {
            if (topic == "vos/app/wapi/res/createworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createworld response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for createworld response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["worldid"] == null || deserialized["worldid"] == "") {
                    // Check if there's an error message (e.g., world limit exceeded)
                    if (deserialized["error"]) {
                        res.status(403).json({ error: deserialized["error"] });
                        context.vosApp.Log("World creation denied: " + deserialized["error"]);
                    } else {
                        res.status(500).json(deserialized);
                        context.vosApp.Log("Missing required field worldid in createworld response.");
                    }
                    return;
                }

                res.status(200).json({worldid: deserialized["worldid"]});
            }
            else if (topic == "vos/app/wapi/res/deleteworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteworld response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for deleteworld response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in deleteworld response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/copyworld") {
                if (msg == null) {
                    context.vosApp.Log("No content received for copyworld response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for copyworld response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["worldid"] == null || deserialized["worldid"] == "") {
                    // Check if there's an error message (e.g., world limit exceeded)
                    if (deserialized["error"]) {
                        res.status(403).json({ error: deserialized["error"] });
                        context.vosApp.Log("World copy denied: " + deserialized["error"]);
                    } else {
                        res.status(500).json(deserialized);
                        context.vosApp.Log("Missing required field worldid in copyworld response.");
                    }
                    return;
                }

                res.status(200).json({worldid: deserialized["worldid"]});
            }
            else if (topic == "vos/app/wapi/res/addasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for addasset response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for addasset response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in addasset response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/removeasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for removeasset response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for removeasset response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in removeasset response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/createentityinstance") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createentityinstance response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for createentityinstance response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["instanceid"] == null || deserialized["instanceid"] == "") {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field worldid in createentityinstance response.");
                    return;
                }

                res.status(200).json({instanceid: deserialized["instanceid"]});
            }
            else if (topic == "vos/app/wapi/res/deleteentityinstance") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteentityinstance response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for deleteentityinstance response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in deleteentityinstance response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/listassets") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listassets response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for listassets response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["assets"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field assets in listassets response.");
                    return;
                }

                res.status(200).json({assets: deserialized["assets"]});
            }
            else if (topic == "vos/app/wapi/res/listentityinstances") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listentityinstances response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for listentityinstances response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["entityinstances"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field entityinstances in listentityinstances response.");
                    return;
                }

                res.status(200).json({assets: deserialized["entityinstances"]});
            }
            else if (topic == "vos/app/wapi/res/listentitytemplates") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listentitytemplates response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for listentitytemplates response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["entitytemplates"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field entitytemplates in listentitytemplates response.");
                    return;
                }

                res.status(200).json({templates: deserialized["entitytemplates"]});
            }
            else if (topic == "vos/app/wapi/res/updateworldmetadata") {
                if (msg == null) {
                    context.vosApp.Log("No content received for updateworldmetadata response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for updateworldmetadata response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in updateworldmetadata response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/listworlds") {
                if (msg == null) {
                    context.vosApp.Log("No content received for listworlds response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for listworlds response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might've timed out or been handled already

                if (deserialized["worlds"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field worlds in listworlds response.");
                    return;
                }

                res.status(200).json({worlds: deserialized["worlds"]});
            }
            else if (topic == "vos/app/wapi/res/createentitytemplate") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createentitytemplate response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for createentitytemplate response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in createentitytemplate response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/deleteentitytemplate") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deleteentitytemplate response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for deleteentitytemplate response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["result"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field result in deleteentitytemplate response.");
                    return;
                }

                res.status(200).json({result: deserialized["result"]});
            }
            else if (topic == "vos/app/wapi/res/getasset") {
                if (msg == null) {
                    context.vosApp.Log("No content received for getasset response.");
                    return;
                }

                deserialized = JSON.parse(msg);

                correlationId = deserialized["correlationid"];

                if (correlationId == null) {
                    context.vosApp.Log("No correlationID received for getasset response.");
                    return;
                }

                const res = pendingResponses.get(correlationId);
                pendingResponses.delete(correlationId);
                if (!res) return; // might’ve timed out or been handled already

                if (deserialized["asset"] == null) {
                    res.status(500).json(deserialized);
                    context.vosApp.Log("Missing required field asset in getasset response.");
                    return;
                }

                res.status(200).send(Buffer.from(deserialized["asset"]));
            }
            else {
                context.vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

// Helper: respond with 400 if missing or invalid
function validateParams(req, res, requiredFields) {
    for (const field of requiredFields) {
        const value = field.includes(".") ? field.split(".").reduce((o, k) => o?.[k], req) : req.body[field];
        if (typeof value !== "string" || value.trim() === "") {
            return res.status(400).json({ error: `Missing or invalid '${field}'` });
        }
    }
    return null;
}

// ----------- ROUTES -----------

// POST /create-world
app.post("/create-world", (req, res) => {
    if (validateParams(req, res, ["name", "description", "owner",
        "permissions", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/createworld", JSON.stringify({
        "replytopic": "vos/app/wapi/res/createworld",
        "correlationid": correlationId,
        "name": req.body["name"],
        "description": req.body["description"],
        "owner": req.body["owner"],
        "permissions": req.body["permissions"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// DELETE /delete-world
app.delete("/delete-world", (req, res) => {
    if (validateParams(req, res, ["world-id", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/deleteworld", JSON.stringify({
        "replytopic": "vos/app/wapi/res/deleteworld",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// POST /copy-world
app.post("/copy-world", (req, res) => {
    if (validateParams(req, res, ["existing-world-id", "name",
        "description", "owner", "permissions", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/copyworld", JSON.stringify({
        "replytopic": "vos/app/wapi/res/copyworld",
        "correlationid": correlationId,
        "existingworldid": req.body["existing-world-id"],
        "name": req.body["name"],
        "description": req.body["description"],
        "owner": req.body["owner"],
        "permissions": req.body["permissions"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// POST /add-asset (with file upload)
app.post("/add-asset", upload.single("file-buffer"), (req, res) => {
    if (validateParams(req, res, ["world-id", "file-name", "user-id", "user-token"])) return;
    if (!req.body["file-buffer"]) {
        return res.status(400).json({ error: "Missing or invalid 'file-buffer'" });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/addasset", JSON.stringify({
        "replytopic": "vos/app/wapi/res/addasset",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "filename": req.body["file-name"],
        "filebuffer": req.body["file-buffer"].toString("base64"),
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// DELETE /remove-asset
app.delete("/remove-asset", (req, res) => {
    if (validateParams(req, res, ["world-id", "file-name", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/removeasset", JSON.stringify({
        "replytopic": "vos/app/wapi/res/removeasset",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "filename": req.body["file-name"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// POST /create-entity-instance
app.post("/create-entity-instance", (req, res) => {
    if (validateParams(req, res, ["world-id", "user-id", "user-token"])) return;
    if (req.body["entity-data"] == null) {
        return res.status(400).json({ error: `Missing or invalid 'entity-data'` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/createentityinstance", JSON.stringify({
        "replytopic": "vos/app/wapi/res/createentityinstance",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "entitydata": req.body["entity-data"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// DELETE /delete-entity-instance
app.delete("/delete-entity-instance", (req, res) => {
    if (validateParams(req, res, ["world-id", "instance-id", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/deleteentityinstance", JSON.stringify({
        "replytopic": "vos/app/wapi/res/deleteentityinstance",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "instanceid": req.body["instance-id"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// GET /list-assets
app.get("/list-assets", (req, res) => {
    if (validateParams(req, res, ["world-id", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/listassets", JSON.stringify({
        "replytopic": "vos/app/wapi/res/listassets",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// GET /list-entity-instances
app.get("/list-entity-instances", (req, res) => {
    if (req.query == null || req.query["world-id"] == null || req.query["world-id"] == "" ||
        req.query["user-id"] == null || req.query["user-id"] == "" ||
        req.query["user-token"] == null || req.query["user-token"] == "") {
        return res.status(400).json({ error: `Missing or invalid params` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/listentityinstances", JSON.stringify({
        "replytopic": "vos/app/wapi/res/listentityinstances",
        "correlationid": correlationId,
        "worldid": req.query["world-id"],
        "userid": req.query["user-id"],
        "usertoken": req.query["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// GET /list-entity-templates
app.get("/list-entity-templates", (req, res) => {
    if (req.query == null || req.query["world-id"] == null || req.query["world-id"] == "" ||
        req.query["user-id"] == null || req.query["user-id"] == "" ||
        req.query["user-token"] == null || req.query["user-token"] == "") {
        return res.status(400).json({ error: `Missing or invalid params` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/listentitytemplates", JSON.stringify({
        "replytopic": "vos/app/wapi/res/listentitytemplates",
        "correlationid": correlationId,
        "worldid": req.query["world-id"],
        "userid": req.query["user-id"],
        "usertoken": req.query["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// GET /list-worlds
app.get("/list-worlds", (req, res) => {
    if (req.query == null || req.query["user-id"] == null || req.query["user-id"] == "" ||
        req.query["user-token"] == null || req.query["user-token"] == "") {
        return res.status(400).json({ error: `Missing or invalid params` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/listworlds", JSON.stringify({
        "replytopic": "vos/app/wapi/res/listworlds",
        "correlationid": correlationId,
        "userid": req.query["user-id"],
        "usertoken": req.query["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// PATCH /update-world-metadata
app.patch("/update-world-metadata", (req, res) => {
    if (validateParams(req, res, ["world-id", "user-id", "user-token"])) return;
    if (req.body["update-data"] == null) {
        return res.status(400).json({ error: `Missing or invalid 'update-data'` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/updateworldmetadata", JSON.stringify({
        "replytopic": "vos/app/wapi/res/updateworldmetadata",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "updatedata": req.body["update-data"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// POST /create-entity-template
app.post("/create-entity-template", (req, res) => {
    if (validateParams(req, res, ["world-id", "user-id", "user-token"])) return;
    if (req.body["template-data"] == null) {
        return res.status(400).json({ error: `Missing or invalid 'template-data'` });
    }
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    const templateData = req.body["template-data"];
    templateData["entity_id"] = uuidv4();
    templateData["variant_id"] = uuidv4();
    this.vosApp.PublishOnVOS("vos/app/world/createentitytemplate", JSON.stringify({
        "replytopic": "vos/app/wapi/res/createentitytemplate",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "templatedata": templateData,
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

// DELETE /delete-entity-template
app.delete("/delete-entity-template", (req, res) => {
    if (validateParams(req, res, ["world-id", "entity-id", "user-id", "user-token"])) return;
    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/deleteentitytemplate", JSON.stringify({
        "replytopic": "vos/app/wapi/res/deleteentitytemplate",
        "correlationid": correlationId,
        "worldid": req.body["world-id"],
        "entityid": req.body["entity-id"],
        "userid": req.body["user-id"],
        "usertoken": req.body["user-token"]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

app.get("/get-asset/*param0", (req, res) => {
    const assetPath = req.params.param0;

    if (assetPath.length != 2) {
        return res.status(400).json({ error: "Invalid request." });
    }

    const correlationId = uuidv4();
    pendingResponses.set(correlationId, res);
    this.vosApp.PublishOnVOS("vos/app/world/getasset", JSON.stringify({
        "replytopic": "vos/app/wapi/res/getasset",
        "correlationid": correlationId,
        "worldid": assetPath[0],
        "assetname": assetPath[1]
    }));
    setTimeout(() => {
        if (pendingResponses.has(correlationId)) {
            pendingResponses.get(correlationId).status(504).json({ error: "Timeout waiting for response" });
            pendingResponses.delete(correlationId);
        }
    }, 10000); // 10s timeout
});

this.vosApp = new vosapp();

this.vosApp.Log("World API Started");

ConnectToVOS(this);

// Start server
const PORT = process.env.PORT || 4000;
httpsServer.listen(PORT, () => {
    console.log(`🚀 Web Wide Worlds API listening on port ${PORT}`);
});