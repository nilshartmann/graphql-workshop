import * as React from "react";
import styles from "./ButtonBar.module.scss";

interface ButtonBarProps {
  children: React.ReactNode;
}

export default function ButtonBar({ children }: ButtonBarProps) {
  return <div className={styles.ButtonBar}>{children}</div>;
}
