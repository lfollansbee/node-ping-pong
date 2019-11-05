import * as contactController from '../controller/contactController';
import express from 'express';
let router = express.Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to RESTHub crafted with love!',
  });
});

router.route('/contacts')
  .get(contactController.index)
  .post(contactController.new);

router.route('/contacts/:contact_id')
  .get(contactController.view)
  .patch(contactController.update)
  .put(contactController.update)
  .delete(contactController.delete);

export default router;