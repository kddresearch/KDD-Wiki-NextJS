import { alertVariants } from "@/components/ui/alert";
import { VariantProps } from "class-variance-authority";
import { AlertNode, $createAlertNode, $isAlertNode } from "./root";
import { AlertTitleNode, $createAlertTitleNode, $isAlertTitleNode } from "./title";
import { AlertDescriptionNode, $createAlertDescriptionNode, $isAlertDescriptionNode } from "./description";

export {
  AlertNode,
  $createAlertNode,
  $isAlertNode,
  
  AlertTitleNode,
  $createAlertTitleNode,
  $isAlertTitleNode,

  AlertDescriptionNode,
  $createAlertDescriptionNode,
  $isAlertDescriptionNode,
};

type variant = VariantProps<typeof alertVariants>["variant"];
export type {
  variant
}
