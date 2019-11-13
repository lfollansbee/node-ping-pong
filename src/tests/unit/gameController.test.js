import app from '../../index';
import supertest from 'supertest';
import { setupDB } from '../test-setup';
import { Game } from '../../models/gameModel';
import { Match } from '../../models/matchModel';
const request = supertest(app);

setupDB('game-testing');

describe('Game Controller', () => {
  it('Gets all the games', async done => {
    const res = await request.get('/ping-pong/games').send();

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Games retrieved successfully');
    expect(res.body.total).toEqual(9);
    expect(res.body.data.length).toEqual(9);
    done();
  });

  it('Gets a single game', async done => {
    const res = await request.get('/ping-pong/game/5dc34f76499d816612f8dac1').send();

    const expected = {
      status: 'Success',
      data: {
        player1_score: 21,
        player2_score: 19,
        _id: '5dc34f76499d816612f8dac1',
        match_id: '5dc34eaa2cc5d6649092c123',
        __v: 0,
      },
    };

    expect(res.body).toMatchObject(expected);
    done();
  });

  it('Submits a new game, adding its _id to the match it belongs to and updating the match\'s score', async done => {
    const match = await Match.findById('5dc34eaa2cc5d6649092c123');
    expect(match.games.length).toEqual(3);
    expect(match.player1_games_won).toEqual(2);
    expect(match.player2_games_won).toEqual(1);

    // match_id is request parameter
    const res = await request.post('/ping-pong/game/5dc34eaa2cc5d6649092c123').send({
      player1_score: 19,
      player2_score: 21,
    });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Game submitted successfully');
    expect(res.body.data.game._id).toBeTruthy();
    expect(res.body.data.game.player1_score).toEqual(19);
    expect(res.body.data.game.player2_score).toEqual(21);

    expect(res.body.data.player1_games_won).toEqual(2);
    expect(res.body.data.player2_games_won).toEqual(2);

    const game_id = res.body.data.game._id;
    const updated_match = await Match.findById('5dc34eaa2cc5d6649092c123');
    expect(updated_match.games.length).toEqual(4);

    const new_game_id_idx = updated_match.games.length - 1;

    expect(updated_match.games[new_game_id_idx].toString()).toEqual(game_id.toString());
    expect(updated_match.player1_games_won).toEqual(2);
    expect(updated_match.player2_games_won).toEqual(2);

    done();
  });

  // Original Game:
  // {
  //   player1_score: 21,
  //   player2_score: 15,
  //   _id: '5dc34f76499d816612f8dab3',
  //   match_id: '5dc34eaa2cc5d6649092c789',
  // }
  it('Edit a game: if the score has changed, but the winner is the same', async done => {
    const res = await request.patch('/ping-pong/game/5dc34f76499d816612f8dab3').send({
      player1_score: 21,
      player2_score: 18,
    });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Game updated successfully');
    expect(res.body.data.game.player1_score).toEqual(21);
    expect(res.body.data.game.player2_score).toEqual(18);
    expect(res.body.data.player1_games_won).toEqual(2);
    expect(res.body.data.player2_games_won).toEqual(1);

    done();
  });

  it('Edit a game: if the score has changed and the winner is different', async done => {
    const res = await request.patch('/ping-pong/game/5dc34f76499d816612f8dab3').send({
      player1_score: 15,
      player2_score: 21,
    });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Game updated successfully');
    expect(res.body.data.game.player1_score).toEqual(15);
    expect(res.body.data.game.player2_score).toEqual(21);
    expect(res.body.data.player1_games_won).toEqual(1);
    expect(res.body.data.player2_games_won).toEqual(2);

    done();
  });

  it('Edit a game: if score has not changed', async done => {
    const res = await request.patch('/ping-pong/game/5dc34f76499d816612f8dab3').send({
      player1_score: 21,
      player2_score: 15,
    });

    expect(res.body.status).toEqual('Success');
    expect(res.body.message).toEqual('Game updated successfully');
    expect(res.body.data.game.player1_score).toEqual(21);
    expect(res.body.data.game.player2_score).toEqual(15);
    expect(res.body.data.player1_games_won).toEqual(2);
    expect(res.body.data.player2_games_won).toEqual(1);

    done();
  });

  it('Edit a game: returns error if game is not found', async done => {
    const res = await request.patch('/ping-pong/game/1dc11f11111a11111f1lbf1').send();

    expect(res.body.status).toEqual(404);
    expect(res.body.message).toEqual('No Game found with game_id: 1dc11f11111a11111f1lbf1');
    done();
  });

  const delete_testCases = [
    {
      game_id: '5dc34f76499d816612f8dab3',
      match_id: '5dc34eaa2cc5d6649092c789',
      desc: 'player1',
      player1_games_won: 1,
      player2_games_won: 1,
    },
    {
      game_id: '5dc34f76499d816612f8dac2',
      match_id: '5dc34eaa2cc5d6649092c123',
      desc: 'player2',
      player1_games_won: 2,
      player2_games_won: 0,
    },
  ];

  delete_testCases.forEach((testCase) => {
    it(`Deletes a game that ${testCase.desc} won, removes the game _id from its match and updates the match score`, async done => {
      const games = await Game.find();
      expect(games.length).toEqual(9);

      const match1 = await Match.findById(testCase.match_id);
      expect(match1.games.length).toEqual(3);

      const res1 = await request.delete(`/ping-pong/game/${testCase.game_id}`).send();

      let updated_games = await Game.find();
      const updated_match1 = await Match.findById(testCase.match_id);

      expect(res1.body.status).toEqual('Success');
      expect(res1.body.message).toEqual('Game deleted');

      expect(updated_games.length).toEqual(8);
      expect(updated_match1.games.length).toEqual(2);
      expect(updated_match1.player1_games_won).toEqual(testCase.player1_games_won);
      expect(updated_match1.player2_games_won).toEqual(testCase.player2_games_won);

      done();
    });
  });
});
