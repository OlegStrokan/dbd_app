import { IActionLog } from "../../../services/interfaces";
import { ActionLogCreateAttr } from "../../../entity";

export const toTypeOrmLoggedActionInsert = (
  action: IActionLog
): ActionLogCreateAttr => {
  return {
    id: action.id,
    name: action.name,
    type: action.type,
    authorId: action.author.id,
    authorEmail: action.author.email,
    details: JSON.stringify(action.details),
    timestamp: action.timestamp,
    parentActionId: action.parentActionId,
  };
};

export const toTypeOrmLoggedActionEntity = (
  attr: ActionLogCreateAttr
): IActionLog => {
  return {
    id: attr.id,
    name: attr.name,
    type: attr.type,
    author: {
      id: attr.authorId,
      email: attr.authorEmail,
    },
    details: JSON.parse(attr.details),
    timestamp: attr.timestamp,
    parentActionId: attr.parentActionId,
  };
};
