import {config} from "@chainsafe/lodestar-config/minimal";
import {expect} from "chai";
import supertest from "supertest";
import {urlJoin} from "../../utils";
import {BEACON_PREFIX} from "../../index.test";
import {generateAttestation} from "../../../../../utils/attestation";
import {submitPoolAttestation} from "../../../../../../src/api/rest/controllers/beacon/pool/submitPoolAttestation";
import {Attestation} from "@chainsafe/lodestar-types/lib/phase0";
import {SinonStubbedInstance} from "sinon";
import {RestApi} from "../../../../../../src/api";
import {BeaconPoolApi} from "../../../../../../src/api/impl/beacon/pool";

describe("rest - beacon - submitAttestation", function () {
  let attestation: Attestation;
  let restApi: RestApi;
  let beaconPoolStub: SinonStubbedInstance<BeaconPoolApi>;

  before(function () {
    attestation = generateAttestation();
  });

  beforeEach(function () {
    restApi = this.test?.ctx?.restApi;
    beaconPoolStub = this.test?.ctx?.beaconPoolStub;
  });

  it("should succeed", async function () {
    await supertest(restApi.server.server)
      .post(urlJoin(BEACON_PREFIX, submitPoolAttestation.url))
      .send(config.types.phase0.Attestation.toJson(attestation, {case: "snake"}) as Record<string, unknown>)
      .expect(200);
    expect(beaconPoolStub.submitAttestation.calledOnce).to.be.true;
  });

  it("should fail to parse body", async function () {
    await supertest(restApi.server.server)
      .post(urlJoin(BEACON_PREFIX, submitPoolAttestation.url))
      .send(config.types.phase0.Attestation.toJson(attestation, {case: "camel"}) as Record<string, unknown>)
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(beaconPoolStub.submitAttestation.notCalled).to.be.true;
  });
});
