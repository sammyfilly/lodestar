import BN from "bn.js";
import assert from "assert";
import {AnySSZType, assertValidValue, FullSSZType, parseType, Type} from "@chainsafe/ssz";
import {BitList, BitVector} from "@chainsafe/bit-utils";
import {intDiv} from "@chainsafe/eth2.0-utils";

/**
 * Given an ssz type, create an empty value, optionally filled in with a default value
 *
 * The default value can be only partially specified.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createValue(type: AnySSZType, defaultValue: any = null): any {
  return _createValue(parseType(type), defaultValue);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _createValue(type: FullSSZType, defaultValue: any = null): any {
  if (
    type.type !== Type.vector &&
    type.type !== Type.container
  ) {
    if (defaultValue !== null && defaultValue !== undefined) {
      assertValidValue(defaultValue, type);
      return defaultValue;
    }
  }
  const obj: {[k: string]: unknown} = {};
  switch(type.type) {
    case Type.uint:
      if (type.use === "bn") {
        return new BN(0);
      } else if (type.byteLength <= 4 || type.use === "number") {
        return 0;
      } else {
        return 0n;
      }
    case Type.bool:
      return false;
    case Type.bitList:
      return BitList.fromBitfield(Buffer.alloc(1), 1);
    case Type.bitVector:
      return BitVector.fromBitfield(Buffer.alloc(Math.max(1, intDiv(type.length, 8))), type.length);
    case Type.byteList:
      return Buffer.alloc(0);
    case Type.byteVector:
      return Buffer.alloc(type.length);
    case Type.list:
      return [];
    case Type.vector:
      if (defaultValue) {
        assert(Array.isArray(defaultValue));
      } else {
        defaultValue = [];
      }
      return Array.from({length: type.length},
        (_, i) => _createValue(type.elementType, defaultValue[i]));
    case Type.container:
      if (defaultValue) {
        assert(Object(defaultValue) === defaultValue);
      } else {
        defaultValue = {};
      }
      type.fields.forEach(([fieldName, fieldType]) => {
        obj[fieldName] = _createValue(fieldType, defaultValue[fieldName]);
      });
      return obj;
  }
}
