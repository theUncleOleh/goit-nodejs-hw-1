const fs = require("fs/promises");
const path = require("path");
const update = require("./db/update");
const { v4 } = require("uuid");
const contactsPath = require("./db/contactsPath");

async function listContacts() {
  const list = await fs.readFile(contactsPath);
  const contacts = JSON.parse(list);

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  if (!result) {
    return null;
  }
  return result;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const [remove] = contacts.splice(idx, 1);
  await update(contacts);
  return remove;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: v4(), name, email, phone };
  contacts.push(newContact);
  await update(contacts);
  return newContact;
}

const contactsOperations = {
  listContacts,
  addContact,
  removeContact,
  getContactById,
};
module.exports = contactsOperations;
