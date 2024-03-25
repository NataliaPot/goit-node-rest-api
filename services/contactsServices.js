import Contact from "../models/contact.js";

export const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query).populate(
    "owner",
    "email subscription"
  );

export const getContactById = (id) =>
  Contact.findById(id, "-createdAt -updatedAt");

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = (data) => Contact.create(data);

export const updateById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, {
    new: true,
    });

export const updateStatusById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
