"use client";
import styles from "./header.module.css";
import BubbleChart from "../BubbleChart/BubbleChart";
const data = [
  { name: "A", x: 1, y: 1, value: 10000, r: 15 },
  { name: "B", x: 2, y: 2, value: 20000, r: 15 },
  { name: "C", x: 3, y: 3, value: 30000, r: 15 },
  { name: "D", x: 4, y: 4, value: 40000, r: 15 },
  { name: "E", x: 5, y: 5, value: 50000, r: 15 },
  { name: "F", x: 6, y: 6, value: 60000, r: 15 },
  // ...Array.from({ length: 40 }, (_, i) => ({
  //   name: String.fromCharCode(71 + i), // Starting from 'G'
  //   x: 7 + i,
  //   y: 7 + i,
  //   value: 70000 + 10000 * i,
  //   r: 15,
  // })),
];
export default function Header() {
  return (
    <div className={styles.header}>
      <BubbleChart data={data} />
    </div>
  );
}
