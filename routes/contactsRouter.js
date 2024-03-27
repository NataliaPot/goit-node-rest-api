import express from "express";
import { ctrl } from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";

import { isValidId } from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, ctrl.deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrl.createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

export default contactsRouter;
