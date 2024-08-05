import { TRANSFORMERS } from "@lexical/markdown";
import { ALERT } from "../../nodes/alert/transform";

export const KDD_TRANSFORMERS = [
  ...TRANSFORMERS,
  ALERT
]