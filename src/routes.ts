import express from 'express';
import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = express.Router();

// Controllers
const pointController = new PointController();
const itemController = new ItemController();

routes.get('/items', itemController.index);

routes.post('/point', pointController.create);
routes.get('/points', pointController.index);
routes.get('/point/:id', pointController.show);

export default routes;