// assets
import {expect} from '@playwright/test';
import {test} from '../fixtures/env_name';
import faker from 'faker';
import { color } from '../helpers/common.helper';
var prettyjson = require('prettyjson');

// variables
const newTea = faker.random.word();
const teaPrice = faker.finance.amount();
let teaID = "";

// graphql queries
const allTeas = "{ teas { id, name} }";
const addTea = (newTea, teaPrice) => `mutation { addTea(teaInput: { name: "${newTea}", description: 
"Intensive falvour", price: ${teaPrice}, 
producerId: "60b8bc31956abb0009efb4d0" }){ name price} }`;
const getTea = (teaName) => `{ teas(name: "${teaName}") { id, name} }`;
const deleteTea = (teaID) => `mutation { deleteTea(id: "${teaID}") }`;


test.describe.serial('GRAPHQL DEMO', async () => {

    test('should be able to list all teas', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: allTeas
            }
        });

        expect(response.ok()).toBeTruthy();

        let respText = await response.text();
        const respJson = JSON.parse(respText);
    
        console.log(color.response('\nHeaders\n'), color.info(prettyjson.render(response.headers())));
        console.log(color.response('\nStatus text\n'), color.info(prettyjson.render(response.statusText())));
        console.log(color.response('\nText\n'), color.info(prettyjson.render(respJson)));
        console.log(color.response('\nUrl\n'), color.info(prettyjson.render(response.url())));
    });
    
    test.only('should be able to add a new tea', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: addTea(newTea, teaPrice)
            }
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        console.log('added a new tea: ', (await response.body()).toString());
    });
    
    test('should be able to get new tea by name', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: getTea(newTea)
            }
        });

        const jsonResponse = await response.json();
    
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(JSON.stringify(jsonResponse)).toContain(newTea);

        console.log(prettyjson.render(jsonResponse));
    });
    
    test('should be able to verify that added tea is now added to the list of all teas', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: allTeas
            }
        });

        const jsonResponse = await response.json();
    
        const teaObj = jsonResponse.data.teas.find(obj => {
            return obj.name === newTea;
        });

        teaID = teaObj['id'];

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(JSON.stringify(jsonResponse)).toContain(newTea);
    });
    
    
    test('should be able to delete a newly added tea', async ({ request }) => {
    
        const response = await request.post('/', {
            data: {
                query: deleteTea(teaID)
            }
        });
    
        const jsonResponse = await response.json();
    
        console.log('response', (await response.body()).toString());

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(jsonResponse.data.deleteTea).toBeTruthy();
    });

});
