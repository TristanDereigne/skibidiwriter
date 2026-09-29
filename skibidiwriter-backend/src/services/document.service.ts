import { TextCrdt, type DocumentOperation } from "skibidiwriter-shared";

const document = new TextCrdt("server");

function operations() {
  return document.toOperations();
}

function apply(incoming: DocumentOperation[]) {
  return document.apply(incoming);
}

export default {
  operations,
  apply,
};
