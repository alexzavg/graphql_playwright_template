/**
 * Documentation
 * https://playwright.dev/docs/api/class-apirequestcontext
 */
import { expect, request } from "@playwright/test";
import { color } from "./common.helper";
import ENV from "../utils/env";
let prettyjson = require('prettyjson');

const URL = ENV.BASE_URL as string;


export class GraphQLService {

  async logRequest(URL:string, data?:any) {
    console.log(color.request(`\n<<<<<<<<<<<<<<<<< SENDING REQUEST <<<<<<<<<<<<<<<<<`));
    console.log(color.request(`\nRequest URL: \n`, prettyjson.render(URL)));
    console.log(color.request(`\nRequest data: \n`, prettyjson.render(data)));
  };
  
  async logResponse(status:any, data:any) {
    console.log(color.response(`\n>>>>>>>>>>>>>>>>> RECEIVING RESPONSE >>>>>>>>>>>>>>>>>`));
    console.log(color.response(`\nResponse status code: ${status}`));
    console.log(color.response('\nResponse data: \n', prettyjson.render(data)));
  };

  async getAllTeas() {
    const api = await request.newContext();
    const query = "{ teas { id, name} }";
    const data = {
      query: query
    };

    this.logRequest(URL, data);

    const response = await api.post(URL, {data});
    const status = response.status();
    const respJson = await response.json();
  
    this.logResponse(status, respJson);

    expect(status).toEqual(200);
  };

  async addNewTea(newTea:any, teaPrice:any) {
    const api = await request.newContext();
    const query = `mutation { addTea(teaInput: { name: "${newTea}", description: 
    "Intensive falvour", price: ${teaPrice}, 
    producerId: "60b8bc31956abb0009efb4d0" }){ name price} }`;
    const data = {
      query: query
    };

    this.logRequest(URL, data);

    const response = await api.post(URL, {data});
    const status = response.status();
    const respJson = await response.json();
  
    this.logResponse(status, respJson);

    expect(status).toEqual(200);
  };

  async getTeaByName(teaName:any) {
    const api = await request.newContext();
    const query = `{ teas(name: "${teaName}") { id, name} }`;
    const data = {
      query: query
    };
    
    this.logRequest(URL, data);

    const response = await api.post(URL, {data});
    const status = response.status();
    const respJson = await response.json();

    this.logResponse(status, respJson);

    expect(status).toEqual(200);
    expect(JSON.stringify(respJson)).toContain(teaName);
  };

  async getTeaId(teaName:any) {
    const api = await request.newContext();
    const query = "{ teas { id, name} }";
    const data = {
      query: query
    };
    
    this.logRequest(URL, data);

    const response = await api.post(URL, {data});
    const status = response.status();
    const respJson = await response.json();

    this.logResponse(status, respJson);

    const teaObj = respJson.data.teas.find(obj => {
      return obj.name === teaName;
    });

    let teaID = teaObj['id'];

    expect(status).toEqual(200);
    expect(JSON.stringify(respJson)).toContain(teaName);

    return teaID.toString();
  };

  async deleteTea(teaID:any) {
    const api = await request.newContext();
    const query = `mutation { deleteTea(id: "${teaID}") }`;
    const data = {
      query: query
    };
    
    this.logRequest(URL, data);

    const response = await api.post(URL, {data});
    const status = response.status();
    const respJson = await response.json();

    this.logResponse(status, respJson);

    expect(status).toEqual(200);
    expect(respJson.data.deleteTea).toBe(true);
  }
}

export async function assert(assertionName:any, expectedData:any, actualData:any) {
  let EXP = await expectedData.toString();
  let ACT = await actualData.toString();
  expect(EXP).toEqual(ACT);
  console.log(color.success(`\n+++++++ ASSERTION PASSED [${assertionName}]: response data contains [${actualData}] & equals [${expectedData}] +++++++`));
};