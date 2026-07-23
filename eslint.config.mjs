import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],
    rules: {
        // localStorage/sessionStorage baslatma ve API loading state'i için mesru kullanım
        "react-hooks/set-state-in-effect": "warn",
        // Dıs CDN/kullanıcı avatarı resimleri gibi dinamik src'ler için
        "@next/next/no-img-element": "warn",
        // JSX içi özel karakter uyarıları — düzeltilecek ama kritik degil
        "react/no-unescaped-entities": "warn",
        // Date.now() gibi deterministic ama "impure" sayılan çagrılar
        "react-hooks/purity": "warn",
        // @floating-ui/react callback ref'leri
        "react-hooks/refs": "warn",
        // useTheme gibi manual memoization
        "react-hooks/preserve-manual-memoization": "warn",
    },
}]);