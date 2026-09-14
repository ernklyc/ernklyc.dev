import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "mobile/**", "out/**", "build/**"],
    rules: {
      // Mevcut React 19 bileşenleri bu yeni React Compiler tavsiyelerini henüz
      // kademeli uyguluyor; doğruluk kuralları aktif kalmaya devam eder.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default eslintConfig;
