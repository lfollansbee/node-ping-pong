import { Contact, getContacts } from '../models/contactModel';

// Handle index actions
export function index(req, res) {
  getContacts(function (err, contacts) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }

    res.json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: contacts
    });
  });
}

// Handle create contact actions
const _new = function (req, res) {
  var contact = new Contact();
  contact.name = req.body.name ? req.body.name : contact.name;
  contact.gender = req.body.gender;
  contact.email = req.body.email;
  contact.phone = req.body.phone;
  // save the contact and check for errors
  contact.save((err) => {
    if (err)
      res.json(err);

    res.json({
      message: 'New contact created!',
      data: contact
    });
  });
};
export { _new as new };
// Handle view contact info

export function view(req, res) {
  Contact.findById(req.params.contact_id, function (err, contact) {
    if (err)
      res.send(err);
    res.json({
      message: 'Contact details loading..',
      data: contact
    });
  });
}

// Handle update contact info
export function update(req, res) {
  Contact.findById(req.params.contact_id, function (err, contact) {
    if (err)
      res.send(err);
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    // save the contact and check for errors
    contact.save(function (err) {
      if (err)
        res.json(err);
      res.json({
        message: 'Contact Info updated',
        data: contact
      });
    });
  });
}

// Handle delete contact
const _delete = function (req, res) {
  Contact.remove({
    _id: req.params.contact_id
  }, function (err, contact) {
    if (err)
      res.send(err);
    res.json({
      status: "success",
      message: 'Contact deleted'
    });
  });
};
export { _delete as delete };