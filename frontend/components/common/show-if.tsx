import React from "react";

export interface Props {
  children: React.ReactNode;
  condition: boolean;
}

/**
 * Shows the child nodes if the supplied condition is true
 */
export function ShowIf({ condition, children }: Props) {
  return <React.Fragment>{(condition && children) || null}</React.Fragment>;
}
