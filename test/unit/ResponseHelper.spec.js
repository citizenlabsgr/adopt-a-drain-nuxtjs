// const ResponseHelper = require("../../components/mixins/ResponseHelper");
import { ResponseHelper } from "../../components/mixins/ResponseHelper";
const respGet = {
    config:{
        "method": "GET"
    },
    data: {
        "msg": "OK",
        "selection": [
            {
                "active": true,
                "created": "A",
                "form": {
                    "displayname":"B",
                    "scope":"C",
                    "username":"D"
                },
                "owner": "E",
                "pk": "F",
                "sk":"G",
                "tk": "H",
                "updated": "I"
            },
            {
                "active": false,
                "created": "J",
                "form": {
                    "displayname":"K",
                    "scope":"L",
                    "username":"M"
                },
                "owner": "N",
                "pk": "O",
                "sk":"P",
                "tk": "Q",
                "updated": "R"
            }

        ],
        "status": "200"
    },
    headers: {},
    request: {},
    status: 200,
    statusText: "OK"
}

const GetRRMO = {
    "request": {},
    "response": {
        "data": [
            {
                "active": true,
                "created": "A",
                "form": {
                    "displayname":"B",
                    "scope":"C",
                    "username":"D"
                },
                "owner": "E",
                "pk": "F",
                "sk":"G",
                "tk": "H",
                "updated": "I"
            },
            {
                "active": true,
                "created": "A1",
                "form": {
                    "displayname":"B1",
                    "scope":"C1",
                    "username":"D1"
                },
                "owner": "E1",
                "pk": "F1",
                "sk":"G1",
                "tk": "H1",
                "updated": "I1"
            }
        ],
    },
    "mapping": {
        "displayname": "form.displayname",
        "username": "form.username"
    },
    "output": {
        "displayname": "",
        "username": ""
    }
}
describe("ResponseHelper", () => {
  const responseHelper = new ResponseHelper(respGet);


  test("ResponseHelper.method", () => {
    expect(typeof responseHelper.method()).toBe("string");
  });

  // test("ResponseHelper.transfer", () => {
  //   expect(typeof responseHelper.transfer(GetRRMO.mapping,GetRRMO.output)).toBe("object");
  // });

  test("ResponseHelper.getValue", () => {

    let keyStr = 'scope';
    let vobj = {
        "displayname":"B",
        "scope":"C",
        "username":"D"
    }
    expect(responseHelper.getValue("scope", vobj)).toEqual("C");
    expect(responseHelper.getValue("config.method", respGet)).toEqual("GET");
    expect(responseHelper.getValue("data.selection.0.created", respGet)).toEqual("A");
    expect(responseHelper.getValue("data.selection.1.created", respGet)).toEqual("J");


  });

  test("ResponseHelper.transfer A List to Dictionary", () => {

    let output = [{
            "displayname":"",
            "scope":"",
            "username":""
        }]
    ;

    let mapping = {
        "displayname": "form.displayname",
        "username": "form.username"
    }

    let keyStr = 'scope';

    let exp = [
      {
        "displayname":"B",
        "row": 0,
        "username":"D"
      },
      {
        "displayname":"K",
        "row": 1,
        "username":"M"
      }
    ];
    responseHelper.resetOutput(output);
    responseHelper.transfer(mapping, output);
    expect(output).toEqual(exp);

  });

  test("ResponseHelper.transfer B List to List", () => {
    // out list
    // scope is not preserved, because not in mapping
    let output = [
            {
                    "displayname":"",
                    "scope":"",
                    "username":""
            }
        ]
    ;

    let mapping = {
        "displayname": "form.displayname",
        "username": "form.username"
    }
    let keyStr = 'scope';
    let exp = [
        {
            "displayname":"B",
          "row": 0,
            "username":"D"
        },
        {
            "displayname":"K",
          "row": 1,
            "username":"M"
        }
    ];
    responseHelper.resetOutput(output);
    responseHelper.transfer(mapping, output)

    // console.log('transfer ', output);
    // console.log('         ', exp);
    expect(output).toEqual(exp);

  });


});
