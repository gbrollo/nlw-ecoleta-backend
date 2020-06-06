import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async create (request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: 'foo',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await trx('point').insert(point);

    const point_id = insertedIds[0];

    const pointItem = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    })

    await trx('point_item').insert(pointItem);

    return response.json({
      id: point_id,
      ...point,
    });
  }
};

export default PointController;