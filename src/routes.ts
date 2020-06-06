import express from 'express';
import knex from './database/connection';
import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = express.Router();

// Controllers
const pointController = new PointController();
const itemController = new ItemController();

routes.get('/items', itemController.index);

routes.post('/point', pointController.create);

export default routes;