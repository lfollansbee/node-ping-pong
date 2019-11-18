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
    expect(res.body.activity.length).toEqual(1);
    expect(res.body.activity).toMatchObject(['LUCY beat RYAN: 2-1']);
    done();
  });

  it('Gets activity by player', async done => {
    const res = await request.get('/ping-pong/activity?player_id=5dc34a8fa8eb86605600a0f2').send(); // player_id is Ryan's

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Player activity retrieved successfully');
    expect(res.body.activity.length).toEqual(1);
    expect(res.body.activity).toEqual(['LUCY beat RYAN: 2-1']);
    done();
  });
});
