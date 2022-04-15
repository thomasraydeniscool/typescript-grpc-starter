import path from "path";
import execa from "execa";
import del from "del";
import fs from "fs";

const PROJECT_DIR = path.join(__dirname, "..");
const NODE_MODULES_DIR = path.join(PROJECT_DIR, "node_modules");

const PROTOS_DIR = path.join(PROJECT_DIR, "protos");
const MODELS_DIR = path.join(PROJECT_DIR, "src/models");
const TOOLS_DIR = path.join(NODE_MODULES_DIR, "grpc-tools/bin");

const PROTOC_PATH = path.join(TOOLS_DIR, "protoc");
const PLUGIN_PATH = path.join(NODE_MODULES_DIR, ".bin/protoc-gen-ts_proto");

// https://github.com/stephenh/ts-proto#usage
const args = [
  `--plugin=${PLUGIN_PATH}`,
  // https://github.com/stephenh/ts-proto/blob/main/README.markdown
  "--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true",
  `--ts_proto_out=${MODELS_DIR}`,
  `--proto_path=${PROTOS_DIR}`,
];

export const run = async () => {
  await del([`${MODELS_DIR}/*`], { ignore: [`${MODELS_DIR}/tsconfig.json`] });

  const protos = fs.readdirSync(PROTOS_DIR);

  await execa(PROTOC_PATH, [...args, protos.join(" ")]);
};

run();