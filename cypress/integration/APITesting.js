let json = require('../../plugins/omar-mensa-plugin/build/swaggerSpec.json');
let paths = Object.keys(json.paths);
let methods, innerJson, name, parameters, request;

describe('Automated tests for the omar-mensa methods', () => {
    paths.forEach((path) => {
        methods = Object.keys(json.paths[path]);
        methods.forEach((method) => {
            innerJson = json.paths[path][method];
            name = innerJson["operationId"];
            parameters = innerJson["parameters"];
            if (parameters[0]["in"] == "body" && parameters[0]["schema"]["default"]) {
                if (name === "imageDistance") {
                    it(`Should test 200 code for ${name} default values`, () => {
                        cy.request({
                            method: method, url: path, body: {
                                "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                                "entryId": 0,
                                "pointList": "LINESTRING(14003.649810791016 15219.103088378904, 14774.048736572266 15271.243347167967)"
                            }
                        })
                            .then((response) => {
                                expect(response.status).to.eq(200)
                            })
                    })
                    it(`Should test response header for ${name}`, () => {
                        cy.request(method, path, {
                            "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                            "entryId": 0,
                            "pointList": "LINESTRING(14003.649810791016 15219.103088378904, 14774.048736572266 15271.243347167967)"
                        })
                            .then((response) => {
                                expect(response).to.have.property("headers")
                            })
                    })
                } else if (name === "imagePointsToGround") {
                    it(`Should test 200 code for ${name} default values`, () => {
                        cy.request({
                            method: method, url: path, body: {
                                "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                                "entryId": 0,
                                "pointList": [
                                    {"x":14003.649810791016,"y":15219.103088378904},
                                    {"x":14774.048736572266,"y":15271.243347167967}
                                ],
                                "pqeIncludePositionError":false,
                                "pqeProbabilityLevel" : 0.9,
                                "pqeEllipsePointType" : "none",
                                "pqeEllipseAngularIncrement": 10
                            }
                        })
                            .then((response) => {
                                expect(response.status).to.eq(200)
                            })
                    })
                    it(`Should test response header for ${name}`, () => {
                        cy.request(method, path, {
                            "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                            "entryId": 0,
                            "pointList": [
                                {"x":14003.649810791016,"y":15219.103088378904},
                                {"x":14774.048736572266,"y":15271.243347167967}
                            ],
                            "pqeIncludePositionError":false,
                            "pqeProbabilityLevel" : 0.9,
                            "pqeEllipsePointType" : "none",
                            "pqeEllipseAngularIncrement": 10
                        })
                            .then((response) => {
                                expect(response).to.have.property("headers")
                            })
                    })
                } else if (name === "groundToImagePoints") {
                    it(`Should test 200 code for ${name} default values`, () => {
                        cy.request({
                            method: method, url: path, body: {
                                "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                                "entryId": 0,
                                "pointList": [
                                    {"lat":14003.649810791016,"lon":15219.103088378904,hgt:0.0},
                                    {"lat":14774.048736572266,"lon":15271.243347167967}]
                            }
                        })
                            .then((response) => {
                                expect(response.status).to.eq(200)
                            })
                    })
                    it(`Should test response header for ${name}`, () => {
                        cy.request(method, path, {
                            "filename": "/data/geoint/strips/056599362030_01/056599362030_01_P002_MUL/17APR19054130-M1BS-056599362030_01_P002.NTF",
                            "entryId": 0,
                            "pointList": [
                                {"lat":14003.649810791016,"lon":15219.103088378904,hgt:0.0},
                                {"lat":14774.048736572266,"lon":15271.243347167967}]
                        })
                            .then((response) => {
                                expect(response).to.have.property("headers")
                            })
                    })
                } else {
                    it(`Should test 200 code for ${name} default values`, () => {
                        cy.request({
                            method: method, url: path, body: JSON.parse(parameters[0]["schema"]["default"])
                        })
                            .then((response) => {
                                expect(response.status).to.eq(200)
                            })
                    })
                    it(`Should test response header for ${name}`, () => {
                        cy.request(method, path, JSON.parse(parameters[0]["schema"]["default"]))
                            .then((response) => {
                                expect(response).to.have.property("headers")
                            })
                    })
                }
            }
        })
    })
})