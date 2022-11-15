import {test, expect} from '@playwright/test';
import faker from 'faker';
var prettyjson = require('prettyjson');

//variables
const teaName = "Lunch Tea";
const newTea = faker.random.word();
const teaPrice = faker.finance.amount();
let teaID = "";

// queries
const allTeas = "{ teas { id, name} }";
const getTea = (teaName) => `{ teas(name: "${teaName}") { id, name} }`;
const addTea = (newTea, teaPrice) => `mutation { addTea(teaInput: { name: "${newTea}", description: 
"Intensive falvour", price: ${teaPrice}, 
producerId: "60b8bc31956abb0009efb4d0" }){ name price} }`;
const deleteTea = (teaID) => `mutation { deleteTea(id: "${teaID}") }`;


test.only('should be able to list all teas', async ({ request }) => {
    const response = await request.post('/', {
        data: {
            query: allTeas
        }
    })
    expect(response.ok()).toBeTruthy()


    console.log('headers', response.headers());
    console.log('headers array', response.headersArray());
    console.log('status text', response.statusText());
    console.log('text', await response.text());
    console.log('url', response.url());
})


test('should be able to get one tea by name', async ({ request }) => {
    const response = await request.post('/', {
        data: {
            query: getTea(teaName)
        }
    })
    const jsonResponse = await response.json();

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    expect(JSON.stringify(jsonResponse)).toContain(teaName)
    console.log(prettyjson.render(jsonResponse))
})


test('should be able to add a new tea', async ({ request }) => {
    const response = await request.post('/', {
        data: {
            query: addTea(newTea, teaPrice)
        }
    })
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    console.log('added a new tea: ', (await response.body()).toString());
})


test('should be able to verify that added tea is now added to the list of all teas', async ({ request }) => {
    const response = await request.post('/', {
        data: {
            query: allTeas
        }
    })
    const jsonResponse = await response.json();

    const teaObj = jsonResponse.data.teas.find(obj => {
        return obj.name === newTea;
    })
    teaID = teaObj['id']
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    expect(JSON.stringify(jsonResponse)).toContain(newTea)
})


test('should be able to delete a newly added tea', async ({ request }) => {

    const response = await request.post('/', {
        data: {
            query: deleteTea(teaID)
        }
    })

    const jsonResponse = await response.json();

    console.log('response', (await response.body()).toString());
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    expect(jsonResponse.data.deleteTea).toBeTruthy()
})
