import app from '../../index';
import supertest from 'supertest';
import {setupDB} from '../test-setup';
import { Player } from '../../models/playerModel';
const request = supertest(app);

setupDB('player-testing');

describe('Player Controller', () => {
  it('Gets all the players', async done => {
    const res = await request.get('/ping-pong/players').send();

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Players retrieved successfully');
    expect(res.body.total).toEqual(4);
    expect(res.body.data.length).toEqual(4);
    done();
  });

  it('Gets a single player', async done => {
    const res = await request.get('/ping-pong/player/5dc34a8fa8eb86605600a0f1').send();

    const expected = {
      status: 'Success',
      data: {
        _id: '5dc34a8fa8eb86605600a0f1',
        name: 'LUCY',
        matches: ['5dc34eaa2cc5d6649092c123'],
      },
    };

    expect(res.body).toMatchObject(expected);
    done();
  });

  it('Creates a new player', async done => {
    const res = await request.post('/ping-pong/players').send({ name: 'ziyad' });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('New player created!');
    expect(res.body.data.name).toEqual('ZIYAD');
    expect(res.body.data.matches.length).toEqual(0);
    expect(res.body.data._id).toBeTruthy();
    done();
  });

  it('Deletes a player', async done => {
    const players = await Player.find();
    expect(players.length).toEqual(4);

    const res = await request.delete('/ping-pong/player/5dc34a8fa8eb86605600a0f1').send();

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Player deleted');

    const updated_players = await Player.find();
    expect(updated_players.length).toEqual(3);

    done();
  });
});