import { HexDigit } from "./hexadecimalType";

type shortHex = `${HexDigit}${HexDigit}${HexDigit}`;
type longHex = `${shortHex}${shortHex}`;

export type Color = `#${shortHex | longHex}`;