import app from '../../index';
import supertest from 'supertest';
import { setupDB } from '../test-setup';
const request = supertest(app);

setupDB('activity-testing');

describe('Activity Controller', () => {
  it('Gets all activity', async done => {
    const res = await request.get('/ping-pong/activity').send();

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Activity retrieved successfully');
    expect(res.body.activity.length).toEqual(2);
    expect(res.body.activity).toMatchObject([
      {
        result: 'RYAN beat PAULO: 2-1',
        date: '2019-11-07T22:45:26.784Z',
        match_id: '5dc34eaa2cc5d6649092c456',
        winner_id: '5dc34a8fa8eb86605600a0f2',
        game_scores: [
          {
            match_winner: 21,
            match_loser: 15,
          },
          {
            match_winner: 19,
            match_loser: 21,
          },
          {
            match_winner: 21,
            match_loser: 16,
          },
        ],
      },
      {
        result: 'LUCY beat RYAN: 2-1',
        date: '2019-11-06T22:52:26.784Z',
        match_id: '5dc34eaa2cc5d6649092c123',
        winner_id: '5dc34a8fa8eb86605600a0f1',
        game_scores: [
          {
            match_winner: 21,
            match_loser: 19,
          },
          {
            match_winner: 17,
            match_loser: 21,
          },
          {
            match_winner: 25,
            match_loser: 23,
          },
        ],
      },
    ]);
    done();
  });

  it('Gets activity by player', async done => {
    const res = await request.get('/ping-pong/activity?player_id=5dc34a8fa8eb86605600a0f1').send(); // player_id is Lucy's

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Player activity retrieved successfully');
    expect(res.body.activity.length).toEqual(1);
    expect(res.body.activity).toEqual([
      {
        result: 'LUCY beat RYAN: 2-1',
        date: '2019-11-06T22:52:26.784Z',
        match_id: '5dc34eaa2cc5d6649092c123',
        winner_id: '5dc34a8fa8eb86605600a0f1',
        game_scores: [
          {
            match_winner: 21,
            match_loser: 19,
          },
          {
            match_winner: 17,
            match_loser: 21,
          },
          {
            match_winner: 25,
            match_loser: 23,
          },
        ],
      },
    ]);
    done();
  });
});
