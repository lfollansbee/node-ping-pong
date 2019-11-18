import app from '../../index';
import supertest from 'supertest';
import { setupDB } from '../test-setup';
import { Player } from '../../models/playerModel';
import { Game } from '../../models/gameModel';
import { Match } from '../../models/matchModel';
const request = supertest(app);

setupDB('match-testing');

describe('Match Controller', () => {
  it('Gets all the matches', async done => {
    const res = await request.get('/ping-pong/matches').send();

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Matches retrieved successfully');
    expect(res.body.total).toEqual(3);
    expect(res.body.matches.length).toEqual(3);
    done();
  });

  it('Gets a single match', async done => {
    const res = await request.get('/ping-pong/match/5dc34eaa2cc5d6649092c123').send();

    const expected = {
      status: 'Success',
      match: {
        player1_games_won: 2,
        player2_games_won: 1,
        best_of: 3,
        games: [
          '5dc34f76499d816612f8dac1',
          '5dc34f76499d816612f8dac2',
          '5dc34f76499d816612f8dac3',
        ],
        _id: '5dc34eaa2cc5d6649092c123',
        player1_id: '5dc34a8fa8eb86605600a0f1',
        player2_id: '5dc34a8fa8eb86605600a0f2',
        date: '2019-11-06T22:52:26.784Z',
        __v: 0,
      },
    };

    expect(res.body).toMatchObject(expected);
    done();
  });

  it('Creates a new match, adding its id to the players', async done => {
    const player1 = await Player.findById('5dc34a8fa8eb86605600a0f1');
    const player2 = await Player.findById('5dc34a8fa8eb86605600a0f3');
    expect(player1.matches.length).toEqual(1);
    expect(player2.matches.length).toEqual(2);

    const res = await request.post('/ping-pong/matches').send({
      player1_id: '5dc34a8fa8eb86605600a0f1',
      player2_id: '5dc34a8fa8eb86605600a0f3',
      best_of: 5,
    });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Match created');
    expect(res.body.match.games.length).toEqual(0);
    expect(res.body.match.player1_id).toEqual('5dc34a8fa8eb86605600a0f1');
    expect(res.body.match.player2_id).toEqual('5dc34a8fa8eb86605600a0f3');
    expect(res.body.match._id).toBeTruthy();

    const updated_player1 = await Player.findById('5dc34a8fa8eb86605600a0f1');
    const updated_player2 = await Player.findById('5dc34a8fa8eb86605600a0f3');
    expect(updated_player1.matches.length).toEqual(2);
    expect(updated_player2.matches.length).toEqual(3);

    done();
  });

  it('Ends a match, updating winning player\'s win record', async done => {
    const paulo = await Player.findById('5dc34a8fa8eb86605600a0f3');
    const pavan = await Player.findById('5dc34a8fa8eb86605600a0f4');
    expect(paulo.matches_won).toEqual(0);
    expect(pavan.matches_won).toEqual(0);

    const res = await request.patch('/ping-pong/match/5dc34eaa2cc5d6649092c789').send();

    const updated_paulo = await Player.findById('5dc34a8fa8eb86605600a0f3');
    const updated_pavan = await Player.findById('5dc34a8fa8eb86605600a0f4');
    expect(updated_paulo.matches_won).toEqual(1);
    expect(updated_pavan.matches_won).toEqual(0);

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Match completed');

    done();
  });

  it('Deletes a match, any games within that match, and removes the match from the players\' matches', async done => {
    const games = await Game.find();
    expect(games.length).toEqual(9);
    
    const matches = await Match.find();
    expect(matches.length).toEqual(3);

    const players = await Player.find({matches: '5dc34eaa2cc5d6649092c789'});
    expect(players.length).toEqual(2);

    const winner_ryan = await Player.findById('5dc34a8fa8eb86605600a0f2');
    expect(winner_ryan.matches_won).toEqual(1);

    const res = await request.delete('/ping-pong/match/5dc34eaa2cc5d6649092c456').send();

    const updated_games = await Game.find();
    const updated_players = await Player.find({matches: '5dc34eaa2cc5d6649092c456'});
    const updated_matches = await Match.find();
    const updated_ryan = await Player.findById('5dc34a8fa8eb86605600a0f2');
    
    expect(updated_ryan.matches_won).toEqual(0);
    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Match deleted');
    expect(updated_games.length).toEqual(6);
    expect(updated_players.length).toEqual(0);
    expect(updated_matches.length).toEqual(2);

    done();
  });
});