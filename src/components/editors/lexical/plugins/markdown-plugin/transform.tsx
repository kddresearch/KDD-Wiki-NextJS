import {
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  Transformer,
} from "@lexical/markdown";
import {
  ALERT,
  QUOTE_OR_ALERT_DESCRIPTION
} from "../../nodes/alert/transform";
import { QuoteNode } from "@lexical/rich-text";

const TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export const KDD_TRANSFORMERS = [
  ALERT,
  QUOTE_OR_ALERT_DESCRIPTION,
  ...TRANSFORMERS.filter((transformer) => { // TODO: PR to lexical to add a multiline transformer
    if (transformer.type !== 'element') {
      return transformer
    }

    if (transformer.dependencies.includes(QuoteNode)) {
      return false
    }

    return transformer
  }),
]