# lodestar-types

[![npm](https://img.shields.io/npm/v/@lodestar/types)](https://www.npmjs.com/package/@lodestar/types)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Eth Consensus Spec v1.1.10](https://img.shields.io/badge/ETH%20consensus--spec-1.1.10-blue)](https://github.com/ethereum/consensus-specs/releases/tag/v1.1.10)
![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)

> This package is part of [ChainSafe's Lodestar](https://lodestar.chainsafe.io) project

Lodestar defines all data types defined in the [Ethereum Consensus spec](https://github.com/ethereum/consensus-specs). This tooling can be used for any Typescript project looking to operate on these types. Both Typescript interfaces _and_ Simple Serialize (SSZ) methods are exported for consumers.

## Installation

```sh
npm install @lodestar/types
```

## Usage

The lodestar types library organizes data types on several dimensions:

- Typescript interfaces vs SSZ objects
- By fork

### Typescript interfaces

Lodestar types are all defined as typescript interfaces. These interfaces can be used independently, and are used throughout downstream Lodestar packages (in the beacon node).

These interfaces are accessible via named exports.

```typescript
import {Epoch} from "@lodestar/types";

const x: Epoch = 5;
```

### SSZ objects

Lodestar types are also defined as SSZ objects. These "Type" objects provide convenient methods to perform SSZ operations (serialization / deserialization / merkleization/etc). The library exports a singleton object containing all SSZ objects.

```typescript
import {Type} from "@chainsafe/ssz";
import {ssz, Epoch} from "@lodestar/types";

const EpochType: Type<Epoch> = ssz.Epoch;

const e = EpochType.defaultValue();
```

### By fork

Lodestar types support multiple different consensus forks. In order to easily differentiate types that may change across forks, types are organized in namespaces according to the fork in which they're introduced. Types introduced in phase 0 are available under the `phase0` namespace. Types introduced in altair are available under the `altair` namespace.

```typescript
import {altair, phase0, ssz} from "@lodestar/types";

const phase0State: phase0.BeaconState = ssz.phase0.BeaconState.defaultValue();
const altairState: altair.BeaconState = ssz.altair.BeaconState.defaultValue();
```

Primitive types are directly available without a namespace.

```typescript
import {Epoch, ssz} from "@lodestar/types";

const epoch: Epoch = ssz.Epoch.defaultValue();
```

In some cases, we need interfaces that accept types across all forks, like when the fork is not known ahead of time. Typescript interfaces for this purpose are exported under the `allForks` namespace. SSZ Types typed to these interfaces are also provided under an `allForks` namespace, but keyed by `ForkName`.

```typescript
import {ForkName} from "@lodestar/params";
import {allForks, ssz} from "@lodestar/types";

const state: allForks.BeaconState = ssz.allForks[ForkName.phase0].BeaconState.defaultValue();
```

## License

Apache-2.0 [ChainSafe Systems](https://chainsafe.io)
