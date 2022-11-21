// assets
import {expect} from '@playwright/test';
import {test} from '../fixtures/env_name';
import faker from 'faker';
import { color } from '../helpers/common.helper';
var prettyjson = require('prettyjson');

// variables
const newTea = faker.random.word();
const teaPrice = faker.finance.amount();
let teaID: string;

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

        expect(response.status()).toBe(200);

        const respJson = await response.json();
    
        console.log(color.response('\nResponse: \n'), color.info(prettyjson.render(respJson)));
    });
    
    test('should be able to add a new tea', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: addTea(newTea, teaPrice)
            }
        });

        expect(response.status()).toBe(200);

        const respJson = await response.json();
        
        console.log('\nResponse: \n', color.info(prettyjson.render(respJson)));
    });
    
    test('should be able to get new tea by name', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: getTea(newTea)
            }
        });

        const respJson = await response.json();
    
        expect(response.status()).toBe(200);
        expect(JSON.stringify(respJson)).toContain(newTea);

        console.log('\nResponse: \n', color.info(prettyjson.render(respJson)));
    });
    
    test('should be able to verify that added tea is now added to the list of all teas', async ({ request }) => {
        const response = await request.post('/', {
            data: {
                query: allTeas
            }
        });

        const respJson = await response.json();
    
        const teaObj = respJson.data.teas.find(obj => {
            return obj.name === newTea;
        });

        teaID = teaObj['id'];

        expect(response.status()).toBe(200);
        expect(JSON.stringify(respJson)).toContain(newTea);

        console.log('\nResponse: \n', color.info(prettyjson.render(respJson)));
    });
    
    
    test('should be able to delete a newly added tea', async ({ request }) => {
    
        const response = await request.post('/', {
            data: {
                query: deleteTea(teaID)
            }
        });
    
        const respJson = await response.json();
    
        expect(response.status()).toBe(200);
        expect(respJson.data.deleteTea).toBe(true);

        console.log('\nResponse: \n', color.info(prettyjson.render(respJson)));
    });

});
