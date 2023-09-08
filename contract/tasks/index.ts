import { task, types } from "hardhat/config";
import { accounts } from "./accounts";
import { deploy, deployAndVerify } from "./deploy";

const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
const PARAMS = [ (Date.now() + ONE_DAY).toString() ];

task("accounts", "Get list of avalaible accounts").setAction(accounts);

task("deploy", "Deploys a contract")
  .addOptionalParam("name", "Contract name", "Lock", types.string)
  .addOptionalParam("params", "Contract parameters", PARAMS, types.json)
  .setAction(deploy);

task("deploy-and-verify", "Deploys and verifies a contract")
  .addOptionalParam("name", "Contract name", "Lock", types.string)
  .addOptionalParam("params", "Contract parameters", PARAMS, types.json)
  .setAction(deployAndVerify);
