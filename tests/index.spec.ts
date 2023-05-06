import "mocha";
import { expect } from "chai";
import { hola } from "../src/index.js";


describe("index.ts", () => {
  // Tests that calling the hola function returns "Hola mundo". 
  it("test_hola_returns_hola_mundo", () => {
      expect(hola()).to.be.equal("Hola mundo");
  });
});