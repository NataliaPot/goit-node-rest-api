import express from "express";
import { ctrl } from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";

import { isValidId } from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), ctrl.createContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

export default contactsRouter;
