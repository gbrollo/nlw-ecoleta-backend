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
      image: 'https://images.unsplash.com/photo-1591183843088-8ea6a3470843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
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

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }

  async show (request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('point').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('item')
      .join('point_item', 'item.id', '=', 'point_item.item_id')
      .where('point_item.point_id', id)
      .select('item.title');

    return response.json({ point, items });
  }

  async index (request: Request, response: Response) {
    const {
      city,
      uf,
      items
    } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => item.trim());

    const points = await knex('point')
      .join('point_item', 'point.id', '=', 'point_item.point_id')
      .whereIn('point_item.item_id', parsedItems)
      .where('point.city', String(city))
      .where('point.uf', String(uf))
      .distinct()
      .select('point.*');

    return response.json(points);

  }
};

export default PointController;